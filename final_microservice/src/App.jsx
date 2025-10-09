import {useState, useEffect, useRef} from 'react'
import SkipLink from "./components/SkipLink.jsx";
import Header from "./components/Header.jsx";
import HomePage from "./components/HomePage.jsx";
import AddItemPage from "./components/AddItemPage.jsx";
import BrowsePage from "./components/BrowsePage.jsx";
import AskPage from "./components/AskPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import Footer from "./components/Footer.jsx";
import LoginPage from "./components/LoginPage.jsx";
import api from "./services/api.js";

import './styles/App.css'
import './styles/header.css';
import './styles/home.css';
import './styles/add.css';
import './styles/browse.css';
import './styles/ask.css';
import './styles/settings.css'
import './styles/footer.css';
import './styles/login.css';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userProfile, setUserProfile] = useState(null);
  const [theme, setTheme] = useState("light");
  const [items, setItems] = useState([]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = api.auth.isAuthenticated();
      const user = api.auth.getCurrentUser();

      if (authenticated && user) {
        setIsAuthenticated(true);
        setUserProfile(user);
        await loadItems(user.id);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Load items from backend
  const loadItems = async (userId) => {
    try {
      const response = await api.item.getAll(userId);
      if (response.success) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  // Handle login/register
  const handleLogin = async (email, password, name, isLogin) => {
    try {
      let response;
      if (isLogin) {
        response = await api.auth.login(email, password);
      } else {
        response = await api.auth.register(email, password, name);
      }

      if (response.success && response.data) {
        setIsAuthenticated(true);
        setUserProfile(response.data.user);
        await loadItems(response.data.user.id);
      }
    } catch (error) {
      throw error;
    }
  };

  // Handle logout
  const handleLogout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setUserProfile(null);
    setItems([]);
    setCurrentPage('home');
  };

  // Handle add item
  const handleAddItem = async (itemData) => {
    try {
      const response = await api.item.create(userProfile.id, itemData);
      if (response.success) {
        setItems(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  // Handle update user profile
  const handleUpdateUserProfile = async (updates) => {
    try {
      const response = await api.user.updateProfile(userProfile.id, updates);
      if (response.success) {
        setUserProfile(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Handle change password
  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.user.changePassword(
        userProfile.id,
        currentPassword,
        newPassword
      );
      if (response.success) {
        alert('Password changed successfully!');
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      alert(error.message || 'Failed to change password. Please try again.');
    }
  };

  useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navigate = (pageKey) => {
      setCurrentPage(pageKey);

      if (window.location.hash !== `#${pageKey}`) {
          window.history.replaceState(null, '', `#${pageKey}`);
      }
  }

  // Show loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
      <div className="app-root" id="top">
        <SkipLink />
          <Header
            currentPage={currentPage}
            onNavigate={navigate}
            userProfile={userProfile}
            onLogout={handleLogout}
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
                  <AskPage items={items} userProfile={userProfile} userId={userProfile.id} />
              )}

              {currentPage === 'settings' && (
                  <SettingsPage
                      userProfile={userProfile}
                      onUpdateUserProfile={handleUpdateUserProfile}
                      onChangePassword={handleChangePassword}
                      theme={theme}
                      onSetTheme={setTheme}
                  />
              )}
          </main>

          <Footer userName={userProfile?.name} onNavigate={navigate} />

      </div>
  )

}

export default App
