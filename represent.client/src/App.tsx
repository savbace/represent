import { Slider } from "@nextui-org/react";
import Auth from "./Auth";
import { useUser } from "./services/hooks";
import Visualizer from "./Visualizer";

function App() {
  const { user } = useUser();

  return (
    <>
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="my-5 text-center text-4xl">re:present</h1>
        {user && <Visualizer />}
        <Auth />
        <div className="flex w-full flex-row items-center gap-4">
          <Slider label="Position X" color="secondary" fillOffset={50} defaultValue={50} className="w-full" />
          <div className="flex h-[400px] max-w-md flex-row gap-6">
            <Slider label="Position Y" fillOffset={50} defaultValue={45} orientation="vertical" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
