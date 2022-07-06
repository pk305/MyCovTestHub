import React, { useState, useEffect, useCallback } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CRow,
} from "@coreui/react";
import ReactTable from "react-table";
import { useDispatch, useSelector } from "react-redux";
import * as actionTypes from "src/redux/type";
import CIcon from "@coreui/icons-react";
import loaderSharp from "src/assets/loader/sharp-sm.svg";
import { toast } from "react-toastify";
import {
  fetchTestResults,
  deleteTest,
} from "src/redux/actions/TestResultsAction";
import { CSVLink } from "react-csv";
import { useRef } from "react";
import moment from "moment";

const TestResults = () => {
  const dispatch = useDispatch();
  const testResults = useSelector((state) => state.testResult.testResults);
  const [selectedRows, setSelectedRows] = useState([]);
  const [previousRow, setPreviousRow] = useState(null);
  const [selAllTests, setSelAllTests] = useState(false);
  const [checkedTests, setCheckedTests] = useState([]);
  const destroyingTest = useSelector(
    (state) => state.testResult.destroyingTest
  );
  const [disableCheck, setDisableCheck] = useState(false);
  const [searchResults, setSearchResults] = useState({ search: "" });
  const [searchTestResults, setSearchTestResults] = useState([]);

  const fetchedData = useCallback(() => {
    fetchTestResults().then((data) => {
      dispatch({ type: actionTypes.fetchTestResults, payload: data });
    });
  }, [dispatch]);

  const csvHeaders = [
    { label: "Full Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "Post Code", key: "postCode" },
    { label: "Gender", key: "gender" },
    { label: "Age(yrs)", key: "age" },
    { label: "Result", key: "result" },
  ];
  const csvLinkRef = useRef();
  const csvData = {
    data: testResults,
    headers: csvHeaders,
    filename: `TestResults.${moment().format("LT")}.csv`,
  };

  const handleExportCsv = (e) => {
    e.preventDefault();
    return csvLinkRef.current.link.click();
  };

  useEffect(() => {
    return fetchedData();
  }, [fetchedData]);

  const handleCheckSelTest = (data) => {
    let selectAll = !selAllTests;
    setSelAllTests(selectAll);
    let c = [];
    data.forEach((e) => {
      c.push(selectAll);
    });
    setCheckedTests(c);

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

  const handleTestCheck = (i, data) => {
    let c = checkedTests;
    c[i] = !checkedTests[i];
    if (c[i] === false) {
      const s = selectedRows.filter((e) => e.id !== data.id);
      setSelectedRows(s);
      setSelAllTests(false);
    } else {
      setSelectedRows([...selectedRows, data]);
    }
    setCheckedTests(c);
  };

  const handleDeleteTest = (e) => {
    e.preventDefault();
    if (selectedRows.length) {
      let Ids = [];
      for (let i = 0; i < selectedRows.length; i++) {
        Ids.push(selectedRows[i].id);
      }
      dispatch({ type: actionTypes.deletingTest, payload: true });
      setDisableCheck(true);
      deleteTest(JSON.stringify(Ids))
        .then((data) => {
          if (data.length > 0) {
            dispatch({ type: actionTypes.destroyTest, payload: data });
            toast.error(
              <div>
                <CIcon name="cil-trash" />{" "}
                <span>
                  {data && data.length} Item(s) Deleted!, Click to <b>UNDO</b>
                </span>
              </div>,
              {
                pauseOnHover: true,
                toastId: "deleteTests",
                className: "toastify-block",
                closeOnClick: true,
                autoClose: 3000,
              }
            );
          }
        })
        .finally(() => {
          setDisableCheck(false);
          dispatch({ type: actionTypes.deletingTest, payload: false });
        });
    }
  };

  useEffect(() => {
    const results = testResults.filter((value) => {
      return (
        value.fullName
          .toLowerCase()
          .includes(searchResults.search.toLowerCase()) ||
        value.email
          .toLowerCase()
          .includes(searchResults.search.toLowerCase()) ||
        value.address
          .toLowerCase()
          .includes(searchResults.search.toLowerCase()) ||
        value.postCode
          .toLowerCase()
          .includes(searchResults.search.toLowerCase()) ||
        value.result.toLowerCase().includes(searchResults.search.toLowerCase())
      );
    });
    setSearchTestResults(results);
  }, [testResults, searchResults, setSearchTestResults]);

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    if (value.length) {
      setSearchResults({ ...searchResults, search: value });
    } else {
      setSearchResults({ ...searchResults, search: "" });
      setSearchTestResults([]);
    }
  };

  const columns = [
    {
      Header: (state) => (
        <span>
          <input
            type="checkbox"
            id="allTests"
            onChange={() => handleCheckSelTest(state.data)}
            checked={selAllTests ? true : false}
            disabled={disableCheck ? true : false}
          />
        </span>
      ),
      accessor: "checkItems",
      sortable: false,
      minWidth: 25,
      Cell: (row) => (
        <div className="p-t-2">
          <input
            type="checkbox"
            id={row.original.id}
            name="selRows"
            disabled={disableCheck ? true : false}
            checked={selectedRows.some((e) => e.id === row.original.id) && true}
            onChange={() => handleTestCheck(row.index, row.original)}
          />
        </div>
      ),
    },
    {
      Header: "Full Name",
      accessor: "fullName",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "Post Code",
      accessor: "postCode",
      minWidth: 60,
    },
    {
      Header: "Gender",
      accessor: "gender",
      minWidth: 40,
    },
    {
      Header: "Age(yrs)",
      accessor: "age",
      minWidth: 40,
    },
    {
      Header: "Result",
      accessor: "result",
      minWidth: 70,
    },
  ];

  return (
    <CRow>
      <CCol md={12}>
        <div className="dash-title">
          <h5>Test Results</h5>
          <small className="text-muted">
            Available results records on the database.
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
                  onClick={(e) => handleDeleteTest(e)}
                  disabled={destroyingTest ? true : false}
                >
                  {destroyingTest ? (
                    <span>
                      Deleting
                      <img src={loaderSharp} alt="" />
                    </span>
                  ) : (
                    <span>
                      <CIcon name="cil-trash" /> <span>Delete</span>
                    </span>
                  )}
                </CButton>
              </div>
            ) : (
              <>
                <div>
                  <CButton
                    className="itm-btn"
                    color="info"
                    variant="ghost"
                    onClick={(e) => handleExportCsv(e)}
                  >
                    <CIcon name="cil-file" /> <span>Export</span>
                  </CButton>
                </div>

                <div className="d-flex">
                  <CInput
                    size="sm"
                    type="search"
                    style={{ width: "290px" }}
                    placeholder="Search..."
                    value={searchResults.search}
                    onChange={(e) => handleChangeSearch(e)}
                  />
                  <CButton className="itm-btn" color="info" variant="ghost">
                    <CIcon name="cil-magnifying-glass" />
                  </CButton>
                </div>
              </>
            )}
          </CCardHeader>
          <CCardBody>
            <div>
              <ReactTable
                data={
                  searchTestResults.length > 0 ? searchTestResults : testResults
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
                              selectedRows.push(state.sortedData[i]._original);
                            }
                          } else {
                            for (
                              let i = rowInfo.index;
                              i <= previousRow.index;
                              i++
                            ) {
                              selectedRows.push(state.sortedData[i]._original);
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

                      onDoubleClick: (e) => {
                        e.preventDefault();
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
  );
};

export default TestResults;
