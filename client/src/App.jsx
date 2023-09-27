import "./assets/styles/main.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/public/homePage/Home";
import ListProduct from "./pages/public/listProduct/ListProduct";
import Cart from "./pages/private/cart/Cart";
import About from "./pages/public/about/About";
import Contact from "./pages/public/contact/Contact";
import LogIn from "./pages/public/logIn/LogIn";
import Register from "./pages/public/register/Register";
import HomeAdmin from "./pages/private/homeAdmin/HomeAdmin";
import PrivateRouter from "./pages/private/PrivateRouter";
import ManagerProduct from "./pages/private/manageProducts/ManagerProduct";
import ManagerUser from "./pages/private/manageUsers/ManagerUser";
import ManageCategories from "./pages/private/manageCategories/ManageCategories";

import Description from "./components/user/description/Description";
import HomeIndex from "./pages/public/homePage/HomeIndex";
import Profile from "./pages/private/profile/Profile";
import ChangePasswordForm from "./pages/private/resetPassword/ChangePasswordForm";
import ManageOrders from "./pages/private/manageOrders/ManageOrders";
import { useState } from "react";
import MyOrder from "./pages/public/myOrder/MyOrder";

function App() {
  const [loadCountCart, setLoadCountCart] = useState(false);

  const setLoadHeader = () => {
    setLoadCountCart(!loadCountCart);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home loadCountCart={loadCountCart} />}>
          <Route index element={<HomeIndex setLoadHeader={setLoadHeader} />} />
          <Route
            path="list-product"
            element={<ListProduct setLoadHeader={setLoadHeader} />}
          />
          <Route
            path="description/:id"
            element={<Description setLoadHeader={setLoadHeader} />}
          />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my_order" element={<MyOrder />} />
          <Route path="reset-password" element={<ChangePasswordForm />} />
          <Route path="cart" element={<Cart setLoadHeader={setLoadHeader} />} />
        </Route>

        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<PrivateRouter />}>
          <Route index element={<HomeAdmin />}></Route>
          <Route path="manager-product" element={<ManagerProduct />}></Route>
          <Route path="manager-user" element={<ManagerUser />}></Route>
          <Route
            path="manager-categories"
            element={<ManageCategories />}
          ></Route>
          <Route path="manager-order" element={<ManageOrders />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
