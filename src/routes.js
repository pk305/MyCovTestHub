import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Users = React.lazy(() => import("./views/users/Users"));
const Roles = React.lazy(() => import("./views/roles/Roles"));
const Perm = React.lazy(() => import("./views/permissions/Perms"));
const TestResults = React.lazy(() => import("./views/results/TestResults"));

const routes = [
  { path: "/", exact: true, name: "Home", slug: "can_view_home" },
  {
    path: "/dashboard",
    name: "Dashboard",
    slug: "can_view_dashboard",
    component: Dashboard,
  },
  {
    path: "/settings",
    exact: true,
    name: "Settings",
    slug: "can_view_settings",
    component: Users,
  },
  {
    path: "/settings/users",
    name: "Users",
    slug: "can_view_users",
    component: Users,
  },
  {
    path: "/settings/roles",
    name: "Roles",
    slug: "can_view_roles",
    component: Roles,
  },
  {
    path: "/settings/permissions",
    name: "Permissions",
    slug: "can_view_permissions",
    component: Perm,
  },
  {
    path: "/test_results",
    name: "Test Results",
    slug: "can_view_test_results",
    component: TestResults,
  },
];

export default routes;
