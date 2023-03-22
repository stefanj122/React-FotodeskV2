import { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import BoardAdmin from "./board-moderator.component";
import UserService from "../services/user.service";
import { IUser } from "../types/user.type";
import Profile from "./profile.component";
import PendingImages from "./admin/pending-images";

type Props = {};

type State = {
  content: IUser;
};

export default class BoardUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: {
        id: 0,
        displayName: "",
        firstName: "",
        lastName: "",
        role: "",
      },
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
          content:
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
    if (this.state.content.role && this.state.content.role !== "admin")
      return <Navigate to={"/user"} />;
    return (
      <div className="container">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/admin/pending/images"} className="nav-link">
                Pending images
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/admin/comment"} className="nav-link">
                Comments
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/admin/profile"} className="nav-link">
                Profile
              </Link>
            </li>
          </div>
        </nav>
        <header className="jumbotron">
          <h3>{this.state.content.firstName}</h3>
        </header>
        <div className="container mt-3">
          <Routes>
            <Route path="/pending/images" element={<PendingImages />} />
            <Route path="/comment" element={<BoardAdmin />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    );
  }
}
