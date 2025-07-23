import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth} from './context/AuthContext';

import { useState } from "react";
import Login from "./components/Login/Login";
import Dashboard from './pages/Dashboard/Dashboard'
import ProductPage from "./pages/ProductPage/Productpage";
import ReleasePatches from "./pages/ReleasePatches";
import 'bootstrap-icons/font/bootstrap-icons.css';
import PatchPage from "./pages/PatchPage/PatchPage";
import PatchProgressPage from "./pages/PatchProgressPage/PatchProgressPage";
import MainLayout from "./Layouts/MainLayout";
import Form from "./components/Form/Form";
import CompareImage from "./pages/ImageCompare/CompareImage"
import { RouteProvider } from "./components/RouteContext/RouteContext"; 
import { Toaster } from "react-hot-toast";

// // PrivateRoute component: checks if authenticated
// function PrivateRoute({ isAuthenticated, children }) {
//   return isAuthenticated ? children : <Navigate to="/login" />;
// }

// PrivateRoute wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user, logout } = useAuth();
  // const navigate = useNavigate();

  // // Wrap the passed handlers to also trigger navigation
  // const onLoginSuccess = () => {
  //   handleLoginSuccess();
  //   navigate('/dashboard'); // redirect after login
  // };

  // const onLogout = () => {
  //   handleLogout();
  //   navigate('/login'); // redirect on logout
  // };

  return (
    <>
      <Routes>
        {/* Public Route - redirect to dashboard if already logged in */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute >
              <MainLayout onLogout={logout} />
            </PrivateRoute>
          }
        >
          <Route
            path="/patches/:patchName/products/:productName"
            element={<PatchProgressPage />}
          />
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="addpatch" element={<Form />} />
          <Route path="releases/:id" element={<ReleasePatches />} />
          <Route path="products/:productName" element={<ProductPage />} />
          <Route path="patches/:patchName" element={<PatchPage />} />
          <Route path="progress/:id" element={<PatchProgressPage />} />
          <Route path="tools/comparison" element={<CompareImage />} />
        </Route>

        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
}

function App() {
  // Initialize state from local storage
  // const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  // const handleLoginSuccess = () => {
  //   setIsLoggedIn(true);
  //   localStorage.setItem("isLoggedIn", "true"); // Saving login status in local storage
  // };

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   localStorage.removeItem("isLoggedIn"); // Removing login status from local storage
  // };

  return (
    // <BrowserRouter>
    // <RouteProvider>
    //     <Toaster position="top-right" />
    //   <AppRoutes
    //     isLoggedIn={isLoggedIn}
    //     handleLoginSuccess={handleLoginSuccess}
    //     handleLogout={handleLogout}
    //   />
    //   </RouteProvider>
    // </BrowserRouter>
     <AuthProvider>
        <BrowserRouter>
            <RouteProvider>
              <Toaster position="top-right" />
              <AppRoutes />
            </RouteProvider>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
