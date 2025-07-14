import cardData from '../data/cards';
import Card from '../components/Card';

function CardsPage({setPage}) {
    return (
        <section>
            <h2> Cards Content </h2>
            <div className="cards-page">
                {cardData.map((card, index) => (
                    <Card key={index} {...card} setpage={setPage} />
                ))}
            </div>

        </section>

    )
}

export default CardsPage;