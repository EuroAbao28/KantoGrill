import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/shared/Layout";
import Login from "./pages/Login";
import Sales from "./pages/Sales";
import Users from "./pages/Users";
import Appetizer from "./pages/home/Appetizer";
import Soup from "./pages/home/Soup";
import MainCource from "./pages/home/MainCource";
import Dessert from "./pages/home/Dessert";
import Drinks from "./pages/home/Drinks";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import { Toaster } from "react-hot-toast";
import Logs from "./pages/Logs";
import { UserProvider } from "./context/UserContextProvider";
import { OrderProvider } from "./context/OrderContextProvider";

function App() {
  return (
    <>
      <UserProvider>
        <OrderProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="home" />} />
                <Route path="home" element={<Home />}>
                  <Route index element={<Navigate to="appetizer" />} />
                  <Route path="appetizer" element={<Appetizer />} />
                  <Route path="soup" element={<Soup />} />
                  <Route path="main_course" element={<MainCource />} />
                  <Route path="main_course" element={<MainCource />} />
                  <Route path="dessert" element={<Dessert />} />
                  <Route path="drinks" element={<Drinks />} />
                </Route>
                <Route path="sales" element={<Sales />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="users" element={<Users />} />
                <Route path="logs" element={<Logs />} />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </OrderProvider>
      </UserProvider>
    </>
  );
}

export default App;
