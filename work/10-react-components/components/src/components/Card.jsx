import './Card.css';


function Card({ title, text, img, imgAlt, link, setPage }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <img src={img} alt={imgAlt ||`${title} image`} />
      <p>{text}</p>
      {link && (
        <button className="card__link" onClick={() => setPage(link)}>
          Learn More
        </button>
      )}
    </div>
  );
}

export default Card;
