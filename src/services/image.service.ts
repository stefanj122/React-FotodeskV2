import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/admin/images";

class ImageService {
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
  getImages(perPage = 9, page = 1, isApproved?: boolean) {
    return axios.get(
      API_URL +
        "?page=" +
        page +
        "&perPage=" +
        perPage +
        "&isApproved=" +
        isApproved,
      {
        headers: authHeader(),
      }
    );
  }
}
const uploadService = new ImageService();
export default uploadService;
