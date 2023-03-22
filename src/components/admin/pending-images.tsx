import { Component, useEffect, useState } from "react";
import ImageService from "../../services/image.service";
import { Meta } from "../../types/meta.type";
import InfiniteScroll from "react-infinite-scroll-component";
import { Image } from "../../types/image.type";

// type State = {
//   images: Image[];
//   meta?: Meta;
//   error?: string;
// };
// type Props = {};

// export default class PendingImages extends Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       images: [],
//     };
//   }

//   componentDidMount() {
//     ImageService.getImages(3, 1, false).then(
//       (response) => {
//         this.setState({
//           images: response.data.images,
//           meta: response.data.meta,
//         });
//       },
//       (error) => {
//         this.setState({
//           error:
//             (error.response &&
//               error.response.data &&
//               error.response.data.message) ||
//             error.message ||
//             error.toString(),
//         });
//       }
//     );
//   }

//   async paginate(page = 1, perPage = 9) {
//     console.log(page);
//     const response = await ImageService.getImages(perPage, page, false);
//     this.setState({
//       images: [...this.state.images, ...response.data.images],
//       meta: response.data.meta,
//     });
//   }

//   render() {
//     const { images, meta } = this.state;
//     return (
//       <div className="container">
//         {images && meta && (
//           <header className="jumbotron jumbotron1">
//             <InfiniteScroll
//               dataLength={meta.count}
//               next={() => this.paginate(meta.currentPage + 1, 3)}
//               hasMore={
//                 meta.currentPage !== Math.ceil(meta.count / meta.perPage)
//               }
//               loader={<div key={0}>Loading...</div>}
//               endMessage={<h4>Nothing more to show</h4>}
//             >
//               <div className="jumbotron1">
//                 {images.map((content) => (
//                   <a key={content.id} href={content.path}>
//                     <img
//                       title={content.name}
//                       className="img"
//                       src={content.path}
//                       alt={content.name}
//                     />
//                   </a>
//                 ))}
//               </div>
//             </InfiniteScroll>
//           </header>
//         )}
//       </div>
//     );
//   }
// }
export default function PendingImages() {
  const [images, setImages] = useState([] as Image[]);
  const [meta, setMeta] = useState({ count: 1 } as Meta);

  useEffect(() => {
    ImageService.getImages(3, 1, false).then(
      (response) => {
        setImages(response.data.images);
        setMeta(response.data.meta);
      },
      (error) => {
        setImages([]);
        setMeta({
          count: 0,
          currentPage: 1,
          perPage: 9,
          sortBy: ["id", "ASC"],
        });
      }
    );
  }, []);

  const paginate = async (page = 1, perPage = 3) => {
    console.log(page);
    const response = await ImageService.getImages(perPage, page, false);
    setImages([...images, ...response.data.images]);
    setMeta(response.data.meta);
  };

  return (
    <div className="container">
      <header className="jumbotron jumbotron1">
        <InfiniteScroll
          dataLength={meta.count}
          next={() => paginate(meta.currentPage + 1, 3)}
          hasMore={meta.currentPage !== Math.ceil(meta.count / meta.perPage)}
          loader={<div key={0}>Loading...</div>}
          endMessage={<h4>Nothing more to show</h4>}
        >
          <div className="jumbotron1">
            {images[0] &&
              images.map((content) => (
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
        </InfiniteScroll>
      </header>
    </div>
  );
}
