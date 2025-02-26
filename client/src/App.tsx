import { Route, Routes, useNavigate, Navigate, useLocation } from 'react-router-dom';
import DocumentViewer from './pages/DocumentViewer';
import { SignupPage } from './pages/SignUp';
import { SigninPage } from './pages/SignIn';
import { useEffect, useState, ReactNode } from 'react';
import { BACKEND_URL } from './config';
import { useRecoilState } from 'recoil';
import { authAtom } from './store/auth';
import { FileLoader } from './components/ui/Loader';
import MyDocs from './pages/MyDocs';
import Verification from './components/Verification';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/About';



interface ProtectedRouteProps {
  children: ReactNode;
}

// Protected route component
const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const [auth] = useRecoilState(authAtom);
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    console.log(location)
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

function App(): JSX.Element {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/user/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setAuth(userData);
          
          // If we're on the signin page with a valid token, redirect to mydocs
          if (location.pathname === '/signin') {
            navigate('/mydocs');
          }
        } else {
          // Token might be invalid or expired
          localStorage.removeItem('token');
          setAuth({ user: null, isAuthenticated: false });
          
          // Only navigate to signin if we're not already there
          if (location.pathname !== '/signin' && location.pathname !== '/signup') {
            navigate('/signin');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setAuth({ user: null, isAuthenticated: false });
        
        // Only navigate to signin if we're not already there
        if (location.pathname !== '/signin' && location.pathname !== '/signup') {
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [setAuth, navigate, location.pathname]);
  
  if (loading) {
    return <div className='h-[100vh] flex items-center justify-center'><FileLoader /></div>;
  }
  
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/verify/:token' element={<Verification />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/signin' element={<SigninPage />} />
        
        {/* Protected routes */}
        <Route path='/mydocs' element={
          <ProtectedRoute>
            <MyDocs />
          </ProtectedRoute>
        } />
        <Route path='/document/:id' element={
          <ProtectedRoute>
            <DocumentViewer />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;