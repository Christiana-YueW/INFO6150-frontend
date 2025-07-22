import { useState } from 'react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import './styles/App.css'

const defaultProfiles = [

    {
        pic: 'profile1.jpg',
        username: 'mimi',
        actualName: 'Mimi Cat',
        dogFree: true
    },

    {
        pic: 'profile2.jpg',
        username: 'lala',
        actualName: 'Lala Cat',
        dogFree: false
    },

    {
        pic: 'profile3.jpg',
        username: 'didi',
        actualName: 'Didi Cat',
        dogFree: true
    }

]


function App() {

    const [page, setPage] = useState('home')
    const [currentIndex, setCurrentIndex] = useState(0);
    const [profiles, setProfiles] = useState(defaultProfiles);

    const profile = profiles[currentIndex];

    function updateCurrentProfile(newData) {
        const updated = [...profiles];
        updated[currentIndex] = newData;
        setProfiles(updated);
    }

    return (
        <>
            <Header
                profile={profile}
                setPage={setPage}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            />

            <main className="app">
                {page === 'home' && <Home />}
                {page === 'profile' && (<Profile profile={profile} setProfile={updateCurrentProfile} />)}
            </main>

        </>

    )
}

export default App
