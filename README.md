# an-hotel-residence

Bản thiết kế lại website **AN Hotel & Residence West Lake** (khách sạn boutique bên Hồ Tây, Hà Nội), dựng bằng React + Vite + Tailwind CSS.

## Chạy thử

```bash
npm install
npm run dev
```

Lệnh khác: `npm run build` (đóng gói), `npm run lint` (kiểm tra mã).

## Các trang

- `/` — Trang chủ
- `/rooms`, `/rooms/:id` — Phòng & bảng giá, chi tiết phòng
- `/services` — Dịch vụ trang trí phòng
- `/gallery` — Thư viện ảnh
- `/reviews` — Đánh giá
- `/attractions` — Khám phá quanh Hồ Tây
- `/contact` — Liên hệ
- `/booking` — Đặt phòng (chọn phòng, ngày, xem tạm tính)

## Ghi chú

- Nội dung, bảng giá và hình ảnh lấy từ website gốc <https://www.anhotelresidence.com/>.
- Form đặt phòng không gửi dữ liệu đi đâu: nó soạn sẵn tin nhắn để khách gửi qua Zalo hoặc Messenger.
- Trợ lý chat trả lời theo kịch bản từ dữ liệu phòng và giá có sẵn (`src/lib/chatBrain.js`), chưa kết nối mô hình AI.
- Giao diện hiện chỉ có tiếng Việt.
- `screenshots-original/` là ảnh chụp website gốc, `screenshots-redesign/` là ảnh chụp trong quá trình thiết kế lại.
