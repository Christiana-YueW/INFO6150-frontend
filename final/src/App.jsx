import {useState, useEffect, useRef} from 'react'
import SkipLink from "./components/SkipLink.jsx";
import Header from "./components/Header.jsx";
import HomePage from "./components/HomePage.jsx";
import AddItemPage from "./components/AddItemPage.jsx";
import BrowsePage from "./components/BrowsePage.jsx";
import AskPage from "./components/AskPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import Footer from "./components/Footer.jsx";

import './styles/App.css'
import './styles/header.css';
import './styles/home.css';
import './styles/add.css';
import './styles/browse.css';
import './styles/ask.css';
import './styles/settings.css'
import './styles/footer.css';


function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const [userProfile, setUserProfile] = useState({
      name: 'Jane Smith',
      avatarUrl: '/avatar-default.jpg',
      email:'janesmith@fys.com',
  });

  const [theme, setTheme] = useState("light");


  const [items, setItems] = useState([
      { id: 'i1', name: 'Camera', location: 'Living Room', photo: '/camera.jpg' },
      { id: 'i2', name: 'Bag', location: 'SideTable', photo: '/bag.jpg' },
      { id: 'i3', name: 'Phone Charger', location: 'Black Cabinet', photo: '/phonecharger.jpg' },
      { id: 'i4', name: 'Dyson', location: 'Kitchen', photo: '/dyson.jpg' },
  ]);

  useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
  },
      [theme]
  );


  const navigate = (pageKey) => {
      setCurrentPage(pageKey);

      if (window.location.hash != `#${pageKey}`) {
          window.history.replaceState(null, '', `#${pageKey}`);
      }
  }

  //add new item handle, add item page
  const handleAddItem = newItem => {
      const id = 'i' + Date.now().toString(36);

      setItems(prev => [...prev, { ...newItem, id }]);
      setCurrentPage('browse');
  }

  return (
      <div className="app-root" id="top">
        <SkipLink />
          <Header
            currentPage={currentPage}
            onNavigate={navigate}
            userProfile={userProfile}
          />

          <main id="main-content" tabIndex={-1} className="app-main">
              {currentPage === 'home' && (
                  <HomePage items={items} onNavigate={navigate} userProfile={userProfile} />
              )}

              {currentPage === 'add' && (
                <AddItemPage onAddItem={handleAddItem} onNavigate={navigate} />
              )}

              {currentPage === 'browse' && (
                  <BrowsePage items={items} />
              )}

              {currentPage === 'ask' && (
                  <AskPage items={items} userProfile={userProfile} />
              )}

              {currentPage === 'settings' && (
                  <SettingsPage
                      userProfile={userProfile}
                      onUpdateUserProfile={(updates) => setUserProfile(prev => ({ ...prev, ...updates }))}
                      onChangePassword={(newPwd) => console.log("Password changed:", newPwd)}
                      theme={theme}
                      onSetTheme={setTheme}
                  />
              )}



          </main>

          <Footer userName={userProfile.name} onNavigate={navigate} />

      </div>
  )

}

export default App
