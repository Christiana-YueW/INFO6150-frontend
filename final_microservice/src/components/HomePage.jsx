import {useState} from "react";
import '../styles/home.css';

function HomePage({items, onNavigate, userProfile}) {

    const [recentActivity] = useState([

        'Added "Camera" to Living Room',
        'Moved "Bag" to SideTable',
        'Added "Phone Charger" to Black Cabinet',
        'Moved "Dyson" to Kitchen'
    ])


    const totalItems = items.length;

    const locationCounts = items.reduce((acc, item) => {
        acc[item.location] = (acc[item.location] || 0) + 1;
        return acc;
    }, {});

    //const mostCommonLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]);
    const topLocations = sortedLocations.slice(0, 3);

    const mostRecent = items[items.length - 1]?.name || '-';

    return (
        <section className="home-page">

            <div className="introduction">
                <h1> Hi {userProfile?.name ? `, ${userProfile.name}` : "" }!  </h1>
                <p className="introduction-text">  🍋 Never lost track of your belongings again.</p>
                <p className="about">
                    🔎 Snap a photo, tag it with a name and location, and always know exactly where you stored your items.
                </p>
            </div>

            <div className="cards-panel">
                <div className="card">
                    <h2> Total Items: </h2>
                    <p> {totalItems} </p>
                </div>

                <div className="card">
                    <h2> Common Locations: </h2>

                    {topLocations.length > 0 ? (
                        <ul className="top-locations">
                            {topLocations.map(([loc, count]) => (
                                <li key={loc}>{loc} ({count})</li>
                            ))}

                        </ul>
                    ): (
                        <p className="no-items"> No Saved Items Yet</p>
                    )

                    }

                </div>

                <div className="card">
                  <h2>Most Recent:</h2>
                  <p>{mostRecent}</p>
                </div>


            </div>

              <div className="cards-panel quick-actions-panel">

                <button className="card-button" onClick={() => onNavigate('add')} aria-label="go to add page">
                  Add New Item
                </button>

                <button className="card-button" onClick={() => onNavigate('browse')} aria-label="go to browse page">
                  Browse My Items
                </button>
              </div>


                <div className="activity-accordion">
                    <h2> Recent Activities: </h2>
                    <ul>
                      {recentActivity.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                </div>

        </section>

    );


}

export default HomePage;