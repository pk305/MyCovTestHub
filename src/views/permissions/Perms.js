import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CInput,
  CInvalidFeedback,
  CRow,
  CSelect,
} from "@coreui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table";
import {
  createPermission,
  fetchPermissions,
} from "src/redux/actions/PermsAction";
import * as actionTypes from "src/redux/type";
import loaderSharp from "src/assets/loader/sharp.svg";
import { fetchRoles, findRole } from "src/redux/actions/RolesAction";
import {
  addRolePermission,
  deleteRolePermission,
} from "src/redux/actions/PermsAction";
import { toast } from "react-toastify";

const Perms = () => {
  const dispatch = useDispatch();
  const [permData, setPermData] = useState({
    title: "",
    roleId: "",
  });
  const creatingPermission = useSelector(
    (state) => state.perm.creatingPermission
  );
  const [selectedRowsPerms, setSelectedRowsPerms] = useState([]);
  const [selectedRowsRoles, setSelectedRowsRoles] = useState([]);
  const [previousRow, setPreviousRow] = useState(null);
  const perms = useSelector((state) => state.perm.perms);
  const permErrors = useSelector((state) => state.perm.permErrors);
  const [searchPerm, setSearchPerm] = useState({ search: "" });
  const [searchRole, setSearchRole] = useState({ search: "" });
  const [searchRoleResults, setSearchRoleResults] = useState([]);
  const [searchPermResults, setSearchPermResults] = useState([]);
  const roles = useSelector((state) => state.role.roles);
  const rolePerms = useSelector((state) => state.perm.rolePerms);
  const filterdPerms = useSelector((state) => state.perm.filterdPerms);
  const [selAllPerms, setSelAllPerms] = useState(false);
  const [checkedPerms, setCheckedPerms] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState([]);
  const [selAllRoles, setSelAllRoles] = useState(false);

  const handleChangePerm = (e) => {
    const { name, value } = e.target;
    setPermData({
      ...permData,
      [name]: value,
    });
  };
  const addingRolePerm = useSelector((state) => state.perm.addingRolePerm);
  const removingRolePerm = useSelector((state) => state.perm.removingRolePerm);

  const handleBlurPerm = (e) => {
    dispatch({ type: actionTypes.clearPermErrors, payload: true });
  };

  const handleSubmitPerm = (e) => {
    e.preventDefault();
    dispatch({ type: actionTypes.clearPermErrors, payload: true });
    dispatch({ type: actionTypes.creatingPermission, payload: true });
    createPermission(permData)
      .then((data) => {
        dispatch({ type: actionTypes.createPerm, payload: data });
        dispatch({ type: actionTypes.creatingPermission, payload: false });
        resetPermData();
      })
      .catch((err) => {
        if (err.response) {
          dispatch({
            type: actionTypes.permErrors,
            payload: err.response,
          });
        }
        dispatch({ type: actionTypes.creatingPermission, payload: false });
      });
  };

  const resetPermData = () => {
    setPermData({
      title: "",
      roleId: "",
    });
  };

  const handleChangeSearchPerm = (e) => {
    const value = e.target.value;
    setSearchPerm({ ...searchPerm, search: value });
  };

  const handleChangeSearchRole = (e) => {
    const value = e.target.value;
    setSearchRole({ ...searchRole, search: value });
  };

  const handleSelRole = (e) => {
    const { value } = e.target;
    if (value === "") return;
    setPermData({ ...permData, roleId: value });
    findRole(value).then((data) => {
      dispatch({
        type: actionTypes.findRolePerms,
        payload: data.permissions,
      });
    });
  };

  const handleCheckSelPerm = (data) => {
    let selectAll = !selAllPerms;
    setSelAllPerms(selectAll);
    let c = [];
    data.forEach((e) => {
      c.push(selectAll);
    });
    setCheckedPerms(c);

    if (selectAll) {
      let p = [];
      for (let i = 0; i < data.length; i++) {
        p.push(data[i]._original);
      }
      setSelectedRowsPerms(p);
    } else {
      setSelectedRowsPerms([]);
    }
  };

  const handlePermCheckboxChange = (i, data) => {
    let c = checkedPerms;
    c[i] = !checkedPerms[i];
    if (c[i] === false) {
      const s = selectedRowsPerms.filter((e) => e.id !== data.id);
      setSelectedRowsPerms(s);
      setSelAllPerms(false);
    } else {
      setSelectedRowsPerms([...selectedRowsPerms, data]);
    }
    setCheckedPerms(c);
  };

  const handleCheckSelRole = (data) => {
    let selectAll = !selAllRoles;
    setSelAllRoles(selectAll);
    let c = [];
    data.forEach((e) => {
      c.push(selectAll);
    });
    setCheckedRoles(c);

    if (selectAll) {
      let p = [];
      for (let i = 0; i < data.length; i++) {
        p.push(data[i]._original);
      }
      setSelectedRowsRoles(p);
    } else {
      setSelectedRowsRoles([]);
    }
  };

  const handleRoleCheckboxChange = (i, data) => {
    let c = checkedRoles;
    c[i] = !checkedRoles[i];
    if (c[i] === false) {
      const s = selectedRowsRoles.filter((e) => e.id !== data.id);
      setSelectedRowsRoles(s);
      setSelAllPerms(false);
    } else {
      setSelectedRowsRoles([...selectedRowsRoles, data]);
    }
    setCheckedRoles(c);
  };

  const addPermissions = () => {
    if (selectedRowsPerms.length) {
      const data = {
        roleId: parseInt(permData.roleId),
        permissions: selectedRowsPerms,
      };

      dispatch({
        type: actionTypes.addingRolePerm,
        payload: true,
      });
      addRolePermission(data)
        .then((data) => {
          dispatch({
            type: actionTypes.findRolePerms,
            payload: data.permissions,
          });
          setSelectedRowsPerms([]);
        })
        .finally(() => {
          dispatch({
            type: actionTypes.addingRolePerm,
            payload: false,
          });
        });
    } else {
      toast(<div>First select a role and/or permission!</div>, {
        className: "toastify-block",
        closeOnClick: true,
        autoClose: 5000,
        toastId: "selectRole",
        type: "error",
      });
    }
  };

  const removePermissions = () => {
    if (selectedRowsRoles.length) {
      const data = {
        roleId: parseInt(permData.roleId),
        permissions: selectedRowsRoles,
      };

      dispatch({
        type: actionTypes.removingRolePerm,
        payload: true,
      });
      deleteRolePermission(data)
        .then((data) => {
          dispatch({
            type: actionTypes.findPermRole,
            payload: data.permissions,
          });
          setSelectedRowsRoles([]);
        })
        .finally(() => {
          dispatch({
            type: actionTypes.removingRolePerm,
            payload: false,
          });
        });
    } else {
      toast(<div>First select a role and/or permission!</div>, {
        className: "toastify-block",
        closeOnClick: true,
        autoClose: 5000,
        toastId: "selectRole",
        type: "error",
      });
    }
  };

  const permRoleCol = [
    {
      Header: (state) => (
        <span>
          <input
            type="checkbox"
            name="checkRoles"
            onChange={() => handleCheckSelRole(state.data)}
            checked={selAllRoles ? true : false}
          />
        </span>
      ),
      accessor: "checkR",
      sortable: false,
      filterable: false,
      minWidth: 20,
      Cell: (row) => (
        <div className="p-t-2">
          <input
            type="checkbox"
            id={row.original.id}
            checked={
              selectedRowsRoles.some((e) => e.id === row.original.id) && true
            }
            onChange={() => handleRoleCheckboxChange(row.index, row.original)}
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
      accessor: "title",
      minWidth: 160,
    },
  ];

  const permCol = [
    {
      Header: (state) => (
        <span>
          <input
            type="checkbox"
            name="checkPerms"
            onChange={() => handleCheckSelPerm(state.data)}
            checked={selAllPerms ? true : false}
          />
        </span>
      ),
      accessor: "checkP",
      sortable: false,
      filterable: false,
      minWidth: 20,
      Cell: (row) => (
        <div className="p-t-2">
          <input
            type="checkbox"
            id={row.original.id}
            checked={
              selectedRowsPerms.some((e) => e.id === row.original.id) && true
            }
            onChange={() => handlePermCheckboxChange(row.index, row.original)}
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
      accessor: "title",
      minWidth: 160,
    },
  ];

  const fetchedData = useCallback(() => {
    dispatch({ type: actionTypes.fetchingPerms, payload: true });
    fetchPermissions().then((data) => {
      dispatch({ type: actionTypes.fetchingPerms, payload: false });
      dispatch({ type: actionTypes.fetchPerms, payload: data });
    });

    dispatch({ type: actionTypes.fetchingRoles, payload: true });
    fetchRoles().then((data) => {
      if (data.length) {
        dispatch({ type: actionTypes.fetchRoles, payload: data });
      }
      dispatch({ type: actionTypes.fetchingRoles, payload: false });
    });
  }, [dispatch]);

  useEffect(() => {
    const f = () => fetchedData();
    return f();

    //   if (searchPerm.search) {
    //     const results = filterdPerms.filter((value) => {
    //       return value.title
    //         .toLowerCase()
    //         .includes(searchPerm.search.toLowerCase());
    //     });

    //     setSearchPermResults(results);
    //   }

    //   if (searchRole.search) {
    //     const results = rolePerms.filter((value) => {
    //       return value.title
    //         .toLowerCase()
    //         .includes(searchRole.search.toLowerCase());
    //     });

    //     setSearchRoleResults(results);
    //   }
  }, [fetchedData]);

  return (
    <>
      <CRow>
        <CCol md={5}>
          <CRow>
            <CCol md={12}>
              <CSelect
                custom
                name="select"
                id="selRole"
                onChange={(e) => handleSelRole(e)}
              >
                <option value="">--Select A Role --</option>
                {roles && roles.length > 0 ? (
                  roles.map((r) => (
                    <option value={r.id} key={r.id}>
                      {r.title}
                    </option>
                  ))
                ) : (
                  <option disabled>No records found.</option>
                )}
              </CSelect>
            </CCol>
          </CRow>
          <hr />
          <CCard className="card-box">
            <CCardHeader style={{ padding: "0.75rem 1.25rem" }}>
              Role Permissions
            </CCardHeader>
            <CCardHeader>
              <CRow style={{ width: "100%" }}>
                <CCol md={12}>
                  <div className="d-flex">
                    <CInput
                      size="sm"
                      type="search"
                      placeholder="Search..."
                      value={searchRole.search}
                      onChange={(e) => handleChangeSearchRole(e)}
                    />
                  </div>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <div>
                <ReactTable
                  data={
                    searchRoleResults.length > 0 ? searchRoleResults : rolePerms
                  }
                  columns={permRoleCol}
                  defaultPageSize={12}
                  showPageSizeOptions={false}
                  className="-highlight -striped text-left"
                  showPagination={
                    rolePerms && rolePerms.length > 12 ? true : false
                  }
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
                            setSelectedRowsRoles(selectedRows);
                          } else {
                            rowInfo._index = rowInfo.index;
                            selectedRows.push(rowInfo.original);
                            setPreviousRow(rowInfo);
                            setSelectedRowsRoles(selectedRows);
                          }
                        },

                        style: {
                          background:
                            selectedRowsRoles.some(
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
        <CCol md={2}>
          <div className="d-flex justify-content-center mt-5">
            <CButtonGroup vertical>
              <CButton
                type="button"
                color="primary"
                onClick={() => addPermissions()}
                disabled={addingRolePerm ? true : false}
              >
                {addingRolePerm ? (
                  <span>
                    <img src={loaderSharp} alt="" />
                  </span>
                ) : (
                  <CIcon name="cil-chevron-left" />
                )}
              </CButton>
              <CButton
                type="button"
                color="primary"
                onClick={() => removePermissions()}
                disabled={removingRolePerm ? true : false}
              >
                {removingRolePerm ? (
                  <span>
                    <img src={loaderSharp} alt="" />
                  </span>
                ) : (
                  <CIcon name="cil-chevron-right" />
                )}
              </CButton>
            </CButtonGroup>
          </div>
        </CCol>
        <CCol md={5}>
          <CForm onSubmit={(e) => handleSubmitPerm(e)}>
            <CRow>
              <CCol md={10}>
                <CInput
                  type="text"
                  id="title"
                  name="title"
                  autoComplete="off"
                  value={permData.title}
                  onChange={(e) => handleChangePerm(e)}
                  onBlur={(e) => handleBlurPerm(e)}
                  placeholder="Add Permission..."
                  invalid={
                    permErrors.title && permErrors.title.length > 0
                      ? true
                      : false
                  }
                />
                <CInvalidFeedback className="rs-feedback animated fadeIn">
                  {permErrors.title}
                </CInvalidFeedback>
              </CCol>
              <CCol md={2}>
                <CButton
                  color="secondary"
                  type="submit"
                  disabled={creatingPermission ? true : false}
                >
                  {creatingPermission ? (
                    <span>
                      <img src={loaderSharp} alt="" />
                    </span>
                  ) : (
                    <span>+</span>
                  )}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          <hr />
          <CCard className="card-box">
            <CCardHeader style={{ padding: "0.75rem 1.25rem" }}>
              All Permissions
            </CCardHeader>
            <CCardHeader>
              <CRow style={{ width: "100%" }}>
                <CCol md={12}>
                  <div className="d-flex">
                    <CInput
                      size="sm"
                      type="search"
                      placeholder="Search..."
                      value={searchPerm.search}
                      onChange={(e) => handleChangeSearchPerm(e)}
                    />
                  </div>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <div>
                <ReactTable
                  data={
                    searchPermResults.length > 0
                      ? searchPermResults
                      : filterdPerms
                  }
                  columns={permCol}
                  defaultPageSize={12}
                  showPageSizeOptions={false}
                  className="-highlight -striped text-left"
                  showPagination={
                    filterdPerms && filterdPerms.length > 20 ? true : false
                  }
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
                            setSelectedRowsPerms(selectedRows);
                          } else {
                            rowInfo._index = rowInfo.index;
                            selectedRows.push(rowInfo.original);
                            setPreviousRow(rowInfo);
                            setSelectedRowsPerms(selectedRows);
                          }
                        },

                        onDoubleClick: (e) => {
                          e.preventDefault();
                        },

                        style: {
                          background:
                            selectedRowsPerms.some(
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
    </>
  );
};

export default Perms;
