import { useState } from "react";
import "./App.css";
import Auth from "./Auth";
import { User, UserContext } from "./Context";
import Visualizer from "./Visualizer";

function App() {
 const [user, setUser] = useState<User>();

  return (
    <>
      <UserContext.Provider value={user}>
        <Visualizer />
        <Auth onSignin={user => setUser(user)}/>
      </UserContext.Provider>
    </>
  );
}

export default App;
