import { useEffect, useState } from "react";
import { Image } from "../../types/image.type";
import { Meta } from "../../types/meta.type";
import ImageService from "../../services/image.service";
import { useParams } from "react-router-dom";

export default function SingleImage() {
  const [image, setImages] = useState({} as Image | undefined);
  const [meta, setMeta] = useState({ count: 1 } as Meta);
  const [comments, setComments] = useState(
    [] as { id: number; content: string; rate: number }[]
  );
  const { imageId } = useParams();

  useEffect(() => {
    if (imageId) {
      ImageService.getImage(+imageId).then(
        (response) => {
          setImages(response.data.image);
          setMeta(response.data.meta);
          setComments(response.data.comments);
        },
        (error) => {
          setImages(undefined);
        }
      );
    }
  }, []);

  const paginate = async (page = 1, perPage = 3) => {
    const response = await ImageService.getImages(perPage, page, false);
    // setImages([...images, ...response.data.images]);
    setComments(response.data.comments);
    setMeta(response.data.meta);
  };

  return (
    <div className="container">
      <header className="jumbotron jumbotron1">
        {image && (
          <h4>
            <img
              title={image.name}
              className="img"
              src={image.path}
              alt={image.name}
            />

            {image.tags}
          </h4>
        )}
        <h1>
          {comments && (
            <div>
              {comments.map((comment) => (
                <h3 className="comment" key={comment.id}>
                  Content:{comment.content},Rate:{comment.rate}
                </h3>
              ))}
            </div>
          )}
        </h1>
      </header>
    </div>
  );
}
