import { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import UploadService from "../services/upload.service";
import UserService from "../services/user.service";
import { IUser } from "../types/user.type";
import AdminBoard from "./board-admin.component";

type Props = {};

type State = {
  content: IUser | undefined;
  images?: File[] | FileList | undefined;
  response: { images?: { id: number; name: string; path: string }[] } & {
    status?: string[];
  };
  error?: string;
  output: { id: string | undefined; tags: string }[];
  message?: string;
};

export default class BoardUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: undefined,
      images: undefined,
      response: {},
      output: [],
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

  uploadImages(image?: any) {
    if (!image) return;
    UploadService.upload(image).then(
      (response) => {
        this.setState({
          response: response.data,
          images: undefined,
        });
      },
      (error) => {
        this.setState({
          error:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    this.setState({
      images: selectedFiles,
    });
  };

  submit(data: { id: string | undefined; tags: string }[]) {
    UploadService.setTags(data).then((response) => {
      this.setState({
        message: response.data,
      });
    });
  }

  render() {
    if (this.state.error) return <Navigate to={"/home"} />;
    return (
      <div className="container">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                Upload photos
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/user/comment"} className="nav-link">
                Comments
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                Profile
              </Link>
            </li>
          </div>
        </nav>
        <header className="jumbotron">
          <h3>User:{this.state.content && this.state.content.displayName}</h3>
          {this.state.message && (
            <h1 style={{ textAlign: "center" }}>Successfully updated tags</h1>
          )}
        </header>
        <div className="row">
          <div className="col-8">
            <label className="btn btn-default p-0">
              <input
                type="file"
                onChange={this.selectFile}
                style={{ fontSize: "20px" }}
                multiple
              />
            </label>
          </div>

          <div className="col-4" style={{ textAlign: "center" }}>
            <button
              className="btn btn-success btn-sm"
              style={{ width: "60%", height: "90%", fontSize: "22px" }}
              disabled={!this.state.images}
              onClick={() => this.uploadImages(this.state.images)}
            >
              Upload
            </button>
          </div>
        </div>
        <div style={{ display: "grid" }}>
          {this.state.response.images ? (
            <h3>
              {this.state.response.images.map((content: any) => (
                <div
                  key={content.id}
                  style={{ display: "inline-grid", justifyItems: "center" }}
                >
                  <h1>
                    <a href={content.path} key={content.id} className="img">
                      <img
                        className="img"
                        src={content.path}
                        alt={content.name}
                      />
                    </a>
                  </h1>

                  <input
                    id={content.id}
                    type="text"
                    placeholder="Set tags for image"
                    style={{
                      maxHeight: "40px",
                      maxWidth: "70%",
                    }}
                    onChange={(e) => {
                      this.setState({
                        output: [
                          ...this.state.output,
                          {
                            id: e.target.id,
                            tags: e.target.value,
                          },
                        ],
                      });
                    }}
                  ></input>
                </div>
              ))}
              <footer style={{ textAlign: "center" }}>
                <form
                  onSubmit={() => {
                    this.submit(this.state.output);
                  }}
                  style={{ justifyItems: "center" }}
                  action="#"
                >
                  <input type="submit"></input>
                </form>
              </footer>
            </h3>
          ) : (
            <h3>{this.state.response.status}</h3>
          )}
        </div>
        <div className="container mt-3">
          <Routes>
            <Route path="/user/comment" element={<AdminBoard />} />
          </Routes>
        </div>
      </div>
    );
  }
}
