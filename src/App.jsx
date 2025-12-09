import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import DashboardScreen from './DashboardScreen';
import { Button, Layout, Menu } from 'antd'; // For Layout later, or just simple use for now
const { Header, Content } = Layout;


axios.defaults.baseURL = "http://localhost:3000"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    // Check for token on startup
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
    }
  }, [])

  const handleLoginSuccess = (token, remember) => {
    if(remember) {
      localStorage.setItem('token', token)
    }
    setIsAuthenticated(true)
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }
  


  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? 
        <LoginScreen onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />
      } />
      <Route path="/*" element={
        isAuthenticated ? (
          <Layout className="layout">
            <Header style={{ display: 'flex', alignItems: 'center' }}>
               <div className="demo-logo" style={{ color: 'white', marginRight: '20px' }}>Book Store</div>
               <Menu 
                 theme="dark" 
                 mode="horizontal" 
                 defaultSelectedKeys={['1']} 
                 style={{ flex: 1 }}
                 onClick={(e) => {
                   if(e.key === '1') navigate('/');
                   if(e.key === '2') navigate('/dashboard');
                 }}
               >
                 <Menu.Item key="1">Books</Menu.Item>
                 <Menu.Item key="2">Dashboard</Menu.Item>
               </Menu>
               <Button type="primary" danger onClick={handleLogout}>Logout</Button>
            </Header>
            <Content style={{ padding: '0 50px', marginTop: '20px' }}>
              <Routes>
                <Route path="/" element={<BookScreen />} />
                <Route path="/dashboard" element={<DashboardScreen />} />
              </Routes>
            </Content>
          </Layout>
        ) : <Navigate to="/login" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
