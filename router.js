import React, { lazy, Suspense } from "react";
import {
  Route,
  Redirect,
  HashRouter as Router,
  Switch,
} from "react-router-dom";
import { useSelector } from "react-redux";
import ErrorBoundary from "./ErrorBoundary";
import { PUBLIC_ROUTE } from "./route.constants";
import Loader from "@components/utility/loader";

const Dashboard = lazy(() => import("./containers/Dashboard"));

const publicRoutes = [
  {
    path: PUBLIC_ROUTE.LANDING,
    exact: true,
    component: lazy(() => import("@containers/Auth/SignIn/SignIn")),
  },
  {
    path: PUBLIC_ROUTE.SIGN_IN,
    component: lazy(() => import("@containers/Auth/SignIn/SignIn")),
  },
  {
    path: "/cisreports",
    component: lazy(() => import("./containers/Auth/CIS Report/Cis")),
  },
];

function PrivateRoute({ children, ...rest }) {
  const isLoggedIn = useSelector((state) => state.Auth.currentUser);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default function Routes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Router>
          <Switch>
            {publicRoutes.map((route, index) => (
              <Route key={index} path={route.path} exact={route.exact}>
                <route.component />
              </Route>
            ))}
            <PrivateRoute path="/dashboard">
              <Dashboard />
            </PrivateRoute>
          </Switch>
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
}
