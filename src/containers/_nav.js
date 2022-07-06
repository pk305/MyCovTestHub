import React from "react";
import CIcon from "@coreui/icons-react";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    slug: "can_view_dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Test Results",
    to: "/test_results",
    slug: "can_view_test_results",
    icon: <CIcon name="cil-graph" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Settings",
    route: "/settings",
    icon: "cil-settings",
    slug: "can_view_settings",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Users",
        to: "/settings/users",
        slug: "can_view_users",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Roles",
        to: "/settings/roles",
        slug: "can_view_roles",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Permissions",
        to: "/settings/permissions",
        slug: "can_view_permissions",
      },
    ],
  },
];

export default _nav;
