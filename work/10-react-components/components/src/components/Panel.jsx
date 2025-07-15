import './Panel.css';



function Panel({ title, text, img }) {
  return (
    <div className="panel">
      <img src={img} alt={title} />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Panel;
