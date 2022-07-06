import React, { useEffect, useCallback, useState } from "react";
import { TheContent, TheSidebar, TheFooter, TheHeader } from "./index";
import { ReactTableDefaults } from "react-table";
import { fetchAuthUser } from "src/redux/actions/UsersAction";
import { useDispatch } from "react-redux";
import * as actionTypes from "../redux/type";
import { ToastContainer } from "react-toastify";

const TheLayout = () => {
  const dispatch = useDispatch();
  const [perms, setPermissions] = useState([]);

  const AuthUser = useCallback(() => {
    fetchAuthUser().then((data) => {
      if (data.permissions.length > 0) {
        setPermissions(perms);
      }
      dispatch({ type: actionTypes.fetchAuthUser, payload: data });
    });
  }, [dispatch, perms]);

  useEffect(() => {
    Object.assign(ReactTableDefaults, {
      pageSizeOptions: [12, 18, 30, 40, 50],
      defaultPageSize: 12,
      noDataText: "No records found.",
      loadingText: (
        <div className="animated fadeIn text-center">
          <div className="sk-spinner sk-spinner-pulse" />
        </div>
      ),
    });
    //
    AuthUser();
  }, [AuthUser]);

  // const authUser = useSelector((state) => state.user.auth);

  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
      {/* toast notification */}
      <ToastContainer pauseOnHover={false} autoClose={3000} />
    </div>
  );
};

export default TheLayout;
