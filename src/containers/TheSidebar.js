import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";

// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.system.sidebarShow);
  const user = useSelector((state) => state.user.auth);
  let defaultNav = [];
  if (user && user.permissions && user.permissions.length > 0) {
    const permissions = user.permissions;
    defaultNav = navigation.filter((e) => permissions.includes(e.slug));
  }

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none a-brand" to="/">
        <h2 className="c-sidebar-brand-full">MyCovTest Hub</h2>
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={defaultNav}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
