import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthUser } from "src/redux/actions/UsersAction.js";
import * as actionTypes from "../../redux/type";

const AdminDashboard = lazy(() => import("./AdminDashboard.js"));
const UserDashboard = lazy(() => import("./UserDashboard.js"));

const Dashboard = () => {
  const authUser = useSelector((state) => state.user.auth);
  const dispatch = useDispatch();
  const [userFetched, setFetchUser] = useState(false);

  useEffect(() => {
    //fetch auth user
    fetchAuthUser().then((res) => {
      setFetchUser(true);
      dispatch({ type: actionTypes.fetchAuthUser, payload: res });
    });
  }, [dispatch]);
  return (
    <>
      {!userFetched ? (
        ""
      ) : !authUser.isAdmin ? (
        <UserDashboard />
      ) : (
        <AdminDashboard />
      )}
    </>
  );
};

export default Dashboard;
