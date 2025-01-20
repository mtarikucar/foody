import "react-toastify/dist/ReactToastify.css";

import {
  About,
  Admin,
  Home,
  Login,
  Menu,
  Profile,
  Services,
  Signup,
} from "./Pages";
import { Cart, Footer, Header } from "./components";
import {Route, Routes, useParams} from "react-router-dom";
import {
  calculateCartTotal,
  dispatchUsers,
  fetchFoodData,
  fetchUserCartData,
  isAdmin,
} from "./utils/functions";

import { AnimatePresence } from "framer-motion";
import Contact from "./components/Contact";
import { ToastContainer } from "react-toastify";
import { useStateValue } from "./context/StateProvider";

function App() {
  const [{ showCart,showContactForm, user, foodItems, cartItems, adminMode,menuData }, dispatch] =
    useStateValue();

  return (
    <AnimatePresence exitBeforeEnter>
      <ToastContainer />
      <div className="w-screen h-auto min-h-[100vh] flex flex-col bg-primary">
        {showCart && <Cart />}
     {/*   {showContactForm && <Contact />}*/}
        {menuData && <Header />}
        <main
          className={`${
            !(adminMode && isAdmin(user)) &&
            "mt-16 md:mt-16 px-3 md:px-8 md:py-6 py-4"
          } w-full h-auto`}
          onClick={() => {}}
        >
          {/* Routes */}
          <Routes>
            <Route path="/:id/home" element={<Home/>} />
           {/* <Route path="/login" element={<Login />} />*/}
            {/*<Route path="/register" element={<Signup />} />*/}
            {/*<Route path="/admin" element={<Admin />} />*/}
            {/*<Route path="/profile" element={<Profile />} />*/}
            <Route path="/:id/about" element={<About/>} />
            <Route path="/:id" element={<Menu/>} />
           {/* <Route path="/services" element={<Services />} />*/}
          </Routes>
          {menuData &&<Footer/>}
        </main>
      </div>
    </AnimatePresence>
  );
}

export default App;
