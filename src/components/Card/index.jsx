import React, { useState } from "react";
import "./card.css";

const Card = ({ src, alt }) => {
  const [isError, setIsError] = useState(false);

  return (
    <div className="card">
      <div className="image-container">
        {!isError && (
          <img
            src={src ? `https://image.tmdb.org/t/p/original/${src}` : ""}
            alt={alt}
            onError={() => setIsError(true)} // Mark as error when image fails
            lazy="true"
          />
        )}
        {isError && <p className="alt-text">{alt}</p>}
      </div>
    </div>
  );
};

export default Card;
