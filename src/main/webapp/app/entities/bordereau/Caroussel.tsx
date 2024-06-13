import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Caroussel = ({ items }) => {
  if (!items || items.length === 0) {
    return <p>No items to display</p>;
  }

  return (
    <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} useKeyboardArrows={true} autoPlay={true} dynamicHeight={true}>
      {items.map((item, index) => (
        <div key={index} className="carousel-item">
          {item.articles && item.articles.imageUrl ? (
            <img src={item.articles.imageUrl} alt={item.articles.modele} className="carousel-image" />
          ) : (
            <p>Image not available</p>
          )}
          <div className="carousel-caption">
            <h4>{item.articles ? item.articles.modele : 'No Model'}</h4>
            <p>Quantité: {item.quantite}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default Caroussel;
