import React, { Component } from "react";
import { DebounceInput } from "react-debounce-input";
import { getPaginationItems } from "../lib/pagination";
import UserService from "../services/user.service";
import { Meta } from "../types/meta.type";
import { Image } from "../types/image.type";
import { Route, Routes } from "react-router-dom";
import SingleImage from "./images/single-image-component";

type Props = {};

type State = {
  content: Image[];
  meta: Meta;
};
export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: [],
      meta: { count: 0, currentPage: 1, perPage: 10, sortBy: ["id", "ASC"] },
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      (response) => {
        this.setState({
          content: response.data.images,
          meta: response.data.meta,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }
  search(search: string) {
    UserService.getSearchResult(search).then(
      (response) => {
        this.setState({
          content: response.data.images,
          meta: response.data.meta,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  async paginate(page: number, perPage: number) {
    const response = await UserService.getPublicContent(perPage, page);
    this.setState({
      // content: [...this.state.content, ...response.data.images],
      content: response.data.images,
      meta: response.data.meta,
    });
  }

  render() {
    return (
      <div className="container">
        <div
          className="center"
          style={{
            marginBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            width: "70%",
          }}
        >
          <DebounceInput
            id="search"
            type="text"
            placeholder="Search images"
            minLength={2}
            debounceTimeout={300}
            className="form-control rounded"
            onChange={(query) => {
              this.search(query.target.value);
            }}
          ></DebounceInput>
        </div>
        {this.state.content && (
          <header className="jumbotron jumbotron1">
            {this.state.content && (
              <div
                style={{
                  display: "grid",
                  textAlign: "center",
                  minHeight: "700px",
                }}
              >
                <h3>
                  {this.state.content.map((content) => (
                    <div
                      key={content.id}
                      style={{ display: "inline-grid", justifyItems: "center" }}
                    >
                      <h1>
                        <a
                          key={content.id}
                          href={`http://localhost:3006/images/${content.id}`}
                        >
                          <img
                            title={content.name}
                            className="img"
                            src={content.path}
                            alt={content.name}
                          />
                        </a>
                      </h1>
                      <div style={{ minHeight: "30px" }}>
                        {content.tags && (
                          <h6>
                            {"#" +
                              content.tags
                                .replaceAll(" ", ",")
                                .split(",")
                                .filter((value) => value)
                                .join("#")}
                          </h6>
                        )}
                      </div>
                    </div>
                  ))}
                </h3>
              </div>
            )}
          </header>
        )}
        <div
          style={{
            textAlign: "center",
            position: "fixed",
            bottom: 30,
            right: 0,
            left: 0,
          }}
        >
          <footer>
            <button
              className="btn btn-primary"
              disabled={this.state.meta.currentPage === 1}
              onClick={() =>
                this.paginate(
                  this.state.meta.currentPage - 1,
                  this.state.meta.perPage
                )
              }
            >
              Previous
            </button>
            {getPaginationItems(
              this.state.meta.currentPage,
              Math.ceil(this.state.meta.count / this.state.meta.perPage),
              7
            ).map((item) => {
              return (
                <button
                  key={item}
                  onClick={() => this.paginate(item, this.state.meta.perPage)}
                  className={
                    this.state.meta.currentPage === item
                      ? "btn btn-primary active"
                      : "btn btn-primary"
                  }
                >
                  {item ? item : "..."}
                </button>
              );
            })}
            <button
              className="btn btn-primary"
              disabled={
                this.state.meta.currentPage ===
                Math.ceil(this.state.meta.count / this.state.meta.perPage)
              }
              onClick={() =>
                this.paginate(
                  this.state.meta.currentPage + 1,
                  this.state.meta.perPage
                )
              }
            >
              Next
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
