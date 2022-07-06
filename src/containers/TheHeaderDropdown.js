import React from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router";
import { destroyToken } from "src/config/auth";
import defaultAvatar from "../assets/imgs/avatar/defAvatar.gif";
import { useSelector } from "react-redux";
import imageUrl from "../config/urls/imageUrl";
import { logoutUser } from "src/redux/actions/UsersAction";

const TheHeaderDropdown = () => {
  const history = useHistory();
  const authUser = useSelector((state) => state.user.auth);

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser(authUser).then(() => {
      destroyToken();
      history.push("/login");
    });
  };

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          {authUser && authUser.avatar !== null ? (
            <CImg
              src={
                imageUrl + authUser.avatar === typeof "undefined"
                  ? imageUrl + authUser.avatar
                  : defaultAvatar
              }
              className="c-avatar-img"
              alt=""
            />
          ) : (
            <CImg src={defaultAvatar} className="c-avatar-img" alt="" />
          )}
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={() => history.push("/homepage")}>
          <CIcon name="cil-home" className="mfe-2" />
          Homepage
        </CDropdownItem>
        <CDropdownItem
          header
          tag="div"
          color="dark"
          className="text-center text-white"
        >
          <strong>Account</strong>
        </CDropdownItem>
        {authUser && authUser.email ? (
          <CDropdownItem onClick={(e) => e.preventDefault()}>
            <CIcon name="cil-user" className="mfe-2" />
            {authUser.email}
          </CDropdownItem>
        ) : (
          ""
        )}{" "}
        <CDropdownItem>
          <CIcon
            name="cil-settings"
            className="mfe-2"
            onClick={() => history.push("/settings")}
          />
          Settings
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={(e) => handleLogout(e)}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
