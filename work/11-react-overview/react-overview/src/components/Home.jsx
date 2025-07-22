import '../styles/home.css';

function Home() {

    return (

        <section className="home">

            <h1 className="home-title">
                Love! Love Cats!
            </h1>
            <p className="home-description">
                Welcome to the home page! This is a cozy place just for cat lovers. Enjoy the purrfect experience!
            </p>

            <div className="home-features">
                <div className="feature-card">
                    <h2> 🐱 Profiles </h2>
                    <p> Manage your username, actual name. </p>
                </div>

                <div className="feature-card">
                    <h2> 🌟 Dog-Free Mode </h2>
                    <p> Certified Dog-Free? Awesome! </p>
                </div>

            </div>


        </section>

    )
}

export default Home;