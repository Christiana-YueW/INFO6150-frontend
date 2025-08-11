import "../styles/footer.css";

function Footer({ userName = "Jane Smith"}) {

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-labelledby="footer-heading">

      <h2 id="footer-heading" className="visually-hidden"> Site footer </h2>

      <div className="footer-top">

        <div className="brand">

          <a className="brand__link" href="#home" aria-label="Home" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>
            <span className="brand__logo" aria-hidden="true">📦</span>
            <span className="brand__name">FindMyStuff</span>
          </a>

          <p className="brand__tagline">Know where everything lives.</p>
          <p className="brand__user">Signed in as <strong> {userName} </strong></p>

        </div>


          <div className="footer-shortcuts">

            <a href="#top" className="back-to-top">Back to top ↑ </a>

          </div>
     </div>

          <div className="footer-bottom">
            <p className="copyright"> © {year} FindMyStuff. All rights reserved. </p>
          </div>


    </footer>
  );
}

export default Footer;