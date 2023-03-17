import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/admin/user";

class UserService {
  getPublicContent(perPage = 9, page = 1) {
    return axios.get(
      "http://localhost:3000/public/images?perPage=" + perPage + "&page=" + page
    );
  }

  getUserBoard() {
    return axios.get(API_URL + "/me", { headers: authHeader() });
  }

  getSearchResult(search: string, perPage = 9) {
    return axios.get(
      "http://localhost:3000/public/images?search=" +
        search +
        "&perPage=" +
        perPage,
      {
        headers: authHeader(),
      }
    );
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}

export default new UserService();
