import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "react-table/react-table.css";
import "react-toastify/dist/ReactToastify.css";
import "./scss/style.scss";
import "./index.css";

import { isLoggedIn } from "./config/auth";
import { withCookies } from "react-cookie";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const PrivateRoutes = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isLoggedIn()) {
        return <Component {...props} />;
      } else {
        return (
          <Redirect
            to={{ pathname: "/homepage", state: { from: props.location } }}
          />
        );
      }
    }}
  />
);

export const PublicRoutes = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isLoggedIn()) {
        return (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        );
      }
      return <Component {...props} />;
    }}
  />
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Homepage = React.lazy(() => import("./views/pages/homepage/Homepage"));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route
              exact
              path="/homepage"
              name="Homepage"
              render={(props) => <Homepage {...props} />}
            />
            <PublicRoutes
              exact
              path="/login"
              name="Login Page"
              component={(props) => <Login {...props} />}
            />
            <PublicRoutes
              exact
              path="/register"
              name="Register Page"
              component={(props) => <Register {...props} />}
            />
            {/* // */}
            <PrivateRoutes
              path="/"
              name="Home"
              component={(props) => <TheLayout {...props} />}
            />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default withCookies(App);
