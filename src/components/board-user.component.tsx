import { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import UserService from "../services/user.service";
import { IUser } from "../types/user.type";
import AdminBoard from "./board-admin.component";
import Profile from "./profile.component";
import UploadImage from "./user/upload-image";

type Props = {};

type State = {
  content: IUser | undefined;
  error?: string;
};

export default class BoardUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: undefined,
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          error:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    if (this.state.error) return <Navigate to={"/home"} />;
    return (
      <div className="container">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/user/upload"} className="nav-link">
                Upload photos
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/user/comment"} className="nav-link">
                Comments
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/user/profile"} className="nav-link">
                Profile
              </Link>
            </li>
          </div>
        </nav>
        <header className="jumbotron">
          <h3>User:{this.state.content && this.state.content.displayName}</h3>
        </header>
        <div className="container mt-3">
          <Routes>
            <Route path="/upload" element={<UploadImage />} />
            <Route path="/comment" element={<AdminBoard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    );
  }
}
