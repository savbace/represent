import Auth from "./Auth";
import { useUser } from "./services/hooks";
import Visualizer from "./Visualizer";

function App() {
  const { user } = useUser();

  return (
    <>
      <div className="container mx-auto flex flex-col items-center my-4">
        <h1 className="my-2 text-center text-4xl">re:present</h1>
        <Auth />
        {user && <Visualizer />}
      </div>
    </>
  );
}

export default App;
