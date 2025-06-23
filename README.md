## Mô tả Dự Án

Đây là frontend của website "Nhập liệu với AI".
Việc nhập liệu hiện nay vẫn được thực hiện thủ công bởi con người (nhân sự thời vụ). Nhận thấy thực tế đó khi làm việc ở công ty cũ (chuyên về chỉnh lý & số hóa tài liệu giấy), tôi lập trình website này với mục đích ứng dụng AI vào việc nhập liệu.
Với tham vọng ban đầu là đưa website vào sử dụng thực tế, nhưng sau 10 ngày triển khai, nhận ra bản thân không đủ trình độ và nguồn lực để thực hiện, tôi quyết định kết thúc dự án.
Website hiện dừng lại ở việc "chạy được", đảm bảo nhận file và trả về dữ liệu yêu cầu, nhưng vẫn chưa hoàn thiện về giao diện, tính năng, độ tính xác và chi phí vận hành

## 🚀 Tính năng
Website nhận đầu vào là những file PDF scan văn bản hành chính, rồi trả về các trường dữ liệu như loại văn bản, cơ quan ban hành, trích yếu nội dung, người ký, v.v.
Luồng hoạt động: người dùng tải các file PDF lên server, sử dụng các thư viện Python để nhận dữ liệu dạng text, rồi dùng ChatGPT API để nhận lại các trường thông tin mong muốn

## 📦 Cài đặt

Backend tương ứng: https://github.com/vuongoctien/backend_data_entry_with_AI.git
Để khởi chạy frontend trên localhost, bạn cần cài NodeJS (>16)

```bash
git clone https://github.com/vuongoctien/frontend_data_entry_with_AI.git
cd frontend_data_entry_with_AI
npm i
npm start
