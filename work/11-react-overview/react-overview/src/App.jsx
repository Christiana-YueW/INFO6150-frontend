import { useState } from 'react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import './styles/app.css'

const defaultProfiles = [

    {
        pic: 'profile1.png',
        username: 'mimi',
        actualName: 'Mimi Cat',
        dogFree: true
    },

    {
        pic: 'profile2.png',
        username: 'lala',
        actualName: 'Lala Cat',
        dogFree: false
    },

    {
        pic: 'profile3.png',
        username: 'didi',
        actualName: 'Didi Cat',
        dogFree: true
    }

]


function App() {

    const [state, setState] = useState('home')
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
                setCurretnIndex={setCurrentIndex}
            />

            <main className="app">
                {page === 'home' && <Home />}
                {page === 'profile' && (<Profile profile={profile} setProfile={updateCurrentProfile} />)}
            </main>

        </>

    )
}

export default App
