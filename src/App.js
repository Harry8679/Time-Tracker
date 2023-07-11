import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Footer from './components/Footer';
import Login from './pages/Login';
import CreateTaskPage from './pages/CreateTask';
import Reports from './components/Reports';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/connexion' element={<Login />} />
        <Route path='/creer-une-tache' element={<CreateTaskPage />} />
        <Route path='/rapports' element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
