import axios from "axios";
const API_URL = "http://localhost:3000/auth";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "/login", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.access_token) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data, response.data.access_token)
          );
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(
    firstName: string,
    lastName: string,
    displayName: string,
    email: string,
    password: string
  ) {
    return axios.post(API_URL + "/register", {
      firstName,
      lastName,
      displayName,
      email,
      password,
    });
  }
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}
const authService = new AuthService();
export default authService;
