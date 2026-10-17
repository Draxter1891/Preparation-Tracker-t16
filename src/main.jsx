import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import "react-circular-progressbar/dist/styles.css";
import "./index.css";
import { PracticeProvider } from "./context/PracticeContext.jsx";
import router from "./router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PracticeProvider>
    <RouterProvider router={router} />
  </PracticeProvider>,
);
