import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offer from "./pages/Offer";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SingIn";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/Category";
import CreateListing from "./pages/CreatingListing"
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (<>
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/category/:categoryName" element={<Category />}></Route>
        <Route path="/offer" element={<Offer />} />
        <Route path="/profile" element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-listing" element={<PrivateRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
      <Navbar />
    </BrowserRouter>
    <ToastContainer />
  </>
  );
}

export default App;
