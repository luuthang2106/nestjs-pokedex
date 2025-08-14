## ✅ Tính năng đã làm

- [x] **Auth**: Login / Signup với **JWT** (lưu cookie `httpOnly`)
- [x] **Import CSV**: thêm/cập nhật Pokémon
- [x] **Bảng Pokémon**: **server-side pagination** (`offset`, `limit`)

---

## 🧩 Assumptions / Design Decisions

- **Tách 2 repo**:
  - **NestJS**: API backend
  - **Angular**: Frontend UI
- **Quy trình build**: build Angular → **copy thư mục build** (dist) vào NestJS để serve SPA.
- **CSV**: dùng dấu phẩy `,`, **không có dấu ngoặc kép**. Mỗi dòng là 1 Pokémon.

---

## 🔗 API chính

| Method | Path                              | Mô tả                                        |
|------:|------------------------------------|----------------------------------------------|
|  POST | `/api/auth/login`                  | Đăng nhập (set cookie `token`)               |
|  POST | `/api/auth/register`               | Đăng ký (set cookie `token`)                 |
|   GET | `/api/auth/verify`                 | Kiểm tra đăng nhập → `{ "message": "ok" }`   |
|   GET | `/api/pokemons?offset=0&limit=10`  | Lấy danh sách Pokémon (phân trang)           |
|  POST | `/api/pokemons/import`             | Import CSV (field `file`)                    |

---
## 🚀 Chạy nhanh

- Vào `app.module.ts` chỉnh sửa **username/password** và **database PostgreSQL**
- Chạy `npm install`
- Chạy `npm run start:dev`
