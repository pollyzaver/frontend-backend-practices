import React, { useState, useEffect } from 'react';
import ProductsPage from './pages/ProductsPage';
import Login from './components/Login';
import Register from './components/Register';
import { getMe, logout } from './api/authApi';
import './App.css';
import './components/Auth.css'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await getMe();
      setUser(userData);
      setUserRole(userData.role);
    } catch (error) {
      console.error('Не авторизован');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = () => {
    checkAuth();
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setUserRole(null);
  };

  if (loading) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        {showRegister ? (
          <div>
            <Register onRegister={() => setShowRegister(false)} />
            <div className="auth-switch">
              <button onClick={() => setShowRegister(false)}>
                Назад к входу
              </button>
            </div>
          </div>
        ) : (
          <div>
            <Login onLogin={handleLogin} />
            <div className="auth-switch">
              <button onClick={() => setShowRegister(true)}>
                Нет аккаунта? Зарегистрироваться
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        background: '#1a1a1a',
        borderBottom: '1px solid #333'
      }}>
        <div>
          <span style={{ color: '#b90f0f', fontWeight: 'bold', marginRight: '10px' }}>
            {userRole === 'admin' ? 'Администратор' : 'Пользователь'}
          </span>
          <span>
            {user.first_name} {user.last_name} ({user.email})
          </span>
        </div>
        <button onClick={handleLogout} style={{ padding: '6px 12px' }}>
          Выйти
        </button>
      </div>
      <ProductsPage userRole={userRole} />
    </div>
  );
}

export default App;