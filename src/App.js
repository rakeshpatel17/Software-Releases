import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import ProductPage from "./pages/Productpage";
import ReleasePatches from "./pages/ReleasePatches";
import 'bootstrap-icons/font/bootstrap-icons.css';
import  Form  from "./components/Form/Form";


// PrivateRoute component: checks if authenticated
function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes({ isLoggedIn, handleLoginSuccess, handleLogout }) {
  const navigate = useNavigate();

  // Wrap the passed handlers to also trigger navigation
  const onLoginSuccess = () => {
    handleLoginSuccess();
    navigate('/dashboard'); // redirect after login
  };

  const onLogout = () => {
    handleLogout();
    navigate('/login'); // redirect on logout
  };

  return (
    <>
      <Routes>
        {/* Public Route - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={onLoginSuccess} />}
        />
        <Route
          path="/form"
          element={<Form />}
        />

      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute isAuthenticated={isLoggedIn}>
            <Dashboard onLogout={onLogout} />
          </PrivateRoute>
        }
      />

      {/* For releases */}
      <Route 
        path="/releases/:id"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <ReleasePatches onLogout={onLogout}/>
            </PrivateRoute>
        }
      />

        <Route
          path="/products/:productName"  // change productname to productName
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <ProductPage onLogout={onLogout}/>
            </PrivateRoute>
          }
        />

        {/* For patches */}
      {/* <Route 
        path="/patches/:id"
          element={
            <PrivateRoute isAuthenticated={isLoggedIn}>
              <PatchPage onLogout={onLogout}/>
            </PrivateRoute>
        }
      /> */}

        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />


      </Routes>
    </>
  );
}

function App() {
  // Initialize state from local storage
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true"); // Saving login status in local storage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // Removing login status from local storage
  };

  return (
    <BrowserRouter>
      <AppRoutes
        isLoggedIn={isLoggedIn}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

export default App;
