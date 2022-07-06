import React, { useState, useEffect, useCallback } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInvalidFeedback,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import ReactTable from "react-table";
import {
  createUser,
  fetchUsers,
  updateUser,
  deleteUser,
} from "src/redux/actions/UsersAction";
import { useDispatch, useSelector } from "react-redux";
import * as actionTypes from "src/redux/type";
import CIcon from "@coreui/icons-react";
import loaderSharp from "src/assets/loader/sharp-sm.svg";
import { toast } from "react-toastify";

const Users = () => {
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);
  const [previousRow, setPreviousRow] = useState(null);
  const users = useSelector((state) => state.user.users);
  const creatingUser = useSelector((state) => state.user.creatingUser);
  const updatingUser = useSelector((state) => state.user.updatingUser);
  const userErrors = useSelector((state) => state.user.userErrors);
  const [modal, setModal] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    confPassword: "",
    roleIds: [],
  });
  const [selAllUsers, setSelAllUsers] = useState(false);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState({ search: "" });
  const [searchUserResults, setSearchUserResults] = useState([]);

  const fetchedData = useCallback(() => {
    fetchUsers().then((data) => {
      if (data.length) {
        dispatch({ type: actionTypes.fetchUsers, payload: data });
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const f = () => fetchedData();
    return f();
  }, [fetchedData]);

  const handleAddUser = () => {
    dispatch({ type: actionTypes.clearUserErrors, payload: true });
    setModal(!modal);
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleBlurUser = (e) => {
    dispatch({ type: actionTypes.clearUserErrors, payload: true });
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    dispatch({ type: actionTypes.clearUserErrors, payload: true });
    if (!userData.id) {
      dispatch({ type: actionTypes.creatingUser, payload: true });
      createUser(userData)
        .then((data) => {
          if (data) {
            dispatch({ type: actionTypes.createUser, payload: data });
            resetUserData();
            setModal(false);
            toast(
              <div>
                <span>
                  <CIcon name="cil-check" /> User created successfully.
                </span>
              </div>,
              {
                toastId: "i30421",
                className: "toastify-block -w",
                closeOnClick: true,
              }
            );
          }
        })
        .catch((err) => {
          if (err.response) {
            dispatch({ type: actionTypes.userErrors, payload: err.response });
          }
        })
        .finally(() => {
          dispatch({ type: actionTypes.creatingUser, payload: false });
        });
    } else {
      dispatch({ type: actionTypes.updatingUser, payload: true });
      updateUser(userData)
        .then((data) => {
          if (data) {
            dispatch({ type: actionTypes.updateUser, payload: data });
            resetUserData();
            setModal(false);
            toast(
              <div>
                <span>
                  <CIcon name="cil-check" /> User updated successfully.
                </span>
              </div>,
              {
                toastId: "i30421",
                className: "toastify-block -w",
                closeOnClick: true,
              }
            );
          }
        })
        .catch((err) => {
          if (err.response) {
            dispatch({ type: actionTypes.userErrors, payload: err.response });
          }
        })
        .finally(() => {
          dispatch({ type: actionTypes.updatingUser, payload: false });
        });
    }
  };

  const handleDeleteUser = (e) => {
    e.preventDefault();
    if (selectedRows.length) {
      let Ids = [];
      for (let i = 0; i < selectedRows.length; i++) {
        Ids.push(selectedRows[i].id);
      }

      deleteUser(JSON.stringify(Ids)).then((data) => {
        if (data.length > 0) {
          dispatch({ type: actionTypes.destroyUser, payload: data });
          resetUserData();
          toast.error(
            <div>
              <CIcon name="cil-trash" />{" "}
              <span>
                {data.length} Item(s) deleted!, Click to <b>UNDO</b>
              </span>
            </div>,
            {
              pauseOnHover: true,
              toastId: "data.id",
              className: "toastify-block",
              closeOnClick: true,
              autoClose: 5000,
            }
          );
        }
      });
    }
  };

  const resetUserData = () => {
    setUserData({
      id: "",
      username: "",
      email: "",
      password: "",
      confPassword: "",
    });
    setSelectedRows([]);
    dispatch({ type: actionTypes.clearUserErrors, payload: true });
  };

  const closeModal = () => {
    setModal(false);
    resetUserData();
  };

  const handleCheckSelUser = (data) => {
    let selectAll = !selAllUsers;
    setSelAllUsers(selectAll);
    let c = [];
    data.forEach((e) => {
      c.push(selectAll);
    });
    setCheckedUsers(c);

    if (selectAll) {
      let p = [];
      for (let i = 0; i < data.length; i++) {
        p.push(data[i]._original);
      }
      setSelectedRows(p);
    } else {
      setSelectedRows([]);
    }
  };

  const handleUserCheck = (i, data) => {
    let c = checkedUsers;
    c[i] = !checkedUsers[i];
    if (c[i] === false) {
      const s = selectedRows.filter((e) => e.id !== data.id);
      setSelectedRows(s);
      setSelAllUsers(false);
    } else {
      setSelectedRows([...selectedRows, data]);
    }
    setCheckedUsers(c);
  };

  useEffect(() => {
    const results = users.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchUser.search.toLowerCase()) ||
        value.email.toLowerCase().includes(searchUser.search.toLowerCase())
      );
    });
    setSearchUserResults(results);
  }, [users, searchUser, setSearchUserResults]);

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    if (value.length) {
      setSearchUser({ ...searchUser, search: value });
    } else {
      setSearchUser({ ...searchUser, search: "" });
      setSearchUserResults([]);
    }
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    if (selectedRows.length) {
      let data = selectedRows[0];

      setUserData({
        id: data.id,
        username: data.name ? data.name : "",
        email: data.email ? data.email : "",
        password: data.password ? data.password : "",
        confPassword: data.confPassword ? data.confPassword : "",
        description: data.description ? data.description : "",
      });

      setModal(true);
    }
  };

  const columns = [
    {
      Header: (state) => (
        <span>
          <input
            type="checkbox"
            id="sel-all"
            name="selAll"
            onChange={() => handleCheckSelUser(state.data)}
            checked={selAllUsers ? true : false}
          />
        </span>
      ),
      accessor: "checkedi",
      sortable: false,
      minWidth: 20,
      Cell: (row) => (
        <div className="p-t-2">
          <input
            type="checkbox"
            id={row.original.id}
            name="selRows"
            checked={selectedRows.some((e) => e.id === row.original.id) && true}
            onChange={() => handleUserCheck(row.index, row.original)}
          />
        </div>
      ),
    },
    {
      Header: "Index",
      accessor: "id",
      minWidth: 25,
    },
    {
      Header: "Name",
      accessor: "name",
      minWidth: 100,
      Cell: (props) => (
        //  eslint-disable-next-line
        <a
          href="#"
          className="patient-select"
          onClick={(e) => handleEditUser(e, props.original)}
        >
          <span>{props.original.name}</span>
        </a>
      ),
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
    },
  ];

  return (
    <>
      <CRow>
        <CCol md={12}>
          <div className="dash-title">
            <h5>Users</h5>
            <small className="text-muted">
              Available user records on the database.
            </small>
          </div>
          <CCard className="card-box">
            <CCardHeader>
              {selectedRows && selectedRows.length > 0 ? (
                <div>
                  <CButton
                    className="itm-btn"
                    color="danger"
                    variant="ghost"
                    onClick={(e) => handleDeleteUser(e)}
                  >
                    <CIcon name="cil-trash" /> <span>Delete</span>
                  </CButton>
                  {selectedRows.length === 1 ? (
                    <CButton
                      className="itm-btn"
                      color="info"
                      variant="ghost"
                      onClick={(e) => handleEditUser(e)}
                    >
                      <CIcon name="cil-pencil" /> <span>Edit</span>
                    </CButton>
                  ) : null}
                </div>
              ) : (
                <div>
                  <CButton
                    className="itm-btn"
                    color="info"
                    variant="ghost"
                    onClick={(e) => handleAddUser(e)}
                  >
                    <CIcon name="cil-user-follow" /> <span>Create</span>
                  </CButton>
                  <CButton className="itm-btn" color="info" variant="ghost">
                    <CIcon name="cil-file" /> <span>Export</span>
                  </CButton>
                </div>
              )}
              <div className="d-flex">
                <CInput
                  size="sm"
                  type="search"
                  placeholder="Search..."
                  style={{ width: "290px" }}
                  value={searchUser.search}
                  onChange={(e) => handleChangeSearch(e)}
                />
              </div>
            </CCardHeader>

            <CCardBody>
              <div>
                <ReactTable
                  data={
                    searchUserResults.length > 0 ? searchUserResults : users
                  }
                  columns={columns}
                  className="-highlight -striped text-left"
                  getTrProps={(state, rowInfo) => {
                    if (rowInfo && rowInfo.row) {
                      return {
                        onClick: (e) => {
                          let selectedRows = [];
                          if (e.ctrlKey && previousRow) {
                            if (previousRow.index < rowInfo.index) {
                              for (
                                let i = previousRow.index;
                                i <= rowInfo.index;
                                i++
                              ) {
                                selectedRows.push(
                                  state.sortedData[i]._original
                                );
                              }
                            } else {
                              for (
                                let i = rowInfo.index;
                                i <= previousRow.index;
                                i++
                              ) {
                                selectedRows.push(
                                  state.sortedData[i]._original
                                );
                              }
                            }
                            setSelectedRows(selectedRows);
                          } else {
                            rowInfo._index = rowInfo.index;
                            selectedRows.push(rowInfo.original);
                            setPreviousRow(rowInfo);
                            setSelectedRows(selectedRows);
                          }
                        },

                        style: {
                          background:
                            selectedRows.some(
                              (e) => e.id === rowInfo.original.id
                            ) && "#42a5f533",
                        },
                      };
                    } else {
                      return {};
                    }
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* modals */}
      <CModal
        show={modal}
        onClose={setModal}
        backdrop
        closeOnBackdrop={false}
        fade={false}
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon name="cil-user-follow" /> <span>User Editor</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="form_div">
              <CCol md="12">
                <CFormGroup>
                  <CLabel htmlFor="username" className="mb-0">
                    Name
                  </CLabel>
                  <CInput
                    id="username"
                    className="mt-2"
                    name="username"
                    value={userData.username}
                    onChange={(e) => handleChangeUser(e)}
                    onBlur={(e) => handleBlurUser(e)}
                    invalid={
                      userErrors.username && userErrors.username.length > 0
                        ? true
                        : false
                    }
                  />
                  <CInvalidFeedback className="rs-feedback animated fadeIn">
                    {userErrors.username}
                  </CInvalidFeedback>
                </CFormGroup>
              </CCol>
            </CRow>
            <CRow className="form_div">
              <CCol md="12">
                <CFormGroup>
                  <CLabel htmlFor="email" className="mb-0">
                    Email
                  </CLabel>
                  <CInput
                    id="email"
                    type="email"
                    className=" mt-2"
                    name="email"
                    value={userData.email}
                    onChange={(e) => handleChangeUser(e)}
                    onBlur={(e) => handleBlurUser(e)}
                    invalid={
                      userErrors.email && userErrors.email.length > 0
                        ? true
                        : false
                    }
                  />
                  <CInvalidFeedback className="rs-feedback animated fadeIn">
                    {userErrors.email}
                  </CInvalidFeedback>
                </CFormGroup>
              </CCol>
            </CRow>
            {userData.id === "" ? (
              <>
                <CRow className="form_div">
                  <CCol md="12">
                    <CFormGroup>
                      <CLabel htmlFor="password" className="mb-0">
                        Password
                      </CLabel>
                      <CInput
                        id="password"
                        type="password"
                        className=" mt-2"
                        name="password"
                        value={userData.password}
                        onChange={(e) => handleChangeUser(e)}
                        onBlur={(e) => handleBlurUser(e)}
                        invalid={
                          userErrors.password && userErrors.password.length > 0
                            ? true
                            : false
                        }
                      />
                      <CInvalidFeedback className="rs-feedback animated fadeIn">
                        {userErrors.password}
                      </CInvalidFeedback>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow className="form_div">
                  <CCol md="12">
                    <CFormGroup>
                      <CLabel htmlFor="confPassword" className="mb-0">
                        Confirm Password
                      </CLabel>
                      <CInput
                        id="confPassword"
                        className=" mt-2"
                        type="password"
                        name="confPassword"
                        value={userData.confPassword}
                        onChange={(e) => handleChangeUser(e)}
                        onBlur={(e) => handleBlurUser(e)}
                        invalid={
                          userErrors.confPassword &&
                          userErrors.confPassword.length > 0
                            ? true
                            : false
                        }
                      />
                      <CInvalidFeedback className="rs-feedback animated fadeIn">
                        {userErrors.confPassword}
                      </CInvalidFeedback>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </>
            ) : null}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => closeModal()}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            type="button"
            disabled={creatingUser || updatingUser ? true : false}
            onClick={(e) => handleSubmitUser(e)}
          >
            {creatingUser || updatingUser ? (
              <span>
                Processing <img src={loaderSharp} alt="Loading..." />
              </span>
            ) : (
              <span>Submit</span>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Users;
