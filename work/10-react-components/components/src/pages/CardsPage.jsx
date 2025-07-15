import cardData from '../data/cards';
import Card from '../components/Card';
import './CardsPage.css';


function CardsPage({setPage}) {
    return (
        <section>
            <h2> Cards Content </h2>
            <div className="cards-page">
                {cardData.map((card, index) => (
                    <Card key={index} {...card} setPage={setPage} />
                ))}
            </div>

        </section>

    )
}

export default CardsPage;