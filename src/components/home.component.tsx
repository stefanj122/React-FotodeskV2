import { Component } from "react";
import { DebounceInput } from "react-debounce-input";
import { getPaginationItems } from "../lib/pagination";
import InfiniteScroll from "react-infinite-scroll-component";
import UserService from "../services/user.service";
import { Meta } from "../types/meta.type";
import { IUser } from "../types/user.type";

type Props = {};

type State = {
  content: Array<{
    id: number;
    name: string;
    path: string;
    tags: string;
    user: IUser;
  }>;
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
  componentDidMountWithSearch(search: string) {
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
  async paginate(page = 1, perPage = 9) {
    console.log(page);
    const response = await UserService.getPublicContent(perPage, page);
    this.setState({
      content: [...this.state.content, ...response.data.images],
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
              this.componentDidMountWithSearch(query.target.value);
            }}
          ></DebounceInput>
        </div>
        {this.state.content && (
          <header className="jumbotron jumbotron1">
            <InfiniteScroll
              dataLength={this.state.meta.count}
              next={() => this.paginate(this.state.meta.currentPage + 1)}
              hasMore={
                this.state.meta.currentPage !==
                Math.ceil(this.state.meta.count / this.state.meta.perPage)
              }
              loader={<div key={0}>Loading...</div>}
              endMessage={<h4>Nothing more to show</h4>}
            >
              {this.state.content && (
                <div className="jumbotron1">
                  {this.state.content.map((content) => (
                    <a key={content.id} href={content.path}>
                      <img
                        title={content.name}
                        className="img"
                        src={content.path}
                        alt={content.name}
                      />
                    </a>
                  ))}
                </div>
              )}
            </InfiniteScroll>
          </header>
        )}
        <div
          style={{
            textAlign: "center",
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
                  {item}
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
