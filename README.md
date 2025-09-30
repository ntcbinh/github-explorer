# GitHub Explorer

Một công cụ phân tích hồ sơ GitHub nâng cao, xây dựng bằng React + TypeScript + Tailwind CSS, tích hợp Google Gemini để tạo "Chân dung Lập trình viên" dựa trên dữ liệu công khai.

➡️ Demo Live: [Mở liên kết](https://example.com)

### Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Kiến trúc & Thiết kế](#kiến-trúc--thiết-kế)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt & Chạy Local](#cài-đặt--chạy-local)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Sử dụng](#sử-dụng)
- [Hiệu năng](#hiệu-năng)
- [Phân tích bằng AI](#phân-tích-bằng-ai)
- [Khắc phục sự cố](#khắc-phục-sự-cố)
- [Lộ trình](#lộ-trình)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

### Giới thiệu

Trong bối cảnh tuyển dụng và đánh giá năng lực, việc chỉ xem hồ sơ GitHub là chưa đủ. Ứng dụng này không chỉ tổng hợp thông tin công khai mà còn tận dụng LLM (Google Gemini) để tạo bản phân tích chuyên sâu về chuyên môn, công nghệ chủ lực và thế mạnh tiềm năng của lập trình viên.

### Tính năng

- Tìm kiếm người dùng GitHub và xem tổng quan hồ sơ
- Hiển thị thông tin chi tiết: bio, followers, repos, ngôn ngữ nổi bật
- Lọc và sắp xếp repositories theo tên, sao, fork, ngày cập nhật
- Phân trang mượt mà khi duyệt danh sách repositories
- Phân tích AI: tổng hợp dữ liệu và tạo "Chân dung Lập trình viên"

### Kiến trúc & Thiết kế

- Custom Hook `useGitHubUser`: đóng gói gọi API, trạng thái, caching
- Quản lý trạng thái với `useReducer`: rõ ràng giữa idle/loading/success/error
- Debounce cho ô tìm kiếm và lọc repos để giảm tính toán không cần thiết
- Client-side caching bằng `Map` giúp phản hồi nhanh khi tra cứu lại
- Prompt engineering: cấu trúc systemPrompt + userQuery tối ưu cho Gemini

### Công nghệ sử dụng

- React (Vite)
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Google Gemini API (AI)
- Vercel (triển khai)

### Cài đặt & Chạy Local

Clone repository:

```bash
git clone https://github.com/ntcbinh/github-explorer.git
cd github-explorer
```

Cài đặt dependencies:

```bash
npm install
```

Tạo file môi trường:

```bash
cp .env.example .env.local # nếu có sẵn; nếu không hãy tạo mới
```

Thêm API key vào `.env.local`:

```env
VITE_GEMINI_API_KEY=your_google_ai_api_key_here
```

Chạy ứng dụng:

```bash
npm run dev
```

Ứng dụng mặc định chạy tại `http://localhost:5173`.

### Cấu hình môi trường

- `VITE_GEMINI_API_KEY`: API key Google AI Studio/Gemini để gọi phân tích AI

### Sử dụng

1. Nhập username GitHub để tìm kiếm
2. Xem thông tin tóm tắt và danh sách repositories
3. Lọc/sắp xếp repositories theo yêu cầu
4. Nhấn "Phân tích bằng AI" để tạo chân dung kỹ thuật

Lưu ý hạn mức: GitHub API và Gemini API đều có rate limit. Caching client giúp giảm gọi lặp lại nhưng không loại bỏ hoàn toàn hạn chế.

### Hiệu năng

- Debounce input để hạn chế gọi API dồn dập
- Caching in-memory cho kết quả người dùng đã xem
- Phân trang dữ liệu để tránh tải khối lượng lớn trong một lần

### Phân tích bằng AI

- Gom dữ liệu ngôn ngữ, repos nổi bật, mô tả dự án
- Gửi prompt đã chuẩn hóa tới Gemini để tạo bản phân tích cấu trúc
- Hiển thị kết quả dạng "Chân dung Lập trình viên" dễ đọc và chia mục

### Khắc phục sự cố

- Không hiện dữ liệu: kiểm tra username hợp lệ và rate limit GitHub
- Lỗi AI: xác minh `VITE_GEMINI_API_KEY` còn hiệu lực, quota đủ dùng
- Lỗi CORS/Network: thử lại hoặc kiểm tra kết nối mạng/thiết lập proxy

### Lộ trình

- Thêm chế độ tối (Dark Mode)
- Lưu lịch sử tìm kiếm cục bộ
- Xuất báo cáo PDF từ phần phân tích AI
- Hỗ trợ thêm ngôn ngữ giao diện

### Đóng góp

Chào mừng mọi đóng góp! Hãy mở issue mô tả yêu cầu/bug hoặc gửi pull request với mô tả rõ ràng.

### Giấy phép

MIT. Bạn có thể sử dụng, sửa đổi và phân phối theo điều khoản giấy phép MIT.
