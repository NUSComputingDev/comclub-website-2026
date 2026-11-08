import { useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import {
  About,
  Article,
  Events,
  Home,
  NotFound,
  Privacy,
  Resources,
} from './pages';
import { Toaster } from 'react-hot-toast';
import NavigationBar from './layout/NavigationBar';
import Footer from './layout/Footer';
import SplashScreen from './layout/SplashScreen';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <>
      <SplashScreen />
      <NavigationBar />

      {/* Main content */}
      <ScrollToTop />
      <main className='w-full'>
        <div><Toaster/></div>
        <div className='page-transition' key={location.pathname}>
          <Routes location={location}>
            <Route path='/' element={<Home />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/about' element={<About />} />
            <Route path='/events'>
              <Route path='' element={<Events />} />
              <Route path=':articleLink' element={<Article />} />
            </Route>
            <Route path='/resources' element={<Resources />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </>
  );
}

// this is needed so that the page automaticall scrolls to the top
// when the route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


export default App;
