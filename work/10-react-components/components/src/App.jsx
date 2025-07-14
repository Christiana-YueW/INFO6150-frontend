import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import TextPage from "./pages/TextPage";
import CardsPage from "./pages/CardsPage";
import PanelsPage from "./pages/PanelsPage";
import './App.css';

function App() {
    const [page, setPage] = useState('Text');

    return (
        <div className="App">
            <Header setPage={setPage} />
            <main>
                {page === "Text" && <TextPage />}
                {page === "CardsPage" && <CardsPage />}
                {page === "PanelsPage" && <PanelsPage />}
            </main>
            <Footer />
        </div>
    )

}
export default App;