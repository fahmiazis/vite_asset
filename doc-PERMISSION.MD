# Dokumentasi Permission / Role-based Access — Modul Procurement

Dokumen ini menjelaskan bagaimana sistem permission & role-based access sebenarnya bekerja di aplikasi ini, dipetakan dari kode nyata (backend `backend_aset_go` + frontend `vite_asset`), memakai **modul Procurement** sebagai studi kasus pertama. Modul lain (mutation, disposal, dst) akan menyusul di revisi berikutnya dengan pola yang sama.

> Catatan: dokumen ini murni dokumentasi, tidak ada perubahan kode yang dilakukan.

---

## 1. Model Permission Sistem Ini (Penting Dipahami Dulu)

Sistem ini **tidak** memakai role hardcode seperti `"spv"`, `"manager"`, `"finance"` di kode. Ada dua lapis mekanisme yang berbeda, dan keduanya dinamis (dikonfigurasi lewat data, bukan lewat kode):

### 1.1 Lapis 1 — RBAC berbasis Menu + Permission (untuk akses endpoint umum)
- Middleware backend `RequirePermission(...)` (`middleware/auth_middleware.go`) mengecek apakah user (lewat role yang dimilikinya) punya string permission tertentu (mis. `create_transaction`, `verify_asset`, `manage_approval`) pada **menu** yang cocok dengan path endpoint yang diakses.
- Permission per role **disimpan di database** (tabel `role_menus.permissions`, array JSON), diatur lewat halaman **Menu → Assign ke Role** di frontend (`POST /roles/:id/menus`). Jadi role apapun (admin, manager, atau role custom yang dibuat sendiri seperti "SPV", "PIC Asset", dst) bisa diberi permission apapun — tidak ada mapping tetap "role X = permission Y" di kode.
- Ada juga `RequireRole(...)` yang mengecek nama role secara literal, tapi ini **hanya dipakai untuk fitur administratif** (user, branch, role, menu, approval-flow config) — **bukan** untuk aksi-aksi transaksi procurement. Role literal yang benar-benar ada di kode: `admin`, `manager`, `asset_team` (untuk custom-approval verification). Role default yang di-seed di database: `admin`, `user`, `manager` (`migrations/20260201025321_create_roles_table.sql`).

### 1.2 Lapis 2 — Approval Step Role (khusus alur approval transaksi)
- Setiap `ApprovalFlowStep` (dikonfigurasi lewat `POST /approval-flows` + `POST /approval-flow-steps`) punya field `role_id` opsional — role siapa yang berhak approve di step tersebut. Ini **sepenuhnya dinamis**: admin yang membuat flow approval procurement (`PROCUREMENT_APPROVAL`) yang menentukan role apa untuk tiap step (bisa dinamai "Department Manager", "Finance Review", "SPV", dsb — bebas, tergantung role apa yang dibuat di tabel `roles` lalu dipasang ke step).
- Saat approval berjalan, backend menulis `approver_role_name`/`approver_role_id` ke response status approval (`GET /transactions/procurement/approval-status`). Frontend membaca nilai ini untuk tahu "role apa yang seharusnya approve step yang sedang pending" — **bukan** dari string hardcode.
- Seed data contoh (`seeder/approval_flow_seeder.sql`) memakai flow_code `PR_APPROVAL` dengan step `Department Manager`, `Finance Review`, `Director Approval` — **tapi ini flow_code demo, bukan flow_code yang benar-benar dipakai procurement.** Procurement service (`services/procurement_flow_helpers.go` dkk.) mencari flow dengan `flow_code = "PROCUREMENT_APPROVAL"`, yang harus dibuat terpisah lewat admin panel approval-flow — belum ada di seeder.

**Kesimpulan penting:** karena permission & role-approval keduanya data-driven, "role SPV approve procurement" itu **bukan aturan yang ditulis di kode**, melainkan hasil konfigurasi: (a) role "SPV" dibuat di `/roles`, (b) diberi permission `manage_approval`/`create_transaction`/dst lewat menu assignment, dan (c) dipasang sebagai `role_id` pada step approval procurement yang bersangkutan lewat `/approval-flow-steps`. Siapa saja bisa jadi approver procurement asalkan dikonfigurasi begitu.

---

## 2. Permission per Aksi — Modul Procurement (Backend, sumber kebenaran)

Ini permission string yang benar-benar dicek backend (`routes/procurement_flow_routes.go`) untuk tiap aksi procurement. Role mana yang punya permission ini **tergantung konfigurasi `role_menus` di database**, bukan hardcode.

| Aksi | Endpoint | Permission dicek backend | Transisi status |
|---|---|---|---|
| Submit draft | `POST /transactions/procurement/submit` | `create_transaction` | DRAFT → ASSET_VERIFICATION |
| Verify item | `POST /transactions/procurement/verify` | `verify_asset` | ASSET_VERIFICATION → APPROVAL |
| Initiate approval | `POST /transactions/procurement/approval/initiate` | `manage_approval` | trigger flow `PROCUREMENT_APPROVAL` |
| Approve step | `POST /transaction-approvals/approve` (dipanggil ulang lintas modul) | 🔑 login saja + validasi `approver_user_id`/`approver_role_id` sesuai step | — |
| Complete approval | `POST /transactions/procurement/approval/complete` | `manage_approval` | APPROVAL → PROCESS_BUDGET |
| Process budget | `POST /transactions/procurement/process-budget` | `process_budget` | PROCESS_BUDGET → EXECUTE_ASET |
| Execute asset | `POST /transactions/procurement/execute` | `execute_asset` | EXECUTE_ASET → GR |
| Good Receipt | `POST /transactions/procurement/gr` | `create_transaction`, `gr` | GR → FINISHED (bila semua item sudah di-GR) |
| Reject | `POST /transactions/procurement/reject` | `reject_transaction` | tahap manapun → REJECTED |
| Revise | `PUT /transactions/procurement/revise` | `update_transaction` | reset ke tahap sesuai |
| Upload attachment | `POST /attachments/upload` | `upload_attachment`, `create_transaction` | — |
| Review attachment | `PUT /attachments/:id/review` | `review_attachment` | — |

Catatan: `approve` transaksi (`POST /transaction-approvals/approve`) tidak dicek pakai permission string — validasinya lebih spesifik: user yang approve harus **cocok** dengan `approver_user_id` (bila assignment tipe user-spesifik) **atau** punya `approver_role_id` (bila assignment tipe role umum) yang tercatat di baris `TransactionApproval` untuk step tsb, dan harus berbagi cabang dengan pembuat transaksi.

---

## 3. Kondisi Button di Frontend (Procurement Detail Page)

File: `vite_asset/src/components/organisms/transaction/detail/index.tsx`

**Temuan penting: hampir semua tombol aksi di frontend HANYA dikondisikan oleh status/tahap transaksi, BUKAN oleh role user.** Backend tetap menegakkan permission saat request masuk (lihat tabel di atas), tapi di sisi UI, tombolnya tetap muncul untuk siapapun yang bisa membuka halaman detail transaksi — kalaupun user itu sebenarnya tidak punya permission, dia baru akan dapat error setelah klik (request ke backend ditolak), bukan tombolnya disembunyikan dari awal.

| Tombol | Kondisi tampil di kode | Role/permission dicek di frontend? | Lokasi |
|---|---|---|---|
| **Submit for Verification** | `transaction.status.toLowerCase() === "draft"` | ❌ Tidak ada | `detail/index.tsx:319` |
| **Verify Asset** | `isVerif = lastStage === "ASSET_VERIFICATION" && status === "PENDING"` | ❌ Tidak ada | kondisi:253, tombol:582 |
| **Approve** | `isApprove = lastStage === "APPROVAL" && status === "PENDING"` | ⚠️ Dihitung tapi **tidak dipakai** (lihat §3.1) | kondisi:254, tombol:583 |
| **Process Budget** | `isBudget = current_stage === "PROCESS_BUDGET"` | ❌ Tidak ada | kondisi:255, tombol:584 |
| **Execute Asset** | `isExecute = current_stage === "EXECUTE_ASET"` | ❌ Tidak ada | kondisi:256, tombol:585 |
| **Good Receipt (GR)** | `isGR = current_stage === "GR"` | ❌ Tidak ada | kondisi:257, tombol:586 |
| **Review Attachment** | `status.toLowerCase() !== "draft"` | ❌ Tidak ada | `detail/index.tsx:354` |
| Detail/Edit/Delete (list page) | selalu tampil | ❌ Tidak ada | `transaction/column.tsx:100-119` |

### 3.1 Bug/gap: `canApprove` dihitung tapi tidak dipakai

Kode di `detail/index.tsx:264-269` sebenarnya **sudah** menghitung apakah user yang sedang login berhak approve step yang sedang pending:

```ts
const userRoles = getRolesFromToken()                       // roles dari JWT (utils/auth/index.ts)
const pendingApproval = approvals.find(a => a.status?.toLowerCase() === "pending")
const canApprove = isApprove && !!pendingApproval && (
  userRoles.includes(pendingApproval.approver_role_name) ||   // role name dari API approval-status
  userRoles.includes(pendingApproval.approver_role_id)        // atau role id dari API approval-status
)
```

Tapi tombol Approve di baris 583 hanya memakai `isApprove`, **`canApprove` tidak pernah dipakai** (dead code — confirmed via grep, tidak ada referensi lain ke `canApprove` di file ini maupun file lain). Efeknya: **siapapun** yang bisa membuka halaman detail transaksi yang sedang di tahap APPROVAL akan melihat tombol Approve, walaupun dia bukan approver yang seharusnya untuk step tsb. Request-nya baru akan ditolak backend saat submit (karena backend tetap validasi `approver_user_id`/`approver_role_id`), tapi dari sisi UX ini membingungkan (tombol muncul tapi gagal saat diklik).

### 3.2 Guard route level juga nonaktif

`src/components/organisms/guard/protectedRoute.tsx:18-20` — redirect ke halaman forbidden untuk route yang tidak diizinkan menu-nya **di-comment**, jadi proteksi RBAC berbasis menu di level route pun sedang tidak aktif untuk seluruh aplikasi, termasuk halaman transaksi procurement.

---

## 4. Ringkasan Gap & Rekomendasi

1. **`canApprove` dead code** — tinggal ganti kondisi tombol Approve dari `isApprove` menjadi `isApprove && canApprove`, plus tampilkan pesan/disable state yang jelas untuk user yang bukan approver step tsb (bukan cuma sembunyikan tombolnya, karena mereka tetap perlu tahu approval sedang menunggu siapa).
2. **Tidak ada gating role/permission di tombol lain** (Verify, Process Budget, Execute, GR, Submit, Reject, Revise) — saat ini semuanya murni status-based. Idealnya, halaman detail transaksi juga mengecek permission user (mis. dari `GET /auth/me` atau menu permission yang sudah dimuat saat login) sebelum menampilkan tombol yang backend-nya butuh permission spesifik (`verify_asset`, `process_budget`, `execute_asset`, `gr`, dst) — supaya user tanpa hak akses tidak melihat tombol yang pasti gagal.
3. **`protectedRoute.tsx` RBAC redirect di-comment** — perlu diputuskan apakah ini sengaja dinonaktifkan sementara (mis. masih development) atau perlu diaktifkan kembali sebelum production.
4. **Flow approval procurement (`PROCUREMENT_APPROVAL`) belum ada di seeder** — hanya ada di kode sebagai flow_code yang dicari. Perlu dipastikan data ini dibuat manual lewat admin panel di tiap environment (dev/staging/prod), atau ditambahkan ke seeder resmi supaya tidak hilang saat setup environment baru.
5. **Role approval procurement sepenuhnya tergantung konfigurasi admin** — tidak ada dokumentasi role apa yang "seharusnya" dipasang di tiap step approval procurement (Department Manager? Finance? SPV?). Sebaiknya didokumentasikan terpisah begitu flow approval procurement produksi sudah difinalisasi oleh tim bisnis, supaya jelas role mana yang berwenang approve step ke berapa.

---

## 5. Rencana Lanjutan

Dokumen ini baru mencakup **Procurement**. Modul berikutnya yang perlu dicek dengan pola yang sama (permission backend vs. gating role di frontend): **Mutation** dan **Disposal**, karena keduanya juga punya approval step & aksi bertahap serupa (lihat [FRONTEND_VITE_ASSET_DOCUMENTATION.md](FRONTEND_VITE_ASSET_DOCUMENTATION.md) untuk status implementasi masing-masing modul).
