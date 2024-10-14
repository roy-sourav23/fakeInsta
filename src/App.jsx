import "./App.css";
import Routing from "./routing/Routing";
import UserContext from "./context/UserContext";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData) => {
    setAuthUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setAuthUser(null);
    setIsLoggedIn(false);
  };

  const updateAuthUser = async () => {
    const userRef = doc(db, "users", authUser.uid);
    const userDocSnap = await getDoc(userRef);
    const userData = userDocSnap.data();

    setAuthUser(userData);
  };

  return (
    <>
      <UserContext.Provider
        value={{ authUser, updateAuthUser, login, logout, isLoggedIn }}
      >
        <Routing />
      </UserContext.Provider>
    </>
  );
}

export default App;
