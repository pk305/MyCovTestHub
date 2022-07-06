import React, { useState, useEffect, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import * as actionTypes from "src/redux/type";
import CIcon from "@coreui/icons-react";
import loaderSharp from "src/assets/loader/sharp-sm.svg";
import { toast } from "react-toastify";
import {
  createRole,
  fetchRoles,
  deleteRole,
  updateRole,
  rollbackDeleteRole,
} from "src/redux/actions/RolesAction";
import { CSVLink } from "react-csv";
import moment from "moment";
import { useCallback } from "react";

const Roles = () => {
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);
  const [previousRow, setPreviousRow] = useState(null);
  const roles = useSelector((state) => state.role.roles);
  const creatingRole = useSelector((state) => state.role.creatingRole);
  const updatingRole = useSelector((state) => state.role.updatingRole);
  const loadingRoles = useSelector((state) => state.role.loadingRoles);
  const roleErrors = useSelector((state) => state.role.roleErrors);
  const [modal, setModal] = useState(false);
  const [roleData, setRoleData] = useState({
    id: "",
    title: "",
    description: "",
  });
  const csvHeaders = [
    { label: "Index", key: "id" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Created At", key: "createdAt" },
  ];
  const csvLinkRef = useRef();
  const [selAllRoles, setSelAllRoles] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState([]);
  const [searchRole, setSearchRole] = useState({ search: "" });
  const [searchRoleResults, setSearchRoleResults] = useState([]);
  const csvData = {
    data: roles,
    headers: csvHeaders,
    filename: `Roles_.${moment().format()}.csv`,
  };

  const handleExportCsv = (e) => {
    e.preventDefault();
    return csvLinkRef.current.link.click();
  };

  const handleAddRole = () => {
    dispatch({ type: actionTypes.clearRoleErrors, payload: true });
    setModal(!modal);
  };

  const handleChangeRole = (e) => {
    const { name, value } = e.target;
    setRoleData({
      ...roleData,
      [name]: value,
    });
  };

  const handleBlurRole = (e) => {
    dispatch({ type: actionTypes.clearRoleErrors, payload: true });
  };

  const handleSubmitRole = (e) => {
    e.preventDefault();
    dispatch({ type: actionTypes.clearRoleErrors, payload: true });
    if (!roleData.id) {
      dispatch({ type: actionTypes.creatingRole, payload: true });
      createRole(roleData)
        .then((data) => {
          dispatch({ type: actionTypes.createRole, payload: data });
          dispatch({ type: actionTypes.creatingRole, payload: false });
          resetRoleData();
          setModal(false);
          toast(
            <div>
              <span>
                <CIcon name="cil-check" /> Role created successfully.
              </span>
            </div>,
            {
              toastId: data.id,
              className: "toastify-block -w",
              closeOnClick: true,
            }
          );
        })
        .catch((err) => {
          if (err.response) {
            dispatch({ type: actionTypes.roleErrors, payload: err.response });
          }
          dispatch({ type: actionTypes.creatingRole, payload: false });
        });
    } else {
      dispatch({ type: actionTypes.updatingRole, payload: true });
      updateRole(roleData)
        .then((data) => {
          dispatch({ type: actionTypes.updateRole, payload: data });
          dispatch({ type: actionTypes.updatingRole, payload: false });
          resetRoleData();
          setModal(false);
          toast(
            <div>
              <span>
                <CIcon name="cil-check" /> Role updated successfully.
              </span>
            </div>,
            {
              toastId: data.id,
              className: "toastify-block -w",
              closeOnClick: true,
            }
          );
        })
        .catch((err) => {
          if (err.response) {
            dispatch({ type: actionTypes.roleErrors, payload: err.response });
          }
          dispatch({ type: actionTypes.updatingRole, payload: false });
        });
    }
  };

  const resetRoleData = () => {
    setRoleData({
      title: "",
      description: "",
    });
    setSelectedRows([]);
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
      setSelectedRows(p);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRoleCheck = (i, data) => {
    let c = checkedRoles;
    c[i] = !checkedRoles[i];
    if (c[i] === false) {
      const s = selectedRows.filter((e) => e.id !== data.id);
      setSelectedRows(s);
      setSelAllRoles(false);
    } else {
      setSelectedRows([...selectedRows, data]);
    }
    setCheckedRoles(c);
  };

  const handleDeleteRole = (e) => {
    e.preventDefault();
    if (selectedRows.length) {
      let Ids = [];
      for (let i = 0; i < selectedRows.length; i++) {
        Ids.push(selectedRows[i].id);
      }

      deleteRole(JSON.stringify(Ids)).then((data) => {
        if (data.length > 0) {
          dispatch({ type: actionTypes.destroyRole, payload: data });
          resetRoleData();
          toast.error(
            <div>
              <CIcon name="cil-trash" />{" "}
              <span>
                Deleting {data.length} Item(s)!, Click to <b>UNDO</b>
              </span>
            </div>,
            {
              pauseOnHover: true,
              toastId: "data.id",
              className: "toastify-block",
              closeOnClick: true,
              autoClose: 5000,
              onClick: () => {
                rollbackDeleteRole(data);
              },
            }
          );
        }
      });
    }
  };

  const handleEditRole = (e) => {
    e.preventDefault();
    if (selectedRows.length) {
      let data = selectedRows[0];
      setRoleData({
        id: data.id,
        title: data.title ? data.title : "",
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
            name="checkData"
            onChange={() => handleCheckSelRole(state.data)}
            checked={selAllRoles ? true : false}
          />
        </span>
      ),
      accessor: "checkItems",
      sortable: false,
      minWidth: 20,
      Cell: (row) => (
        <div className="p-t-2">
          <input
            type="checkbox"
            id={row.original.id}
            checked={selectedRows.some((e) => e.id === row.original.id) && true}
            onChange={() => handleRoleCheck(row.index, row.original)}
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
      Header: "Title",
      accessor: "title",
      minWidth: 100,
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
    },
  ];

  useEffect(() => {
    const results = roles.filter((value) => {
      return (
        value.title.toLowerCase().includes(searchRole.search.toLowerCase()) ||
        value.description
          .toLowerCase()
          .includes(searchRole.search.toLowerCase())
      );
    });
    setSearchRoleResults(results);
  }, [roles, searchRole, setSearchRoleResults]);

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    if (value.length) {
      setSearchRole({ ...searchRole, search: value });
    } else {
      setSearchRole({ ...searchRole, search: "" });
      setSearchRoleResults([]);
    }
  };

  const fetchedData = useCallback(() => {
    dispatch({ type: actionTypes.fetchingRoles, payload: true });
    fetchRoles().then((data) => {
      if (data.length) {
        dispatch({ type: actionTypes.fetchRoles, payload: data });
      }
      dispatch({ type: actionTypes.fetchingRoles, payload: false });
    });
  }, [dispatch]);

  useEffect(() => {
    return fetchedData();
  }, [fetchedData]);

  return (
    <>
      <CRow>
        <CCol md={12}>
          <div className="dash-title">
            <h5>Roles</h5>
            <small className="text-muted">
              Available roles records on the database.
            </small>
            <CSVLink {...csvData} ref={csvLinkRef} className="hidden">
              Csv
            </CSVLink>
          </div>
          <CCard className="card-box">
            <CCardHeader>
              {selectedRows && selectedRows.length > 0 ? (
                <div>
                  <CButton
                    className="itm-btn"
                    color="danger"
                    variant="ghost"
                    onClick={(e) => handleDeleteRole(e)}
                  >
                    <CIcon name="cil-trash" /> <span>Delete</span>
                  </CButton>
                  {selectedRows.length === 1 ? (
                    <CButton
                      className="itm-btn"
                      color="info"
                      variant="ghost"
                      onClick={(e) => handleEditRole(e)}
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
                    onClick={(e) => handleAddRole(e)}
                  >
                    <CIcon name="cil-user-follow" /> <span>Create</span>
                  </CButton>
                  <CButton
                    className="itm-btn"
                    color="info"
                    variant="ghost"
                    onClick={(e) => handleExportCsv(e)}
                  >
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
                  value={searchRole.search}
                  onChange={(e) => handleChangeSearch(e)}
                />
                <CButton className="itm-btn" color="info" variant="ghost">
                  <CIcon name="cil-magnifying-glass" />
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <div>
                <ReactTable
                  data={
                    searchRoleResults.length > 0 ? searchRoleResults : roles
                  }
                  columns={columns}
                  loading={loadingRoles}
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
        <CForm onSubmit={(e) => handleSubmitRole(e)}>
          <CModalHeader closeButton>
            <CModalTitle>
              <CIcon name="cil-user-follow" /> <span>Role Editor</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="form_div">
              <CCol md="12">
                <CFormGroup>
                  <CLabel htmlFor="title" className="mb-0">
                    Title
                  </CLabel>
                  <CInput
                    id="title"
                    className="mt-2"
                    name="title"
                    value={roleData.title}
                    onChange={(e) => handleChangeRole(e)}
                    onBlur={(e) => handleBlurRole(e)}
                    invalid={
                      roleErrors.title && roleErrors.title.length > 0
                        ? true
                        : false
                    }
                  />
                  <CInvalidFeedback className="rs-feedback animated fadeIn">
                    {roleErrors.title}
                  </CInvalidFeedback>
                </CFormGroup>
              </CCol>
            </CRow>
            <CRow className="form_div">
              <CCol md="12">
                <CFormGroup>
                  <CLabel htmlFor="description" className="mb-0">
                    Description
                  </CLabel>
                  <CInput
                    id="description"
                    className=" mt-2"
                    name="description"
                    value={roleData.description}
                    onChange={(e) => handleChangeRole(e)}
                    onBlur={(e) => handleBlurRole(e)}
                    invalid={
                      roleErrors.description &&
                      roleErrors.description.length > 0
                        ? true
                        : false
                    }
                  />
                  <CInvalidFeedback className="rs-feedback animated fadeIn">
                    {roleErrors.description}
                  </CInvalidFeedback>
                </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModal(false)}>
              Cancel
            </CButton>
            <CButton
              color="primary"
              type="submit"
              disabled={creatingRole || updatingRole ? true : false}
            >
              {creatingRole || updatingRole ? (
                <span>
                  Processing <img src={loaderSharp} alt="Loading..." />
                </span>
              ) : (
                <span>Submit</span>
              )}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  );
};

export default Roles;
