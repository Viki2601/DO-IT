import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import './tailwind.output.css';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


function App() {

  const [cookie, setCookie] = useState(Cookies.get("email"));
  useEffect(() => {
    const intervel = setInterval(() => {
      const updatedCookie = Cookies.get("email");
      if (updatedCookie !== cookie) {
        setCookie(updatedCookie);
      }
    }, 1000)
    return () => { clearInterval(intervel) }
  }, [cookie])

  return (
    <div className='app'>
      <Router>
        <Routes>
          {cookie === undefined && <Route path='/login' element={<Login />} />}
          {cookie !== undefined && <Route path='/login' element={<Home />} />}
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
