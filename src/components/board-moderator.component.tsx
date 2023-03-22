import { Component } from "react";

import UserService from "../services/user.service";
import { IUser } from "../types/user.type";

type Props = {};

type State = {
  content: IUser | undefined;
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
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content && this.state.content.displayName}</h3>
        </header>
      </div>
    );
  }
}
