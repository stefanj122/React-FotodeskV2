import { Component } from "react";
import { Navigate } from "react-router-dom";

import UserService from "../services/user.service";
import { IUser } from "../types/user.type";

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
        <header className="jumbotron">
          <h3>{this.state.content.firstName}</h3>
        </header>
      </div>
    );
  }
}
