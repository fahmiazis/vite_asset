# Dokumentasi Frontend — `vite_asset`

Dokumen ini merangkum status implementasi frontend (React/Vite) terhadap seluruh fitur backend yang didokumentasikan di [BACKEND_ASET_GO_DOCUMENTATION.md](BACKEND_ASET_GO_DOCUMENTATION.md). Verifikasi dilakukan dengan menelusuri seluruh pemanggilan API (`axiosPrivate`/`axiosPublic`) di `src/services`, `src/hooks`, `src/routers`, dan `src/components/pages`, lalu mencocokkannya dengan halaman/route yang benar-benar menggunakannya — bukan sekadar menebak dari nama folder.

> Catatan: dokumen ini murni dokumentasi, tidak ada perubahan kode yang dilakukan.

Legenda status: ✅ Full — ⚠️ Partial — ❌ Belum ada sama sekali.

---

## 1. Status Implementasi per Modul

### 1.1 Auth — ⚠️ Partial
- ✅ `POST /auth/login`, `GET /auth/me` — halaman login + bootstrap profil/session.
- ⚠️ `POST /auth/refresh` — jalan otomatis lewat axios interceptor saat 401, bukan fitur yang terlihat user.
- ❌ `POST /auth/register` — tidak ada halaman register (pembuatan user dilakukan admin lewat `POST / users`). ==> NOPE
- ❌ `POST /auth/logout`, `/auth/logout-all` — logout saat ini hanya menghapus cookie di client, tidak memanggil endpoint backend.

### 1.2 Users — ⚠️ Partial
- ✅ CRUD inti user (list/create/update/delete/detail).
- ❌ `POST /users/:id/roles` — role hanya ditampilkan read-only di halaman detail, tidak ada UI assign/remove role.
- ❌ `GET/POST/DELETE /users/:id/branchs` — belum ada UI penugasan cabang ke user.

### 1.3 Branches — ⚠️ Partial
- ✅ `GET/POST /branchs`, `GET /branchs/:id` — list, create, detail.
- ❌ `PUT/DELETE /branchs/:id` — tidak ada update/delete.
- ❌ `GET /branchs/:id/users` — halaman detail cabang belum menampilkan daftar user di cabang tsb.

### 1.4 Homebase & Nomor Transaksi
- ✅ `GET /user/homebases`, `POST /user/homebase/set-active` — full.
- ❌ `/transaction-number/*` (generate, mark-used, mark-expired, status) — tidak ada implementasi sama sekali. ==>ON  CHECK BE

### 1.5 Menus — mostly full
- ✅ CRUD menu + `GET /menus/sidebar` + `POST /roles/:id/menus` (assign menu ke role).
- ❌ `GET /roles/:id/menus` — halaman assign menu tidak memuat assignment yang sudah ada (write-only, bukan read-modify).

### 1.6 Roles — ❌ Stub
- ✅ `GET /roles` — list (juga dipakai sebagai dropdown di halaman lain).
- ❌ Create/Update/Delete role — route ada tapi komponennya literal placeholder (`<div>u can create role here</div>`), tidak ada service/hook/form sama sekali.

### 1.7 Approval Flow — ⚠️ Partial
- ✅ Create/list/detail flow, create step, reorder step, `approve` (dipakai bersama di procurement & mutation).
- ❌ Update/delete flow, delete step.
- ❌ Endpoint generik `transaction-approvals` (`initiate`, `reject`, `status`, `pending`) — hanya endpoint initiate spesifik per modul (procurement/mutation) yang dipakai; tidak ada generic reject call maupun halaman "pending approvals" queue.
- ❌ **Custom Approval Flow** (`/custom-approvals/*`, `/approval-flows/:id/can-customize`) — nol referensi di seluruh source frontend. ==> HOLD

### 1.8 Asset Categories — ⚠️ Partial
- ✅ List + create.
- ❌ Update/delete.

### 1.9 Asset Master — ⚠️ Partial
- ✅ List + detail.
- ❌ `value-history`, `history` per aset, dan `asset-histories` (riwayat gabungan) — tidak ada implementasi.

### 1.10 Depreciation — ⚠️ Partial
- ✅ CRUD penuh untuk `depreciation-settings` (nama komponen listnya menyesatkan — bernama "monthly/table.tsx" tapi sebenarnya me-render data `depreciation-settings`, bukan endpoint `/depreciation/monthly`).
- ❌ `GET /depreciation/monthly`, `POST /depreciation/calculate`, `POST /depreciation/calculations/lock` — mesin kalkulasi depresiasi sama sekali belum di-wire ke UI.

### 1.11 Attachments — ⚠️ Partial ==>HOLD
- ✅ `attachment-configs` CRUD penuh, upload, review (ada versi generik & versi khusus disposal).
- ⚠️ `GET /attachments` hanya di-hardcode untuk `transaction_type=procurement`; `GET /attachments/status` hanya diimplementasikan untuk disposal — tidak ada versi generik/mutation yang dipakai ulang.
- ❌ `GET /attachments/:id/file` sebagai call terpisah — tidak ditemukan (kemungkinan URL file sudah ikut di response list).
- ❌ Attachment khusus mutation (upload/review/status) — UI mutation sama sekali tidak punya modal/service attachment.

### 1.12 Transaksi generik lintas modul — ❌ Belum ada ==>HOLD
`GET /transactions`, `/transactions/my`, `/transactions/detail` tidak dipakai; frontend hanya memanggil endpoint list per-modul (procurement/mutation/disposal masing-masing).

### 1.13 Procurement (legacy CRUD) — mostly implemented
- ✅ List, create, delete.
- ⚠️ Update — service update (`transaction/update.ts`) memanggil `PUT /transactions/procurement/detail-stage?transaction_number${...}` — **kemungkinan bug** (hilang tanda `=` setelah `transaction_number`), dan memakai endpoint `detail-stage`, bukan endpoint update khusus.

### 1.14 Procurement Flow — mostly full
- ✅ `submit`, `verify`, `approval/initiate`, `process-budget`, `execute`, `gr` (get & post) — semua ter-wire ke UI detail transaksi lengkap dengan modal/aksinya.
- ❌ `approval/complete`, `reject`, `revise` — tidak ada service/hook/UI untuk tiga transisi ini.

### 1.15 Mutation (legacy CRUD) — ⚠️ Partial
- ✅ List saja (`GET /mutation`).
- ❌ Create/update/delete legacy — halaman "create" mutation sebenarnya memanggil endpoint draft-create dari flow baru (`POST /transactions/mutation`), bukan endpoint CRUD legacy.

### 1.16 Mutation Flow — mostly full
- ✅ Draft create, add-asset, submit draft, approval/initiate, approval/status, confirm-receiving, execute, approve (generik) — lengkap dengan modal masing-masing.
- ❌ **remove-asset** (tidak ada, padahal ada di disposal), **reject**, dan attachment khusus mutation (upload/review/status).

### 1.17 Disposal (legacy CRUD `/transactions/disposal/old`) — ❌ Belum ada ==> HOLD
Tidak ada satupun referensi ke path `/old` di frontend.

### 1.18 Disposal Flow — ❌ hanya tahap awal (draft + attachment)
- ✅ `create`, `list`, `detail`, draft `add-asset`/`remove-asset`, `draft/submit`, attachments `upload`/`review`/`status` — lengkap dengan modal-modalnya.
- ❌ **Semua tahap setelah draft**: `purchasing/set-sale-values`, `approval-request/initiate+status`, `approval-agreement/initiate+status`, `execute`, `finance/confirm`, `tax/confirm`, `asset-deletion/confirm`, `reject` — tidak ada service, modal, maupun tombol sama sekali. UI disposal berhenti di tahap draft/attachment; seluruh pipeline approval → sale-value → eksekusi → finance/tax/asset-deletion belum punya frontend.

### 1.19 Stock Opname — ❌ Belum ada sama sekali
Tidak ada halaman, route, service, hook, atau referensi string (`stock-opname`, `stock_opname`, `StockOpname`) di manapun pada source frontend.

---

## 2. Ringkasan per Modul

| Modul | Status FE | Catatan |
|---|---|---|
| Auth | ⚠️ Partial | login/me/refresh(silent) saja; tidak ada register, logout/logout-all belum memanggil API |
| Users | ⚠️ Partial | CRUD inti saja; belum ada assign role/branch |
| Branches | ⚠️ Partial | list/create/detail saja; belum ada update/delete/daftar user per cabang |
| Homebase | ✅ Full | homebases + set-active |
| Nomor Transaksi | ❌ None | belum ada implementasi |
| Menus | ✅ Mostly full | CRUD + sidebar + assign-to-role; belum ada GET role menus |
| Roles | ❌ Stub | list saja; create/update/delete masih placeholder |
| Approval Flow | ⚠️ Partial | create/list/detail/step-create/reorder saja; belum ada update/delete flow, generic initiate/reject/status/pending |
| Custom Approval Flow | ❌ None | belum ada implementasi |
| Asset Categories | ⚠️ Partial | list/create saja; belum ada update/delete |
| Asset Master | ⚠️ Partial | list/detail saja; belum ada value-history/history/asset-histories |
| Depreciation | ⚠️ Partial | settings CRUD saja; belum ada monthly/calculate/lock |
| Attachments | ⚠️ Partial | configs CRUD + upload/review lengkap; status/list masih hardcode ke procurement; belum ada endpoint file; belum ada attachment mutation |
| Transaksi generik | ❌ None | belum ada /transactions, /transactions/my |
| Procurement CRUD | ✅ Mostly full | list/create/delete; call update tampak buggy |
| Procurement Flow | ✅ Mostly full | submit/verify/initiate/process-budget/execute/gr selesai; belum ada approval/complete, reject, revise |
| Mutation CRUD (legacy) | ⚠️ Partial | list saja |
| Mutation Flow | ✅ Mostly full | draft/add-asset/submit/approval-initiate/status/confirm-receiving/execute/approve selesai; belum ada remove-asset, reject, attachments |
| Disposal CRUD (legacy /old) | ❌ None | belum ada implementasi |
| Disposal Flow | ❌ Hanya tahap awal | create/list/detail/draft add-remove-asset/submit/attachments saja; belum ada approval-request, approval-agreement, sale-values, execute, finance/tax/asset-deletion confirm, reject |
| Stock Opname | ❌ None | tidak ada sama sekali |

## 3. Gambaran Umum

Frontend sudah cukup solid untuk alur transaksi **procurement** dan **mutation** (draft → approval → eksekusi), master data inti (users, branches, menus, asset categories/master, depreciation settings, attachment configs), serta scaffolding menu/RBAC. Yang paling lemah/belum ada: **bagian belakang disposal** (semua setelah draft submit), **stock opname** (sama sekali belum ada), **custom approval flow**, **transaction numbering**, **generic cross-module transaction view**, **manajemen role** (masih stub), dan beberapa **fitur assignment sub-resource** (role/branch untuk user, GET role→menus, riwayat nilai/perubahan aset, mesin kalkulasi depresiasi).

---

## 4. Daftar PR / Fitur & Endpoint yang Belum Diimplementasikan (To-Do Lanjutan)

Daftar ini adalah backlog fitur frontend yang perlu dikerjakan agar seluruh kapabilitas backend termanfaatkan. Diurutkan kira-kira dari yang paling berdampak/kritikal ke yang lebih kecil.

### Prioritas tinggi (fitur inti bisnis yang bolong)

1. **PR: Disposal Flow — lanjutan setelah draft** (`transactions/disposal/*`)
   Bangun UI untuk seluruh sisa pipeline: set sale value (khusus SELL), initiate + status approval-request, initiate + status approval-agreement, execute, finance confirm (SELL), tax confirm (SELL), asset-deletion confirm, dan reject. Tanpa ini modul disposal tidak bisa dipakai sampai selesai (hanya bisa bikin draft).
2. **PR: Stock Opname (modul baru dari nol)**
   Buat halaman list, create (dengan item aset + kondisi/status fisik), detail, update/delete untuk transaksi `DRAFT` milik sendiri (`/transactions/stock-opname/*`).
3. **PR: Procurement Flow — lengkapi transisi yang hilang**
   Tambahkan aksi `approval/complete`, `reject`, dan `revise` pada halaman detail transaksi procurement.
4. **PR: Mutation Flow — lengkapi transisi & attachment yang hilang**
   Tambahkan `remove-asset` pada draft, aksi `reject`, dan modul attachment (upload/review/status) khusus mutation — saat ini mutation tidak punya UI attachment sama sekali.
5. **PR: Perbaiki bug endpoint update procurement**
   `transaction/update.ts` memanggil query string yang salah (`?transaction_number${id}` tanpa `=`) dan memakai endpoint `detail-stage`, bukan endpoint update yang seharusnya — perlu diverifikasi ulang ke backend endpoint mana yang benar dan diperbaiki.

### Prioritas menengah (manajemen & administrasi)

6. **PR: Role management penuh**
   Ganti halaman placeholder create-role dengan form asli + implementasikan update dan delete role.
7. **PR: User — assignment role & branch**
   Tambahkan UI untuk `POST /users/:id/roles` (assign/replace role) dan `GET/POST/DELETE /users/:id/branchs` (kelola homebase/cabang tambahan user) di halaman detail/update user.
8. **PR: Branch — lengkapi CRUD & daftar user**
   Tambahkan update, delete, dan tampilkan daftar user per cabang (`GET /branchs/:id/users`) di halaman detail branch.
9. **PR: Asset Categories — lengkapi CRUD**
   Tambahkan update dan delete kategori aset.
10. **PR: Approval Flow — update/delete flow & step**
    Tambahkan aksi update/delete pada flow dan delete pada step (saat ini hanya create + reorder).
11. **PR: Role → Menu read-back**
    Saat membuka halaman assign menu ke role, load dulu assignment yang sudah ada via `GET /roles/:id/menus` supaya form tidak "write-only".

### Prioritas menengah-rendah (fitur pendukung/reporting)

12. **PR: Custom Approval Flow (modul baru)**
    Implementasikan UI end-user untuk mengajukan custom approval flow (`POST/PUT/DELETE /custom-approvals`, `GET /custom-approvals/me`) dan UI admin/asset_team untuk verifikasi (`GET pending-verifications`, `POST :id/verify`), plus indikator `can-customize` di halaman approval flow.
13. **PR: Depreciation — mesin kalkulasi**
    Tambahkan halaman untuk melihat kalkulasi bulanan (`GET /depreciation/monthly`), menjalankan kalkulasi (`POST /depreciation/calculate`), dan mengunci periode (`POST /depreciation/calculations/lock`) — saat ini hanya pengaturan (settings) yang bisa dikelola, mesin kalkulasinya belum ada UI sama sekali.
14. **PR: Asset — riwayat nilai & histori**
    Tambahkan tab/section di halaman detail aset untuk `value-history` dan `history`, serta halaman gabungan `asset-histories` untuk audit lintas aset.
15. **PR: Transaction Numbering — visibility/tooling**
    Bila diperlukan untuk debugging/admin, tambahkan halaman untuk melihat status nomor transaksi (`GET /transaction-number/status/:number`) dan endpoint mark-used/mark-expired (mungkin ini murni internal backend dan tidak perlu UI — perlu konfirmasi ke tim BE apakah ini memang harus ada UI-nya).
16. **PR: Generic Transactions View**
    Pertimbangkan halaman dashboard/laporan lintas modul memakai `GET /transactions`, `/transactions/my`, `/transactions/detail` — berguna untuk "my pending tasks" atau laporan gabungan, dibanding harus buka satu-satu per modul.
17. **PR: Approval — generic pending queue**
    Tambahkan halaman "approval saya yang pending" memakai `GET /transaction-approvals/pending`, dan pastikan reject transaksi (procurement/mutation/disposal) benar-benar memanggil endpoint reject terkait (saat ini reject belum diimplementasikan di modul manapun kecuali reject pada review attachment).

### Prioritas rendah (kelengkapan/kerapian)

18. **PR: Auth — register & logout yang benar**
    Tambahkan halaman register bila memang dibutuhkan (atau confirm bila memang sengaja admin-only), dan ganti logout client-only agar benar-benar memanggil `POST /auth/logout` / `/auth/logout-all` supaya refresh token di-revoke di backend (saat ini token lama masih valid di DB walau user sudah "logout" di UI).
19. **PR: Attachment — generalisasi**
    Refactor `GET /attachments` dan `GET /attachments/status` agar generik (tidak hardcode `transaction_type=procurement`), dipakai ulang oleh disposal & mutation, dan tambahkan pemanggilan `GET /attachments/:id/file` yang eksplisit bila file URL dari list response tidak selalu bisa diandalkan.
20. **PR: Mutation legacy CRUD**
    Evaluasi apakah legacy CRUD (`/mutation` POST/PUT/DELETE) dan legacy disposal (`/transactions/disposal/old`) masih perlu di-support di UI, atau cukup dihapus/diabaikan karena sudah digantikan flow baru — kalau memang deprecated, sebaiknya didiskusikan dengan BE untuk dihapus juga dari backend agar tidak jadi dead code di kedua sisi.
