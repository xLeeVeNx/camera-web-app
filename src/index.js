import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {SelfieScreen} from './screens/SelfieScreen/SelfieScreen';
import {RootScreen} from './screens/RootScreen/RootScreen.jsx';
import {PassportScreen} from './screens/PassportScreen/PassportScreen.jsx';
import {PassportSelfieScreen} from './screens/PassportSelfieScreen/PassportSelfieScreen.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/*",
    element: <RootScreen />,
    children: [
      {
        path: "selfie",
        element: <SelfieScreen />,
      },
      {
        path: "passport",
        element: <PassportScreen />,
      },
      {
        path: "passport-selfie",
        element: <PassportSelfieScreen />,
      },
    ]
  }
]);

root.render(<RouterProvider router={router} />);
