import { useState } from 'react'
import Reorder from './Reorder';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

    const handleReorder = () => {
      setCount(5);
    }

    return (

        <main className="app-container">
            <div className="inventory-section">

                <p className="inventory-label"> Inventory Count : {count} </p>

                <div className="buttons">

                    <button className="inventory-button" onClick={() => setCount(count + 1)}> + </button>
                    <button className="inventory-button" onClick={() => setCount(count - 1)} disabled={!count}> - </button>

                </div>

            </div>
            {count === 0 && <Reorder onReorder={handleReorder} />}
        </main>
    );
}

export default App;
