import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Payment from "./pages/Payment.jsx"; // Import Payment component
import { useSupabaseAuth } from './integrations/supabase/auth.jsx';
import Login from "./pages/Login.jsx"; // Import Login component


function App() {
  const { session, logout } = useSupabaseAuth();

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Index />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/booking" element={<BookingForm />} />
          <Route exact path="/confirmation" element={<Confirmation />} />
          <Route exact path="/payment" element={<Payment />} /> {/* Add Payment route */}
          
        <Route exact path="/login" element={<Login />} /> {/* Add Login route */}
        </Routes>
        {session && <button onClick={logout}>Logout</button>}
      </Router>
    </>
  );
}

export default App;