import { ErrorMessage, Field, Form, Formik } from "formik";
import { Component } from "react";
import * as Yup from "yup";
import AuthService from "../services/auth.service";

type Props = {};

type State = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
  successful: boolean;
  message: string;
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      displayName: "",
      email: "",
      password: "",
      successful: false,
      message: "",
    };
    this.handleRegister = this.handleRegister.bind(this);
  }

  validationSchema() {
    return Yup.object().shape({
      email: Yup.string().required("This field is required"),
      password: Yup.string().required("This field is required"),
      firstName: Yup.string().required("This field is required"),
      lastName: Yup.string().required("This field is required"),
      displayName: Yup.string().required("This field is required"),
    });
  }

  handleRegister(fromValue: {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    password: string;
    successful: boolean;
    message: string;
  }) {
    const { firstName, lastName, displayName, email, password } = fromValue;

    AuthService.register(
      firstName,
      lastName,
      displayName,
      email,
      password
    ).then(
      (response) => {
        this.setState({ message: response.data.message, successful: true });
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({ successful: false, message: resMessage });
      }
    );
  }
  render() {
    const { successful, message } = this.state;

    const initialValues = {
      firstName: "",
      lastName: "",
      displayName: "",
      email: "",
      password: "",
      successful: false,
      message: "",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          {/* <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          > */}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <Field
                      name="firstName"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <Field
                      name="lastName"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="displayName">Display Name</label>
                    <Field
                      name="displayName"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="displayName"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sing Up
                    </button>
                  </div>
                </div>
              )}
              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
          {/* </img> */}
        </div>
      </div>
    );
  }
}
