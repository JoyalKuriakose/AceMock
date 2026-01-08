import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Header from "./components/custom/Header";
import Adminheader from "./components/custom/Adminheader";
import Footer from "./components/custom/Footer";

function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();

  if (!isSignedIn && isLoaded) {
    return <Navigate to={"/auth/sign-in"} />;
  }

  // Get user's email
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <>
      {/* Only show header if not on root path */}
      {location.pathname !== '/' &&
        (userEmail === "joyalkuriakose49@gmail.com" ? (
          <Adminheader />
        ) : (
          <Header />
        ))
      }

      <Outlet />
      <Footer />
    </>
  );
}

export default App;
