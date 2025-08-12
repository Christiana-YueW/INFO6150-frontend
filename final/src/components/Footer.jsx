import "../styles/footer.css";

function Footer({ userName = "Jane Smith", onNavigate}) {

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-labelledby="footer-heading">

      <div className="footer-top">



          <a href="#home" className="brand__link" aria-label="go to HomePage" onClick={() => onNavigate('home')}>
            <span className="brand__logo" aria-hidden="true">📦</span>
            <span className="brand__name"> FindMyStuff </span>
          </a>

          <div className="brand__info">

          <p className="brand__tagline"> Know where everything lives. </p>
          <p className="brand__user"> Signed in as <strong>{userName}</strong></p>

          </div>


          <div className="footer-shortcuts">

            <a href="#top" className="back-to-top"> Back to top ↑ </a>

          </div>
     </div>

          <div className="footer-bottom">
            <p className="copyright"> © {year} FindMyStuff. Hope you like this website.  </p>
          </div>


    </footer>
  );
}

export default Footer;