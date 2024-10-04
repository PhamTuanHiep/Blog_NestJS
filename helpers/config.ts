import { diskStorage } from 'multer';

export const storageConfig = (folder: string) =>
  //cấu hình diskStorage dùng cho Multer, bao gồm thông tin về đích đến và cách đặt tên tệp.
  diskStorage({
    //Nơi lưu trữ tệp
    destination: `uploads/${folder}`,
    //Quy tắc đặt tên cho tệp.
    //req: Yêu cầu HTTP (HTTP request) khi tải tệp lên.
    //file: Object chứa thông tin về tệp đang tải lên (bao gồm tên gốc, kiểu MIME, v.v.).
    //cb: Callback function, quyết định tên của tệp sau khi xử lý.
    filename: (req, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    },
  });
