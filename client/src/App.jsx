import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/main-page/LandingPage';
import Feature from './pages/main-page/Features';
import HowItWorks from './pages/main-page/HowItWorks';
import Security from './pages/main-page/Security';
import About from './pages/main-page/About';
// =========== Auth ============ //
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Register from './pages/Auth/Register';

// ============ RBAC ============ //
import AdminRoute from './routes/AdminRoutes';
import TeacherRoute from './routes/TeacherRoutes';
import StudentRoute from './routes/StudentRoutes';

// ============ Common ============ //
import NotFound from './pages/common/NotFound';
import Unauthorized from './pages/common/Unauthorized';


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />}/>
      <Route path='/features' element={<Feature />}/>
      <Route path='/how-it-works' element={<HowItWorks />}/>
      <Route path='/security' element={<Security />}/>
      <Route path='/about' element={<About />}/>

      {/* Auth */}
      <Route path='/login' element={<Login />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>
      <Route path='/reset-password/:token' element={<ResetPassword />}/>
      <Route path='/register' element={<Register />}/>

      {/* RBAC Routes */}
      {AdminRoute}
      {StudentRoute}
      {TeacherRoute}

      {/* Catch-all route for 404 Not Found */}
      <Route path='*' element={<NotFound />}/>

      {/* Unauthorized access route */}
      <Route path='/unauthorized' element={<Unauthorized />}/>
    </Routes>
  );
};

export default App;