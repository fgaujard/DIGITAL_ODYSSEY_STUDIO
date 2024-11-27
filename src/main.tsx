import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  RouteObject,
} from "react-router-dom";
import App from "./App";

// Fonction pour détecter la langue du navigateur
const detectBrowserLanguage = () => {
  return navigator.language.startsWith("fr") ? "fr" : "en";
};

// Créer le routeur avec une redirection pour la langue par défaut
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={`/${detectBrowserLanguage()}`} replace />,
  },
  {
    path: "/:lang",
    element: <App />,
  },
  {
    path: "*",
    element: <Navigate to={`/${detectBrowserLanguage()}`} replace />,
  },
];

const router = createBrowserRouter(routes);

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
