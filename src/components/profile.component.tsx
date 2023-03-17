import { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { IUser } from "../types/user.type";

type Props = {};

type State = {
  redirect: string | null;
  userReady: boolean;
  currentUser: { data: IUser } & { access_token: string };
};
export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: {
        data: {
          id: 0,
          displayName: "",
          role: "",
          firstName: "",
          lastName: "",
        },
        access_token: "",
      },
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const { currentUser } = this.state;

    return (
      <div className="container">
        {this.state.userReady ? (
          <div className="card">
            <header className="jumbotron">
              <h3>
                <strong>
                  {currentUser.data.firstName + " " + currentUser.data.lastName}
                </strong>{" "}
              </h3>
            </header>
            <div>
              <p>
                <strong>Token:</strong>{" "}
                {currentUser.access_token.substring(0, 20)} ...{" "}
                {currentUser.access_token.substr(
                  currentUser.access_token.length - 20
                )}
              </p>
              <p>
                <strong>Id:</strong> {currentUser.data.id}
              </p>
              <p>
                <strong>Name:</strong>{" "}
                {currentUser.data.firstName + " " + currentUser.data.lastName}
              </p>
              <p>
                <strong>Display name:</strong> {currentUser.data.displayName}
              </p>
              <strong>Authorities:</strong> {currentUser.data.role}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
