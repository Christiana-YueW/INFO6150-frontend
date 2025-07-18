import './Panel.css';



function Panel({ title, text, img, imgAlt }) {
  return (
    <div className="panel">
      <img src={img} alt={imgAlt || title} />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Panel;
