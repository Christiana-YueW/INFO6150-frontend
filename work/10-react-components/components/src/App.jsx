import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import TextPage from "./pages/TextPage";
import CardsPage from "./pages/CardsPage";
import PanelsPage from "./pages/PanelsPage";
import './App.css';
import Modal from "./Modal";
import Button from "./Button";


function App() {
    const [page, setPage] = useState('Text');
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="App">
            <Header setPage={setPage} />

            <main>
                <div className="page-content">
                    {page === "Text" && <TextPage />}
                    {page === "CardsPage" && <CardsPage />}
                    {page === "PanelsPage" && <PanelsPage />}

                    <Button type="button" visual="button" onClick={openModal}>
                        Contact Us
                    </Button>

                </div>
            </main>
            <Footer />

            <Modal isOpen={modalOpen} onClose={closeModal} />
        </div>
    )

}
export default App;