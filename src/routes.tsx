import ReactDOM from "react-dom/client";
import {
  redirect,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./pages/root";
import Login from "./pages/login";
import TemplatesList from "./pages/list-templates";
import Template from "./pages/template";

const router = createBrowserRouter([
  {
    path: "/",
    loader: async () => {
      throw redirect("/flows");
    },
  },
  {
    path: "/flows",
    element: <TemplatesList />,
  },
  {
    path: "/flows/:templateId",
    element: <Template />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const RoutesWrapper = () => {
  return <RouterProvider router={router} />;
};

export default RoutesWrapper;
