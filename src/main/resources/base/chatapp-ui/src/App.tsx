import { Routes } from "react-router-dom";
import renderRoutes from "./utils/router/renderer";
import routes from "./utils//router/index";


const App = () => {
  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default App;