import { useState } from "react";
import Auth from "./Auth";
import { User, UserContext } from "./Context";
import Visualizer from "./Visualizer";
import { Slider } from "@nextui-org/react";

function App() {
  const [user, setUser] = useState<User>();

  return (
    <>
      <UserContext.Provider value={user}>
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="my-5 text-center text-4xl">re:present</h1>
          {user && <Visualizer />}
          <Auth onSignin={(user) => setUser(user)} />
          <div className="flex w-full flex-row items-center gap-4">
            <Slider label="Position X" color="secondary" fillOffset={50} defaultValue={50} className="w-full" />
            <div className="flex h-[400px] max-w-md flex-row gap-6">
              <Slider label="Position Y" fillOffset={50} defaultValue={45} orientation="vertical" />
            </div>
          </div>
        </div>
      </UserContext.Provider>
    </>
  );
}

export default App;
