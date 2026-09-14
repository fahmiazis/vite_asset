# Dokumentasi Backend — `backend_aset_go`

Dokumen ini merangkum seluruh fitur yang sudah diimplementasikan pada backend Go untuk sistem manajemen aset (Asset Management System). Dokumen dibuat berdasarkan hasil pembacaan source code aktual (main.go, routes, controllers, services, models, middleware, config) — bukan asumsi dari nama folder saja.

> Catatan: dokumen ini murni dokumentasi, tidak ada perubahan kode yang dilakukan.

---

## 1. Arsitektur Umum

**Module:** `backend-go` (Go 1.25.6)

**Tech stack:**
- **Web framework:** [Gin](https://github.com/gin-gonic/gin)
- **ORM:** [GORM](https://gorm.io) dengan driver MySQL
- **Database:** MySQL 8.0 (lihat `docker-compose.yml`)
- **Migrasi database:** [Goose](https://github.com/pressly/goose) — file SQL di folder `/migrations` (AutoMigrate GORM sengaja **dimatikan**, migrasi dikontrol manual via Goose/Makefile)
- **Autentikasi:** JWT (`golang-jwt/jwt/v5`) — access token + refresh token
- **Hashing password:** bcrypt
- **CORS:** `gin-contrib/cors`
- **Scheduler:** `robfig/cron/v3` — dipakai untuk job depresiasi bulanan
- **UUID:** `google/uuid` (dipakai untuk tabel master/config), sedangkan tabel transaksi/aset memakai `uint` auto-increment
- **Env loader:** `joho/godotenv`
- **Containerization/CI:** Docker, Docker Compose, Jenkinsfile, Makefile

### Struktur folder

```
backend_aset_go/
├── config/       → koneksi database (GORM + MySQL)
├── controllers/  → HTTP handler (Gin), 1 file per domain (22 file)
├── dto/          → request/response struct, 1 file per domain (22 file)
├── middleware/    → auth_middleware.go (JWT auth, RBAC, permission-based ACL)
├── migrations/    → file migrasi SQL (Goose), 49 file
├── models/        → struct entity GORM (39 file)
├── routes/        → registrasi route, 1 file per domain (22 file) + routes.go
├── services/       → business logic (27 file) — controller memanggil service, service memanggil GORM langsung (tidak ada repository layer)
├── scheduler/      → cron job depresiasi bulanan
├── seeder/         → seed data SQL (approval flow, kategori aset)
├── utils/          → jwt.go (generate/validate token), response.go (format response JSON standar)
└── uploads/        → penyimpanan file lokal
```

**Pola arsitektur:** MVC sederhana berlapis — Controller → Service → GORM/DB langsung. Tidak ada repository/interface abstraction, tidak ada dependency injection framework. `config.DB` adalah singleton `*gorm.DB` global.

### Alur startup (`main.go`)

1. Load `.env` via godotenv
2. `config.ConnectDatabase()` — membangun DSN MySQL dari env var, connect GORM (AutoMigrate dimatikan)
3. `gin.Default()` — engine Gin default (sudah termasuk Logger + Recovery middleware)
4. Middleware CORS — `AllowAllOrigins: true`, method GET/POST/PUT/DELETE/OPTIONS, credentials diizinkan
5. `routes.SetupRoutes(r)` — mount seluruh route module di bawah prefix `/api/v1`
6. `scheduler.StartScheduler()` — menjalankan cron scheduler (di-stop saat shutdown)
7. Listen di env `PORT` (default `8080`)

Endpoint `GET /health` tersedia di luar `/api/v1`, tanpa autentikasi.

---

## 2. Seluruh API Endpoint

Semua route ada di bawah prefix **`/api/v1`**, kecuali `/health`.

Legenda otorisasi:
- 🔓 = publik (tanpa login)
- 🔑 = butuh login (`AuthMiddleware`) saja
- 👤`role` = butuh role tertentu (`RequireRole`)
- 🔐`permission` = butuh permission spesifik dari menu (`RequirePermission`)

### 2.1 Auth (`/auth`)

| Method | Path | Auth |
|---|---|---|
| POST | `/auth/register` | 🔓 |
| POST | `/auth/login` | 🔓 |
| POST | `/auth/refresh` | 🔓 |
| GET | `/auth/me` | 🔑 |
| POST | `/auth/logout` | 🔑 |
| POST | `/auth/logout-all` | 🔑 |

### 2.2 Users (`/users`)

| Method | Path | Auth |
|---|---|---|
| GET | `/users` | 👤admin |
| POST | `/users` | 👤admin |
| PUT | `/users/:id` | 👤admin |
| DELETE | `/users/:id` | 👤admin |
| POST | `/users/:id/roles` | 👤admin |
| GET | `/users/:id` | 👤admin, manager |
| GET | `/users/:id/branchs` | 🔑 |
| POST | `/users/:id/branchs` | 👤admin |
| DELETE | `/users/:id/branchs/:branch_id` | 👤admin |

### 2.3 Branches (`/branchs`)

| Method | Path | Auth |
|---|---|---|
| GET | `/branchs` | 🔑 |
| GET | `/branchs/:id` | 🔑 |
| GET | `/branchs/:id/users` | 🔑 |
| POST | `/branchs` | 👤admin |
| PUT | `/branchs/:id` | 👤admin |
| DELETE | `/branchs/:id` | 👤admin |

### 2.4 Homebase & Nomor Transaksi (`/user`, `/transaction-number`)

| Method | Path | Auth |
|---|---|---|
| GET | `/user/homebases` | 🔑 |
| POST | `/user/homebase/set-active` | 🔑 |
| POST | `/transaction-number/generate` | 🔑 |
| POST | `/transaction-number/mark-used` | 🔑 |
| POST | `/transaction-number/mark-expired` | 🔑 |
| GET | `/transaction-number/status/:number` | 🔑 |

### 2.5 Menus (`/menus`, `/roles/:id/menus`)

| Method | Path | Auth |
|---|---|---|
| GET | `/menus/sidebar` | 🔑 |
| GET | `/menus` | 👤admin |
| POST | `/menus` | 👤admin |
| GET | `/menus/:id` | 👤admin |
| PUT | `/menus/:id` | 👤admin |
| DELETE | `/menus/:id` | 👤admin |
| GET | `/roles/:id/menus` | 👤admin, manager |
| POST | `/roles/:id/menus` | 👤admin |

### 2.6 Roles (`/roles`)

| Method | Path | Auth |
|---|---|---|
| GET | `/roles` | 👤admin, manager |
| GET | `/roles/:id` | 👤admin, manager |
| POST | `/roles` | 👤admin |
| PUT | `/roles/:id` | 👤admin |
| DELETE | `/roles/:id` | 👤admin |

### 2.7 Approval Flow & Transaction Approval

`/approval-flows`, `/approval-flow-steps`, `/transaction-approvals`

| Method | Path | Auth |
|---|---|---|
| GET/POST | `/approval-flows` | 👤admin |
| GET/PUT/DELETE | `/approval-flows/:id` | 👤admin |
| GET | `/approval-flows/code/:code` | 👤admin |
| POST | `/approval-flow-steps` | 👤admin |
| PUT/DELETE | `/approval-flow-steps/:id` | 👤admin |
| PUT | `/approval-flow-steps/step-order-change/:id` | 👤admin (reorder step massal) |
| POST | `/transaction-approvals/initiate` | 🔐create_transaction |
| POST | `/transaction-approvals/approve` | 🔑 (divalidasi terhadap user/role/branch yang ditugaskan) |
| POST | `/transaction-approvals/reject` | 🔑 |
| GET | `/transaction-approvals/status/:transaction_number/:transaction_type` | 🔑 |
| GET | `/transaction-approvals/pending` | 🔑 (approval pending milik user saat ini) |

### 2.8 Custom Approval Flow (`/custom-approvals`)

Approval flow yang dikustomisasi oleh user, perlu verifikasi admin/asset_team.

| Method | Path | Auth |
|---|---|---|
| GET | `/custom-approvals/me` | 🔑 |
| POST | `/custom-approvals` | 🔑 |
| PUT | `/custom-approvals/:id` | 🔑 (pemilik atau admin) |
| DELETE | `/custom-approvals/:id` | 🔑 |
| GET | `/custom-approvals/pending-verifications` | 👤admin, asset_team |
| POST | `/custom-approvals/:id/verify` | 👤admin, asset_team |
| GET | `/approval-flows/:id/can-customize` | 🔑 |

### 2.9 Asset Categories (`/asset-categories`)

| Method | Path | Auth |
|---|---|---|
| GET | `/asset-categories`, `/asset-categories/:id` | 🔑 |
| POST/PUT/DELETE | `/asset-categories`, `/asset-categories/:id` | 👤admin |

### 2.10 Asset Master & History (`/assets`, `/asset-histories`)

| Method | Path | Auth |
|---|---|---|
| GET | `/assets` | 🔑 (filter & pagination) |
| GET | `/assets/:number` | 🔑 |
| GET | `/assets/:number/value-history` | 🔑 |
| GET | `/assets/:number/history` | 🔑 |
| GET | `/asset-histories` | 🔑 (list gabungan semua aset, dengan filter) |

### 2.11 Depreciation (`/depreciation-settings`, `/depreciation`)

| Method | Path | Auth |
|---|---|---|
| GET | `/depreciation-settings`, `/:id` | 🔑 |
| POST/PUT/DELETE | `/depreciation-settings`, `/:id` | 👤admin |
| GET | `/depreciation/monthly` | 🔑 |
| POST | `/depreciation/calculate` | 👤admin |
| POST | `/depreciation/calculations/lock` | 👤admin |

### 2.12 Attachments (`/attachment-configs`, `/attachments`)

| Method | Path | Auth |
|---|---|---|
| GET | `/attachment-configs`, `/:id` | 🔑 |
| POST/PUT/DELETE | `/attachment-configs`, `/:id` | 👤admin |
| GET | `/attachments?transaction_number&transaction_type&stage` | 🔑 |
| GET | `/attachments/status` | 🔑 |
| GET | `/attachments/:id/file?download=true\|false` | 🔑 (serve/unduh file) |
| POST | `/attachments/upload` (multipart) | 🔐upload_attachment, create_transaction |
| PUT | `/attachments/:id/review` | 🔐review_attachment |

### 2.13 Transaksi umum (lintas modul) (`/transactions`)

| Method | Path | Auth |
|---|---|---|
| GET | `/transactions` | 🔑 (filter: type, status, rentang tanggal, pagination) |
| GET | `/transactions/my` | 🔑 |
| GET | `/transactions/detail` | 🔑 |

### 2.14 Procurement — legacy CRUD (`/transactions/procurement`)

| Method | Path | Auth |
|---|---|---|
| POST | `/transactions/procurement` | 🔐create_transaction |
| GET | `/transactions/procurement` | 🔑 |
| GET | `/transactions/procurement/detail` | 🔑 |
| PUT/DELETE | `/transactions/procurement/` | 🔑 |

### 2.15 Procurement Flow — workflow lengkap (`/transactions/procurement`)

| Method | Path | Auth | Transisi tahap |
|---|---|---|---|
| GET | `/transactions/procurement/detail-stage` | 🔑 | — |
| GET | `/transactions/procurement/approval-status` | 🔑 | — |
| GET | `/transactions/procurement/gr` | 🔑 | — |
| POST | `/transactions/procurement/submit` | 🔐create_transaction | DRAFT → ASSET_VERIFICATION |
| POST | `/transactions/procurement/verify` | 🔐verify_asset | ASSET_VERIFICATION → APPROVAL |
| POST | `/transactions/procurement/approval/initiate` | 🔐manage_approval | trigger flow `PROCUREMENT_APPROVAL` |
| POST | `/transactions/procurement/approval/complete` | 🔐manage_approval | APPROVAL → PROCESS_BUDGET |
| POST | `/transactions/procurement/process-budget` | 🔐process_budget | PROCESS_BUDGET → EXECUTE_ASET (generate nomor IO per cabang) |
| POST | `/transactions/procurement/execute` | 🔐execute_asset | EXECUTE_ASET → GR (membuat record Asset + AssetAcquisition) |
| POST | `/transactions/procurement/gr` | 🔐create_transaction, gr | Good Receipt per item; otomatis → FINISHED saat semua sudah di-GR |
| POST | `/transactions/procurement/reject` | 🔐reject_transaction | tahap manapun (kecuali draft/finished) → REJECTED |
| PUT | `/transactions/procurement/revise` | 🔐update_transaction | revisi item, reset ke tahap yang sesuai |

**Alur tahap:** `DRAFT → ASSET_VERIFICATION → APPROVAL → PROCESS_BUDGET → EXECUTE_ASET → GR → FINISHED` (atau `→ REJECTED`)

### 2.16 Mutation — legacy CRUD (`/mutation`)

| Method | Path | Auth |
|---|---|---|
| POST/GET | `/mutation` | 🔐create_transaction / 🔑 |
| GET/PUT/DELETE | `/mutation/:number` | 🔑 |

### 2.17 Mutation Flow — workflow lengkap (`/transactions/mutation`)

| Method | Path | Auth | Transisi tahap |
|---|---|---|---|
| POST | `/transactions/mutation` | 🔐create_transaction | buat draft |
| GET | `/transactions/mutation`, `/detail` | 🔑 | — |
| POST | `/transactions/mutation/draft/add-asset` | 🔐create_transaction | tambah aset ke draft |
| DELETE | `/transactions/mutation/draft/remove-asset` | 🔐create_transaction | hapus aset dari draft |
| POST | `/transactions/mutation/draft/submit` | 🔐create_transaction | DRAFT → APPROVAL |
| POST | `/transactions/mutation/approval/initiate` | 🔐manage_approval | trigger flow `MUTATION_APPROVAL` |
| GET | `/transactions/mutation/approval/status` | 🔑 | — |
| POST | `/transactions/mutation/confirm-receiving` | 🔐confirm_receiving, create_transaction | MUTATION_RECEIVING → EXECUTE_MUTATION (konfirmasi oleh cabang tujuan) |
| POST | `/transactions/mutation/execute` | 🔐execute_mutation | EXECUTE_MUTATION → FINISHED (update `branch_code` aset) |
| POST | `/transactions/mutation/reject` | 🔐reject_transaction | → REJECTED |
| POST | `/transactions/mutation/attachments/upload` | 🔐upload_attachment, create_transaction | |
| PUT | `/transactions/mutation/attachments/:id/review` | 🔐review_attachment | |
| GET | `/transactions/mutation/attachments/status` | 🔑 | |

**Alur tahap:** `DRAFT → APPROVAL → MUTATION_RECEIVING → EXECUTE_MUTATION → FINISHED` (atau `→ REJECTED`)

### 2.18 Disposal — legacy CRUD (`/transactions/disposal/old`)

| Method | Path | Auth |
|---|---|---|
| POST/GET | `/transactions/disposal/old` | 🔐create_transaction / 🔑 |
| GET/PUT/DELETE | `/transactions/disposal/old/:number` | 🔑 |

### 2.19 Disposal Flow — workflow paling kompleks (`/transactions/disposal`)

Mendukung dua tipe disposal: **DISPOSE** (write-off/scrap) dan **SELL** (dijual).

| Method | Path | Auth | Transisi tahap |
|---|---|---|---|
| POST | `/transactions/disposal` | 🔐create_transaction | buat draft |
| GET | `/transactions/disposal` | 🔑 | list (filter: disposal_type, status, current_stage, created_by, rentang tanggal) |
| GET | `/transactions/disposal/detail` | 🔑 | — |
| POST | `/transactions/disposal/draft/add-asset` | 🔐create_transaction | tambah aset |
| DELETE | `/transactions/disposal/draft/remove-asset` | 🔐create_transaction | hapus aset |
| POST | `/transactions/disposal/draft/submit` | 🔐create_transaction | DRAFT → PURCHASING (SELL) / APPROVAL_REQUEST (DISPOSE) |
| POST | `/transactions/disposal/purchasing/set-sale-values` | 🔐manage_purchasing | PURCHASING → APPROVAL_REQUEST (khusus SELL, set `sale_value` per aset) |
| POST | `/transactions/disposal/approval-request/initiate` | 🔐manage_approval | trigger flow `DISPOSAL_APPROVAL_REQUEST` |
| GET | `/transactions/disposal/approval-request/status` | 🔑 | — |
| POST | `/transactions/disposal/approval-agreement/initiate` | 🔐manage_approval | trigger flow `DISPOSAL_APPROVAL_AGREEMENT` |
| GET | `/transactions/disposal/approval-agreement/status` | 🔑 | — |
| POST | `/transactions/disposal/execute` | 🔐execute_disposal | EXECUTE → FINANCE (SELL) / ASSET_DELETION (DISPOSE) |
| POST | `/transactions/disposal/finance/confirm` | 🔐manage_finance | FINANCE → TAX (khusus SELL) |
| POST | `/transactions/disposal/tax/confirm` | 🔐manage_tax | TAX → ASSET_DELETION (khusus SELL) |
| POST | `/transactions/disposal/asset-deletion/confirm` | 🔐execute_asset_deletion | ASSET_DELETION → FINISHED (status aset → DISPOSED, value dinolkan, nomor dokumen digenerate) |
| POST | `/transactions/disposal/reject` | 🔐reject_transaction | → REJECTED (mengembalikan status aset) |
| POST | `/transactions/disposal/attachments/upload` | 🔐upload_attachment | attachment per-aset per-tahap |
| PUT | `/transactions/disposal/attachments/:id/review` | 🔐review_attachment | |
| GET | `/transactions/disposal/attachments/status` | 🔑 | |

**Alur tahap DISPOSE:** `DRAFT → APPROVAL_REQUEST → APPROVAL_AGREEMENT → EXECUTE → ASSET_DELETION → FINISHED`

**Alur tahap SELL:** `DRAFT → PURCHASING → APPROVAL_REQUEST → APPROVAL_AGREEMENT → EXECUTE → FINANCE → TAX → ASSET_DELETION → FINISHED`

### 2.20 Stock Opname (`/transactions/stock-opname`)

| Method | Path | Auth |
|---|---|---|
| POST | `/transactions/stock-opname` | 🔐create_transaction |
| GET | `/transactions/stock-opname` | 🔑 |
| GET/PUT/DELETE | `/transactions/stock-opname/:number` | 🔑 (update/delete hanya untuk DRAFT milik sendiri) |

### 2.21 Health check

`GET /health` — di luar `/api/v1`, tanpa autentikasi.

---

## 3. Model Data / Skema Database

### 3.1 Identity / Auth / RBAC

- **User**: `id`(UUID PK), `username`(unik), `fullname`, `email`(unik), `password`(bcrypt), `nik`(unik, nullable), `mpn_number`, `status`(active/inactive), soft delete. Relasi: banyak `RefreshToken`, `UserRole`, `FCMToken`.
- **RefreshToken**: `user_id`, `token`, `device_info`, `ip_address`, `expires_at`, `is_revoked` — mendukung sesi multi-device.
- **FCMToken**: `user_id`, `token`, `device_id`, `platform`(android/ios/web), `is_active` — registrasi device untuk push notification (belum ada service pengiriman notifikasi, baru penyimpanan token).
- **Role**: `id`, `name`(unik), `description`. Relasi: banyak `UserRole`.
- **UserRole**: relasi many-to-many User↔Role.
- **Branch**: `id`, `branch_code`(auto-generate, format `BC000001`), `branch_name`, `branch_type`, `status`, soft delete.
- **UserBranch**: relasi User↔Branch dengan `branch_type` (`homebase`/`temporary`/`assignment`) dan `is_active` — mendukung banyak homebase per user, satu yang aktif (dipakai sebagai prefix nomor transaksi).
- **Menu**: pohon menu sidebar hierarkis (parent→children, 1 level nesting) dengan `path` (frontend), `route_path` (path API backend, dipakai matching permission), `icon_name`, `order_index`.
- **RoleMenu**: relasi Role↔Menu dengan `permissions` (array string dalam JSON, custom GORM type `StringArray`) — inti dari middleware `RequirePermission`.

### 3.2 Approval Engine

- **ApprovalFlow**: unique key komposit `flow_code`+`branch_code` (mendukung flow spesifik per cabang + fallback `ALL`), `approval_way`(sequential/parallel/conditional), `assignment_type`(general/user_specific), field kustomisasi (`is_customizable`, `allowed_creator_roles`), field tracking custom flow (`is_custom`, `created_by`, `base_flow_id`, `custom_status`, field verifikasi). Relasi: banyak `ApprovalFlowStep`.
- **ApprovalFlowStep**: `step_order`, `step_name`, `step_role`(creator/reviewer/approver/receiver), opsional `role_id`/`branch_id`, `structure` (mis. `sender_manager`/`receiver_manager`), `is_required`, `can_skip`, `is_visible`, `type`(it/non-it/all), `category`(budget/non-budget/return/all), `approval_way`(web/upload), `auto_approve`, `timeout_hours`, `conditions`(JSON).
- **TransactionApproval**: satu baris per step per transaksi; `approver_user_id`/`approver_role_id`, `status`(pending/approved/rejected/skipped), `status_view`(visible/hidden), info approve/reject, `metadata`(JSON).
- **ApprovalSignature**: log audit tiap aksi sign/reject (`step_role`, `signature_path`, `signed_at`, `ip_address`, `user_agent`).

### 3.3 Master Data Aset

- **AssetCategory**: `category_code`(unik), `category_name`, `is_active`, soft delete. Relasi: banyak `Asset`.
- **Asset**: `asset_number`(unik, auto-generate format `{KODEKATEGORI}{ddmmyy}{seq4}`), `asset_name`, `brand`, `unit_of_measure`/`unit_quantity`, `location`, `grouping`, `category_id`, `branch_code`, `io_number`, `asset_status` (ACTIVE/INACTIVE/MAINTENANCE/RETIRED/DISPOSED/PENDING_RECEIPT/AVAILABLE/IN_DISPOSAL/IN_MUTATION), soft delete. Relasi: banyak `AssetValue`.
- **AssetValue**: time-series nilai/kondisi per aset — `effective_date`, `book_value`, `acquisition_value`, `accumulated_depreciation`, `condition`(GOOD/FAIR/POOR/BROKEN), `physical_status`(EXISTS/MISSING/DAMAGED/OBSOLETE), `asset_status`, `is_active` (hanya satu baris aktif per aset).
- **AssetHistory**: audit trail generik per aset — `transaction_type`, `transaction_id`, `document_number`, `before_data`/`after_data`(JSON), `changed_by`.
- **AssetAcquisition**: dibuat saat eksekusi aset procurement — menghubungkan Asset↔Transaction↔TransactionProcurement, `acquisition_value`, `status`.
- **AssetMutation** / **AssetDisposal**: tabel ledger ringkasan mutasi/disposal yang sudah selesai (tabel legacy, terpisah dari tabel flow baru `TransactionMutationAsset`/`TransactionDisposalAsset`).
- **AssetStockOpname**: baris item stock opname (snapshot fisik/kondisi/status/nilai saat opname), unik per (stock_opname_id, asset_id).
- **AssetGR** (Good Receipt): satu baris per aset saat diterima secara fisik oleh cabang tujuan; unik per aset.

### 3.4 Header Transaksi & Infrastruktur Flow Generik

- **Transaction**: tabel header universal untuk procurement/mutation/disposal/stock_opname — `transaction_number`(unik), `transaction_type`, `status`, `current_stage`, `io_number`, field mutasi (`mutation_category_id`, `mutation_to_branch_code`), field disposal (`disposal_type`, `sale_value`, `approval_request_number`, `approval_agreement_number`), `created_by`, `approved_by`/`approved_at`. Relasi: banyak tabel detail + `TransactionStage`.
- **TransactionStage**: log append-only setiap perpindahan tahap (`from_stage`→`to_stage`, `action`, `actor_id`, `notes`, `metadata`).
- **TransactionProcurement** / **TransactionProcurementDetail**: item baris procurement (item/kategori/qty/harga) dengan breakdown qty per cabang (untuk user HO yang mengajukan atas nama banyak cabang).
- **TransactionItemVerification**: menandai tiap item procurement sebagai ASSET atau NON_ASSET saat tahap verifikasi.
- **TransactionMutation** / **TransactionDisposal** / **TransactionStockOpname**: tabel detail sederhana legacy (dipakai route CRUD lama).
- **TransactionMutationAsset** / **TransactionMutationAttachment**: tracking mutasi per-aset (flow baru) + attachment per-aset.
- **TransactionDisposalAsset** / **TransactionDisposalAttachment**: tracking disposal per-aset (flow baru, dengan `sale_value`, `document_number`) + attachment per-aset per-tahap.
- **TransactionIONumber**: nomor IO per cabang per transaksi procurement (procurement multi-cabang bisa menghasilkan beberapa nomor IO).
- **DocumentNumberSequence**: counter atomik global (row-lock via `SELECT ... FOR UPDATE`) dengan key `(sequence_type, reference_code)` — dipakai untuk nomor IO (`SeqTypeIO`), nomor aset (`SeqTypeAsset`), dan nomor dokumen generik (prefix `DN`).
- **DocumentSequence**: tabel sequence prefix+tahun+bulan yang lebih sederhana (tampaknya sudah tergantikan sebagian besar oleh `DocumentNumberSequence`).
- **Reservoir**: reservasi nomor transaksi sebelum submit (`no_transaksi`, status delayed/used/expired) — mencegah tabrakan nomor; `GenerateTransactionNumber` langsung menulis ke sini.

### 3.5 Depresiasi

- **DepreciationSetting**: `setting_type`(CATEGORY/ASSET), `reference_id`/`reference_value`, `calculation_method`(STRAIGHT_LINE/DECLINING_BALANCE), `useful_life_months`, `depreciation_rate`, `start_date`/`end_date`, `is_active`.
- **MonthlyDepreciationCalculation**: snapshot per aset per periode (`YYYY-MM`) — nilai buku & akumulasi depresiasi awal/akhir, `is_locked` (mencegah kalkulasi ulang setelah dikunci).

### 3.6 Attachment

- **AttachmentConfig**: konfigurasi master dokumen wajib per `(transaction_type, stage, branch_code)` — mendukung wildcard `ALL` dengan resolusi berbasis spesifisitas.
- **TransactionAttachment**: file yang diunggah pada level transaksi generik (status PENDING/APPROVED/REJECTED, field reviewer).
- **TransactionMutationAttachment** / **TransactionDisposalAttachment**: varian per-aset (lihat di atas).

---

## 4. Fitur Bisnis per Modul

### 4.1 Auth / Users / RBAC
- Register (otomatis diberi role default `user`), Login (username atau email), JWT access+refresh token, refresh token rotation tersimpan di DB, logout multi-device / logout-all.
- CRUD user (khusus admin), penugasan role ke user (replace-all semantics).
- CRUD role, CRUD menu (tree 2 level), penugasan Role↔Menu beserta array **permission** per menu (JSON) — mekanisme otorisasi granular (`RequirePermission`).
- CRUD branch dengan kode cabang auto-generate berurutan; penugasan User↔Branch dengan berbagai tipe cabang (homebase/temporary/assignment) — homebase menentukan "kantor" user untuk penomoran transaksi dan kepemilikan aset.

### 4.2 Approval Engine
- Flow approval multi-step yang bisa dikonfigurasi (`ApprovalFlow`+`ApprovalFlowStep`), spesifik per cabang dengan resolusi fallback `ALL`.
- Engine generik `InitiateTransactionApproval`/`ApproveTransaction`/`RejectTransaction` yang bisa dipakai untuk tipe transaksi apapun; approver bisa ditugaskan berdasarkan user spesifik atau role.
- Validasi approver-cabang: approver harus berbagi cabang yang sama dengan pembuat transaksi.
- Signature/audit log digital (`ApprovalSignature`) tercatat setiap aksi approve/reject.
- Hook auto-complete: ketika semua step transaksi disetujui, otomatis memajukan procurement/mutation/disposal ke tahap berikutnya (`autoCompleteProcurementApproval`, `autoCompleteMutationApproval`, `autoCompleteDisposalApprovalRequest`/`Agreement`); auto-reject bila ada satu step yang ditolak.
- **Custom Approval Flow**: end user bisa mengajukan varian personalisasi dari flow dasar yang bisa dikustomisasi (tunduk pada `allowed_creator_roles`), lalu perlu diverifikasi oleh admin/`asset_team` (`pending_verification → approved/rejected`) sebelum aktif; hanya boleh satu custom flow per user per base flow.
- Prioritas resolusi flow approval efektif milik user: custom flow yang sudah disetujui > flow yang ditugaskan khusus untuk user > flow umum.

### 4.3 Manajemen Aset
- CRUD aset master (via API bersifat read-only — aset sebenarnya dibuat otomatis oleh tahap execute pada procurement, bukan lewat POST langsung), dengan filter kategori, cabang, status, pencarian nomor/nama, dan pagination.
- Time-series nilai aset (`AssetValue`) mencatat nilai buku & depresiasi seiring waktu; flag `is_active` menandai baris nilai yang sedang berlaku.
- Riwayat aset (audit log generik) per aset dan bisa dicari lintas semua aset (filter berdasarkan aset, tipe transaksi, rentang tanggal).
- Lifecycle status aset: `PENDING_RECEIPT → AVAILABLE → (IN_MUTATION/IN_DISPOSAL) → AVAILABLE/DISPOSED`, ditambah `INACTIVE/MAINTENANCE/RETIRED`.

### 4.4 Kategori Aset
- CRUD sederhana, `category_code` unik, mencegah penghapusan bila masih direferensikan oleh aset.

### 4.5 Procurement (dua implementasi berdampingan)
1. **Legacy CRUD** (`/transactions/procurement` route biasa) — create/list/update/delete procurement + item baris secara sederhana, dengan validasi cabang (user HO bisa set cabang bebas, non-HO dibatasi ke homebase sendiri).
2. **Procurement Flow (workflow lengkap)** — state machine multi-tahap:
   `DRAFT → ASSET_VERIFICATION → APPROVAL → PROCESS_BUDGET → EXECUTE_ASET → GR → FINISHED` (atau `→ REJECTED` hampir di setiap tahap).
   - **Submit**: pembuat submit draft (perlu attachment draft sudah diunggah).
   - **Verify**: PIC Asset menandai tiap item sebagai ASSET atau NON_ASSET; ditolak jika *semua* item non-asset.
   - **Approval**: otomatis mencari flow `PROCUREMENT_APPROVAL` (spesifik cabang → fallback `ALL`), didelegasikan ke approval engine generik; otomatis maju bila semua disetujui.
   - **Process Budget**: PIC Budget membuat satu **nomor IO** per cabang unik yang terlibat (format `{branch_code}IO{seq4}`), disimpan di `TransactionIONumber`.
   - **Execute Asset**: PIC Asset membuat record `Asset` + `AssetAcquisition` per unit qty per cabang (format nomor aset `{KODEKATEGORI}{ddmmyy}{seq4}`, status `PENDING_RECEIPT`), plus nomor dokumen `DN{seq8}`.
   - **GR (Good Receipt)**: user cabang tujuan mengonfirmasi penerimaan fisik per aset (dibatasi ke homebase sendiri); membuat `AssetValue` awal (nilai buku = nilai akuisisi); transaksi otomatis selesai ke `FINISHED` saat semua aset sudah diterima.
   - **Reject**/**Revise**: reject di tahap manapun yang belum final; revise membuat ulang item baris dan reset tahap (khusus untuk tahap APPROVAL).
   - Gating attachment diberlakukan di setiap transisi via `checkAttachmentCanProceed` (dokumen draft harus disetujui setelah lewat draft; dokumen tahap saat ini harus diunggah/disetujui sebelum lanjut).

### 4.6 Mutation (perpindahan aset antar cabang) — dua implementasi
1. **Legacy CRUD** (`/mutation`).
2. **Mutation Flow** — workflow draft/tambah-hapus aset/submit:
   `DRAFT → APPROVAL → MUTATION_RECEIVING → EXECUTE_MUTATION → FINISHED` (atau `→ REJECTED`).
   - Pembuatan draft memvalidasi cabang tujuan ≠ homebase user sendiri, dan konsistensi kategori aset.
   - Aset dikunci ke status `IN_MUTATION` selama berada dalam draft aktif; dicegah ditambahkan ke lebih dari satu mutasi berjalan sekaligus.
   - Approval melalui flow `MUTATION_APPROVAL` (pencarian sadar-cabang); otomatis maju ke `MUTATION_RECEIVING` saat semua disetujui.
   - User cabang tujuan mengonfirmasi penerimaan (unggah dokumen serah terima) → `EXECUTE_MUTATION`.
   - PIC Asset mengeksekusi: membuat nomor dokumen per aset, mengubah `Asset.branch_code` ke cabang tujuan, status kembali ke `AVAILABLE`.
   - Reject mengembalikan status aset; gating persetujuan attachment per tahap (saat draft: cukup diunggah; tahap selanjutnya: harus disetujui).

### 4.7 Disposal (write-off/penjualan aset) — modul paling kompleks, dua implementasi
1. **Legacy CRUD** (`/transactions/disposal/old`).
2. **Disposal Flow** — mendukung dua `disposal_type` dengan rantai tahap berbeda:
   - **DISPOSE**: `DRAFT → APPROVAL_REQUEST → APPROVAL_AGREEMENT → EXECUTE → ASSET_DELETION → FINISHED`
   - **SELL**: `DRAFT → PURCHASING → APPROVAL_REQUEST → APPROVAL_AGREEMENT → EXECUTE → FINANCE → TAX → ASSET_DELETION → FINISHED`
   - Draft: tambah/hapus aset (harus berstatus `AVAILABLE`, di cabang pembuat sendiri, belum terdaftar di disposal aktif lain); mengunci aset ke `IN_DISPOSAL`.
   - **Purchasing** (khusus SELL): menetapkan `sale_value` per aset.
   - **Dua sub-flow approval terpisah**: `DISPOSAL_APPROVAL_REQUEST` kemudian `DISPOSAL_APPROVAL_AGREEMENT` (masing-masing otomatis memajukan tahap saat semua disetujui; pencarian flow sadar-cabang dengan fallback `ALL`).
   - **Execute**: pembuat mengunggah dokumen hasil penghapusan/penjualan.
   - **Finance/Tax confirm** (khusus SELL): tahap berurutan dengan gating unggah dokumen.
   - **Asset Deletion**: membuat nomor dokumen per aset, mengubah status aset → `DISPOSED`, nilai dinolkan.
   - **Reject**: bisa terjadi di tahap manapun selain draft/final; mengembalikan status aset ke `AVAILABLE`, membatalkan record aset disposal, menandai nomor transaksi reservoir sebagai expired.
   - Tracking attachment per-aset per-tahap dengan logika gating yang sama seperti procurement/mutation ("draft harus disetujui, tahap saat ini harus diunggah").

### 4.8 Stock Opname (perhitungan fisik inventaris)
- Membuat transaksi stock opname dengan daftar item aset, masing-masing mencatat `physical_status`, `condition`, `asset_status` hasil observasi.
- List dengan filter (status, rentang tanggal) + pagination; update/delete dibatasi hanya untuk `DRAFT` milik sendiri.

### 4.9 Depresiasi
- Pengaturan yang bisa dikonfigurasi per kategori atau per aset spesifik (metode garis lurus/straight-line atau saldo menurun/declining-balance).
- `CalculateMonthlyDepreciation(period)`: mengiterasi semua aset `AVAILABLE`, resolusi pengaturan spesifik-aset dulu baru fallback ke pengaturan kategori, menghitung depresiasi, menulis baris `MonthlyDepreciationCalculation` dan snapshot `AssetValue` aktif baru (menonaktifkan yang lama). Idempotent per periode kecuali sudah dikunci.
- `LockMonthlyDepreciation(period)`: mengunci semua kalkulasi yang belum terkunci untuk suatu periode (mencegah kalkulasi ulang).
- **Job terjadwal**: cron `0 1 0 1 * *` (00:01 tanggal 1 tiap bulan) otomatis menjalankan depresiasi untuk bulan *sebelumnya* lalu otomatis mengunci (`scheduler/scheduler.go`).

### 4.10 Attachment (manajemen dokumen)
- Sistem dokumen wajib berbasis konfigurasi: baris `AttachmentConfig` mendefinisikan dokumen apa saja yang wajib per `(transaction_type, stage, branch_code)` dengan wildcard `ALL` dan resolusi berbasis spesifisitas (cabang+tahap spesifik > cabang spesifik+tahap ALL > cabang ALL+tahap spesifik > keduanya ALL).
- Attachment transaksi generik (`TransactionAttachment`) plus varian per-aset untuk flow mutasi dan disposal.
- Upload (multipart, disimpan ke disk lokal di `/app/documents/{type}/{txn}/{stage}/` atau subfolder per-aset), review (approve/reject dengan alasan wajib bila reject), ringkasan status (hitung required/approved/pending/rejected, flag `can_proceed` yang dipakai tiap fungsi transisi tahap), penyajian file dengan preview inline atau paksa unduh (`?download=true`).
- Tipe MIME dideteksi otomatis dari ekstensi (pdf/jpg/png/doc/docx/xls/xlsx, selain itu octet-stream).

### 4.11 Notifikasi
- Model registrasi token FCM (`FCMToken`) sudah ada, tapi **belum ditemukan controller, route, atau service** yang benar-benar mengirim push notification — infrastruktur sudah siap tapi belum dipakai/belum lengkap di snapshot codebase ini.

### 4.12 Reporting / Export
- Belum ditemukan fitur export Excel/PDF di manapun pada controller atau service (tidak ada library `excelize` atau PDF di `go.mod`). Reporting saat ini terbatas pada endpoint list JSON yang bisa difilter & dipaginasi (transaksi, aset, disposal, mutasi, riwayat aset, kalkulasi depresiasi).

### 4.13 Penomoran Transaksi
- `GenerateTransactionNumber`: format `{seq4}/{branch_code}/{branch_name}/{bulan_romawi}/{tahun}-{SUFFIX}` (contoh: `0001/C00001/HO Jakarta/I/2025-IO`), suffix per tipe (`IO`=procurement, `DPSL`=disposal, `MTI`=mutation, `OPNM`=stock opname). Langsung direservasi ke `Reservoir` dengan status `delayed`, ditandai `used` saat submit/inisiasi approval atau `expired` saat reject/cancel.
- Fungsi terpisah: `GenerateDocumentNumber` (`DN{seq8}`), `GenerateIONumber` (`{branch}IO{seq4}`), `GenerateAssetNumber` (`{KATEGORI}{ddmmyy}{seq4}`) — semuanya memakai counter `DocumentNumberSequence` dengan row-lock (`SELECT...FOR UPDATE`) untuk atomicity.

---

## 5. Middleware (`middleware/auth_middleware.go`)

- **`AuthMiddleware()`**: parsing header `Authorization: Bearer <token>`, validasi JWT via `utils.ValidateAccessToken`, menyuntikkan `user_id`, `username`, `email`, `roles` ke Gin context. Abort 401 bila header hilang/token invalid.
- **`RequireRole(...roles)`**: mengecek claim `roles` di JWT terhadap daftar role yang diizinkan (semantik OR). Abort 403 bila tidak ada yang cocok.
- **`RequirePermission(...permissions)`**: ACL granular berbasis database —
  1. Memuat `UserRole` milik user.
  2. Menormalisasi path request (membuang prefix `/api/v1`, membuang segmen numerik/UUID, dibatasi maksimal 3 segmen tersisa) untuk dicocokkan dengan `Menu.route_path`.
  3. Mencari `Menu` berdasarkan path yang sudah dinormalisasi — **bila tidak ada menu yang terdaftar untuk route tersebut, akses ditolak secara ketat** (desain fail-closed).
  4. Memuat baris `RoleMenu` untuk role-role user + menu tersebut, menggabungkan (union) array JSON `permissions`-nya.
  5. Mengizinkan akses bila salah satu permission yang dibutuhkan ada dalam gabungan tersebut.
- **`OptionalAuth()`**: sama seperti `AuthMiddleware` tapi tidak abort bila token tidak ada/invalid — request tetap lanjut tanpa menyuntikkan nilai context.
- **CORS**: dikonfigurasi langsung di `main.go` (bukan file middleware terpisah) — allow-all origin, credentials diizinkan.
- **Logging/Recovery**: middleware default Gin (`gin.Default()`), tidak ada logging terstruktur kustom.
- Belum ada middleware rate limiting di manapun dalam codebase.

---

## 6. Konfigurasi & Environment

Dari `.env.example`, `config/database.go`, dan `utils/jwt.go`:

| Variabel | Kegunaan |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | DSN koneksi MySQL |
| `PORT` | Port server HTTP (default `8080`) |
| `JWT_SECRET` | Secret HMAC untuk signing access & refresh token |
| `JWT_ACCESS_EXPIRY` | TTL access token (mis. `15m`/`1h`, default 15m bila tidak bisa di-parse) |
| `JWT_REFRESH_EXPIRY` | TTL refresh token (default `168h` / 7 hari) |

Dimuat via `godotenv.Load()` (dipanggil di `main.go` dan sekali lagi di `config.ConnectDatabase()`). Path penyimpanan file attachment di-hardcode sebagai konstanta (`/app/documents`, `AttachmentStoragePath` di `services/attachment_service.go` dan `disposal_flow_service.go`) — bukan dikonfigurasi via env — artinya container/host harus mount path ini (lihat `Dockerfile`/`docker-compose.yml`; juga ada folder `uploads/` lokal di root repo).

Tooling Docker/Ops: `Dockerfile`, `docker-compose.yml`, `Jenkinsfile` (CI/CD), `Makefile` (target build/run/migrate/docker), Goose CLI untuk migrasi (`make migrate-up/down/status/create`).

---

## 7. Integrasi Pihak Ketiga

- **Tidak ditemukan** integrasi SaaS eksternal (tidak ada email provider, SMS, payment gateway).
- Penyimpanan file **hanya di disk lokal** (tidak ada integrasi S3/GCS/Azure Blob meskipun ada fitur dokumen/attachment).
- Model penyimpanan token **FCM (Firebase Cloud Messaging)** ada, tapi belum ditemukan panggilan SDK FCM aktual — kemungkinan fitur yang direncanakan/belum selesai.
- Tidak ditemukan integrasi logging/monitoring/APM eksternal (mis. Sentry, Datadog).

---

## 8. Utilities / Helper

- **`utils/jwt.go`**: `GenerateAccessToken`, `GenerateRefreshToken`, `ValidateAccessToken`, `ValidateRefreshToken` — semuanya HMAC-SHA256 via `golang-jwt/jwt/v5`, claims berisi `user_id`, `username`, `email`, `roles[]`.
- **`utils/response.go`**: helper format JSON standar —
  - `SuccessResponse(c, status, message, data)` → `{"status":"success","message":...,"data":...}`
  - `ErrorResponse(c, status, message)` → `{"status":"error","message":...}`
  - `ValidationErrorResponse(c, err)` → selalu HTTP 400, `{"status":"error","message":"Validation failed","errors":...}`
  Semua controller memakai helper ini secara konsisten.
- **`services/mappers_service.go`** dan fungsi mapper per-domain (`mapXToResponse`): mengonversi model GORM → struct DTO response (disimpan di service layer, bukan controller).
- **`services/procurement_flow_helpers.go`**: helper state-machine yang dipakai bersama oleh procurement (dan secara konseptual dicerminkan oleh service mutation/disposal) — `recordStage`, `updateTransactionStage` (+ map `stageToStatus`), `validateStageTransition`, `checkAttachmentCanProceed`, dan tiga generator nomor dokumen yang dijelaskan di atas.
- **`services/transaction_number_service.go`**: reservasi/lifecycle nomor transaksi (`GenerateTransactionNumber`, `MarkTransactionAsUsed`, `MarkTransactionAsExpired`, `GetTransactionStatus`) plus pencarian branch homebase.
- **`services/homebase_service.go`**: `GetUserActiveHomebase`, `GetUserActiveBranchCode`, `GetFirstHomebaseBranchCode` — inti dari logika pembatasan cabang di hampir semua flow.
- Custom GORM scanner type `models.StringArray` (`role_menu.go`) untuk marshalling MySQL JSON↔`[]string` pada permissions.
- Tidak ada library validator khusus di luar `binding`/`go-playground/validator` bawaan Gin (dependency tidak langsung) via `ShouldBindJSON`.

---

## 9. Catatan Arsitektur yang Perlu Diperhatikan

- **Ada dua implementasi paralel** untuk Procurement, Mutation, dan Disposal: satu set CRUD legacy sederhana, satu set workflow multi-tahap penuh ("flow"). Route berbasis flow jelas merupakan fitur utama yang aktif dikembangkan (validasi jauh lebih lengkap, gating attachment, integrasi approval); route legacy tampaknya versi awal/lebih sederhana yang masih ter-mount (bahkan disposal legacy sudah eksplisit dipindah ke `/transactions/disposal/old`, menandakan sudah deprecated).
- Middleware `RequirePermission` bersifat fail-closed: **route API manapun yang tidak terdaftar di tabel `menus` tidak bisa diakses** sekalipun oleh user yang berwenang — record menu berfungsi ganda sebagai entri sidebar sekaligus tabel pencocokan permission.
- Pola state-machine yang sangat konsisten di procurement/mutation/disposal: draft → submit dengan gating attachment → approval engine → eksekusi → (opsional finance/tax) → finalisasi/penghapusan aset, masing-masing dengan audit trail `TransactionStage` sendiri dan semantik reject/revert yang mengembalikan aset ke status `AVAILABLE`.

---

> Status implementasi frontend (`vite_asset`) terhadap fitur-fitur backend di atas, beserta daftar PR/backlog yang perlu dilanjutkan, didokumentasikan terpisah di [FRONTEND_VITE_ASSET_DOCUMENTATION.md](FRONTEND_VITE_ASSET_DOCUMENTATION.md).
