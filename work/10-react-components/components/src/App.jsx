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
    const [contactClicked, setContactClicked] = useState(false);
    const [demoClicked, setDemoClicked] = useState(false);

    const openModal = () => {
        setModalOpen(true);
        setContactClicked(true);
        setTimeout(() => setContactClicked(false), 3000);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleDemoClick = () => {
        setDemoClicked(true);
        setTimeout(() => setDemoClicked(false), 2000);
    };

    return (
        <div className="App">
            <Header setPage={setPage} />

            <main>

                <div className="page-content">
                    {page === "Text" && <TextPage />}
                    {page === "CardsPage" && <CardsPage />}
                    {page === "PanelsPage" && <PanelsPage />}

                    <div className="button-group">

                        <Button type="button" visual="button" onClick={openModal}>
                        Contact Us
                        </Button>

                        <Button type="button" visual="link" onClick={handleDemoClick}>
                            Demo
                        </Button>
                    </div>

                    {contactClicked &&  (
                        <p className="feedback-message feedback-success">
                            ✅ Contact modal opened!
                        </p>
                    )}

                    {demoClicked && (
                        <p className="feedback-message feedback-info">
                            ✅ Demo button clicked! Thanks for trying it.
                        </p>
                    )}


                </div>
            </main>
            <Footer />

            <Modal isOpen={modalOpen} onClose={closeModal} />
        </div>
    )

}
export default App;