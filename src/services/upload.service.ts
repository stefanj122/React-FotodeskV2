import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/admin/images";

class UploadService {
  upload(file: File[]) {
    let fromData = new FormData();
    for (const image of file) {
      fromData.append("images", image);
    }
    return axios.post(API_URL + "/upload", fromData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  }
  setTags(data: { id: string | undefined; tags: string }[]) {
    return axios.put(API_URL + "/tags", data, { headers: authHeader() });
  }
}
const uploadService = new UploadService();
export default uploadService;
