import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CContainer,
  CForm,
  CFormGroup,
  CInput,
  CInputCheckbox,
  CInvalidFeedback,
  CLabel,
  CRow,
} from "@coreui/react";
import hubLogo from "src/assets/imgs/logo.png";
import { createTestResults } from "src/redux/actions/TestResultsAction";
import { useSelector, useDispatch } from "react-redux";
import loaderSharp from "../../../assets/loader/sharp.svg";
import * as actionTypes from "src/redux/type";
import { useHistory } from "react-router";
import { isLoggedIn } from "src/config/auth";
import Swal from "sweetalert2";
import classNames from "classnames";
import { ToastContainer } from "react-toastify";

const Homepage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const creatingResults = useSelector(
    (state) => state.testResult.creatingResults
  );
  const resultsErrors = useSelector((state) => state.testResult.resultsErrors);
  const [accordion, setAccordion] = useState(null);

  const [resultData, setChangeValue] = useState({
    fullName: "",
    email: "",
    address: "",
    age: "",
    postCode: "",
    TTNCode: "",
    gender: "male",
    testResult: "",
  });

  const handleSubmitResults = (e) => {
    e.preventDefault();
    dispatch({ type: actionTypes.creatingResults, payload: true });
    dispatch({ type: actionTypes.clearResultsErrors, payload: true });
    createTestResults(resultData)
      .then((data) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 10000,
        });
        Toast.fire({
          type: "success",
          title: `You have successfully submited your results, check your email (${
            data && data.email
          }) for more info`,
        });
        resetResultData();
        dispatch({ type: actionTypes.creatingResults, payload: false });
      })
      .catch((err) => {
        if (err.response) {
          dispatch({ type: actionTypes.resultsErrors, payload: err.response });
        }
        dispatch({ type: actionTypes.creatingResults, payload: false });
      });
  };

  const handleChangeResults = (e) => {
    const { name, value } = e.target;
    setChangeValue({
      ...resultData,
      [name]: value,
    });
  };

  const handleCheckResults = (e) => {
    const { name, value } = e.target;
    setChangeValue({
      ...resultData,
      [name]: value,
    });
  };

  const resetResultData = () => {
    setChangeValue({
      fullName: "",
      email: "",
      address: "",
      age: "",
      postCode: "",
      TTNCode: "",
      gender: "male",
      testResult: "",
    });
  };

  const toLogin = (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      history.push("/dashboard");
    } else {
      history.push("/login");
    }
  };

  return (
    <div>
      <div className="landing-curve-shape"></div>
      <div className="hb-land-wrapper">
        {/* logo */}
        <div className="hub-landing">
          <div className="hub-logo">
            <ul className="list-itm">
              <li>
                <a href="/">
                  <img className="im-lg" alt="" src={hubLogo} />
                </a>
              </li>
              <li>
                <CButton
                  type="button"
                  color="primary"
                  variant="outline"
                  className="hb-btn"
                  onClick={(e) => toLogin(e)}
                >
                  {isLoggedIn() ? "Dashboard" : "Login"}
                </CButton>
              </li>
            </ul>
          </div>
          {/* banner */}
          <div className="banner">
            <CContainer>
              <CCard className="banner_container">
                <CCardBody className="banner_box">
                  <h1> Submit your SARS-CoV-3 results </h1>
                  <div className="exp_text">
                    <div className="long_exp">
                      <div className="l_exp">
                        <div>
                          <p>
                            Thank you for doing your part to keep our community
                            safe by participating in Government’s Comprehensive
                            Asymptomatic Testing Protocol. This sheet provides
                            information on next steps now that you have
                            undergone one or more SARS-CoV-3 test(s)
                            administered by the Shangri-La government.
                          </p>
                          <p>
                            This sheet contains information about the process of
                            submitting the tests done.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CContainer>
          </div>
          {/* update body */}
          <div className="update_body">
            <CContainer>
              <p>
                <span>
                  SARS-CoV-3 update: Some test centres will not be sending
                  results by post. Please check with your test centre about the
                  other ways you can submit your result.
                </span>
              </p>
            </CContainer>
          </div>
          {/* result form */}
          <div className="results-form">
            <CContainer>
              <CCard className="rs-card">
                <CCardBody>
                  <CForm
                    className="rs-field"
                    onSubmit={(e) => handleSubmitResults(e)}
                  >
                    <div className="title_div">
                      <h2 className="header_title">
                        Fill in your details to submit your results
                      </h2>
                      <span className="hr-line"></span>
                    </div>
                    <div className="form_divss">
                      <CRow className="form_div">
                        <CCol md="4">
                          <CFormGroup>
                            <CLabel htmlFor="fullName">Full Name</CLabel>
                            <CInput
                              id="fullName"
                              placeholder="Full Name"
                              className="form-control-xss"
                              name="fullName"
                              value={resultData.fullName}
                              onChange={(e) => handleChangeResults(e)}
                              invalid={
                                resultsErrors.fullName &&
                                resultsErrors.fullName.length > 0
                                  ? true
                                  : false
                              }
                            />
                            <CInvalidFeedback className="rs-feedback">
                              {resultsErrors.fullName}
                            </CInvalidFeedback>
                          </CFormGroup>
                        </CCol>
                        <CCol md="4">
                          <CFormGroup>
                            <CLabel htmlFor="email">Email</CLabel>
                            <CInput
                              id="email"
                              type="email"
                              placeholder="Email"
                              className="form-control-xss"
                              name="email"
                              value={resultData.email}
                              onChange={(e) => handleChangeResults(e)}
                              invalid={
                                resultsErrors.email &&
                                resultsErrors.email.length > 0
                                  ? true
                                  : false
                              }
                            />
                            <CInvalidFeedback className="rs-feedback">
                              {resultsErrors.email}
                            </CInvalidFeedback>
                          </CFormGroup>
                        </CCol>
                        <CCol md="4">
                          <CFormGroup>
                            <CLabel htmlFor="age">Age</CLabel>
                            <CInput
                              type="number"
                              id="age"
                              placeholder="Age"
                              className="form-control-xss"
                              name="age"
                              value={resultData.age}
                              onChange={(e) => handleChangeResults(e)}
                              invalid={
                                resultsErrors.age &&
                                resultsErrors.age.length > 0
                                  ? true
                                  : false
                              }
                            />
                            <CInvalidFeedback className="rs-feedback">
                              {resultsErrors.age}
                            </CInvalidFeedback>
                          </CFormGroup>
                        </CCol>
                      </CRow>
                      <CRow className="form_div mt-3">
                        <CCol md="4">
                          <CFormGroup>
                            <CLabel htmlFor="address">Address</CLabel>
                            <CInput
                              id="address"
                              placeholder="Address"
                              className="form-control-xss"
                              name="address"
                              value={resultData.address}
                              onChange={(e) => handleChangeResults(e)}
                              invalid={
                                resultsErrors.address &&
                                resultsErrors.address.length > 0
                                  ? true
                                  : false
                              }
                            />
                            <CInvalidFeedback className="rs-feedback">
                              {resultsErrors.address}
                            </CInvalidFeedback>
                          </CFormGroup>
                        </CCol>
                        <CCol md="4">
                          <CFormGroup>
                            <CLabel htmlFor="postcode">Postcode</CLabel>
                            <CInput
                              id="postcode"
                              placeholder="Postcode"
                              className="form-control-xss"
                              name="postCode"
                              value={resultData.postCode}
                              onChange={(e) => handleChangeResults(e)}
                              invalid={
                                resultsErrors.postCode &&
                                resultsErrors.postCode.length > 0
                                  ? true
                                  : false
                              }
                            />
                            <CInvalidFeedback className="rs-feedback">
                              {resultsErrors.postCode}
                            </CInvalidFeedback>
                          </CFormGroup>
                        </CCol>
                        <CCol md="4">
                          <CFormGroup>
                            <CLabel htmlFor="gender">Gender</CLabel>
                            <CRow>
                              <CCol sm="4">
                                <CFormGroup
                                  variant="custom-checkbox"
                                  className="my-2"
                                >
                                  <CInputCheckbox
                                    id="male"
                                    custom
                                    className="form-control-xss"
                                    checked={
                                      resultData.gender === "male"
                                        ? true
                                        : false
                                    }
                                    value="male"
                                    name="gender"
                                    onChange={(e) => handleCheckResults(e)}
                                  />
                                  <CLabel
                                    variant="custom-checkbox"
                                    htmlFor="male"
                                  >
                                    Male
                                  </CLabel>
                                </CFormGroup>
                              </CCol>
                              <CCol sm="4">
                                <CFormGroup
                                  variant="custom-checkbox"
                                  className="my-2"
                                >
                                  <CInputCheckbox
                                    id="female"
                                    custom
                                    className="form-control-xss"
                                    checked={
                                      resultData.gender === "female"
                                        ? true
                                        : false
                                    }
                                    name="gender"
                                    value="female"
                                    onChange={(e) => handleCheckResults(e)}
                                  />
                                  <CLabel
                                    variant="custom-checkbox"
                                    htmlFor="female"
                                  >
                                    Female
                                  </CLabel>
                                </CFormGroup>
                              </CCol>
                              <CCol sm="4">
                                <CFormGroup
                                  variant="custom-checkbox"
                                  className="my-2"
                                >
                                  <CInputCheckbox
                                    id="other"
                                    custom
                                    className="form-control-xss"
                                    name="gender"
                                    value="other"
                                    checked={
                                      resultData.gender === "other"
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => handleCheckResults(e)}
                                  />
                                  <CLabel
                                    variant="custom-checkbox"
                                    htmlFor="other"
                                  >
                                    Other
                                  </CLabel>
                                </CFormGroup>
                              </CCol>
                            </CRow>
                          </CFormGroup>
                        </CCol>
                      </CRow>
                      <CRow className="form_div mt-3">
                        <CCol md="4">
                          <CFormGroup>
                            <CLabel htmlFor="TTNCode">TTN Code</CLabel>
                            <CInput
                              id="TTNCode"
                              placeholder="TTN Code"
                              className="form-control-xss"
                              name="TTNCode"
                              value={resultData.TTNCode}
                              onChange={(e) => handleChangeResults(e)}
                              invalid={
                                resultsErrors.TTNCode &&
                                resultsErrors.TTNCode.length > 0
                                  ? true
                                  : false
                              }
                            />
                            <CInvalidFeedback className="rs-feedback">
                              {resultsErrors.TTNCode}
                            </CInvalidFeedback>
                          </CFormGroup>
                        </CCol>
                        <CCol md="4">
                          <CFormGroup>
                            <CLabel htmlFor="testResult">Test result</CLabel>
                            <select
                              id="testResult"
                              className={
                                resultsErrors.testResult &&
                                resultsErrors.testResult.length > 0
                                  ? "form-control form-control-xss  is-invalid"
                                  : "form-control form-control-xss "
                              }
                              value={resultData.testResult}
                              name="testResult"
                              onChange={(e) => handleChangeResults(e)}
                            >
                              <option value=""></option>
                              <option value="negative">Negative</option>
                              <option value="positive">Positive</option>
                              <option value="inconclusive">Inconclusive</option>
                            </select>
                            {resultsErrors.testResult &&
                            resultsErrors.testResult.length > 0 ? (
                              <div className="invalid-feedback rs-feedback">
                                {resultsErrors.testResult}
                              </div>
                            ) : null}
                          </CFormGroup>
                        </CCol>
                      </CRow>
                      <CRow className="form_div">
                        <CCol md="4">
                          <CFormGroup>
                            <CButton
                              type="submit"
                              color="danger"
                              size="lg"
                              className="form-control-xss"
                              disabled={creatingResults ? true : false}
                            >
                              {creatingResults ? (
                                <span>
                                  Processing <img src={loaderSharp} alt="" />
                                </span>
                              ) : (
                                <span>Submit</span>
                              )}
                            </CButton>
                          </CFormGroup>
                        </CCol>
                      </CRow>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CContainer>
          </div>
          {/* disclaimer */}
          <div className="disclaimer">
            <div className="container">
              <p>
                Make sure your submitted results are accurate before any
                sumbmission,due to any technical error or difficulties in test
                kit make sure you contact the relative authoritives
              </p>
            </div>
          </div>
          {/* Faq */}
          <div className="accordian-inserted" id="accordion">
            <CContainer>
              <h2 className="text-center mb-4">Frequently Asked Questions</h2>
              <CCard className="mb-0">
                <CCardHeader id="headingOne">
                  <CButton
                    block
                    color="link"
                    className={
                      "accordian-button " +
                      classNames({ collap: accordion === 0 })
                    }
                    onClick={() => setAccordion(accordion === 0 ? null : 0)}
                  >
                    <h5 className="m-0 p-0">
                      Do you have alternative way to submit my results?
                    </h5>
                  </CButton>
                </CCardHeader>
                <CCollapse show={accordion === 0}>
                  <CCardBody>
                    1. Anim pariatur cliche reprehenderit, enim eiusmod high
                    life accusamus terry richardson ad squid. 3 wolf moon
                    officia aute, non cupidatat skateboard dolor brunch. Food
                    truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim
                    aesthetic synth nesciunt you probably haven''t heard of them
                    accusamus labore sustainable VHS.
                  </CCardBody>
                </CCollapse>
              </CCard>
              <CCard className="mb-0">
                <CCardHeader id="headingTwo">
                  <CButton
                    block
                    color="link"
                    className={
                      "accordian-button " +
                      classNames({ collap: accordion === 1 })
                    }
                    onClick={() => setAccordion(accordion === 1 ? null : 1)}
                  >
                    <h5 className="m-0 p-0">
                      What do i need to Know about SARS-CoV-3
                    </h5>
                  </CButton>
                </CCardHeader>
                <CCollapse show={accordion === 1}>
                  <CCardBody>
                    2. Anim pariatur cliche reprehenderit, enim eiusmod high
                    life accusamus terry richardson ad squid. 3 wolf moon
                    officia aute, non cupidatat skateboard dolor brunch. Food
                    truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim
                    aesthetic synth nesciunt you probably haven''t heard of them
                    accusamus labore sustainable VHS.
                  </CCardBody>
                </CCollapse>
              </CCard>
              <CCard className="mb-0">
                <CCardHeader id="headingThree">
                  <CButton
                    block
                    color="link"
                    className={
                      "accordian-button " +
                      classNames({ collap: accordion === 2 })
                    }
                    onClick={() => setAccordion(accordion === 2 ? null : 2)}
                  >
                    <h5 className="m-0 p-0">Do you help me find a job?</h5>
                  </CButton>
                </CCardHeader>
                <CCollapse show={accordion === 2}>
                  <CCardBody>
                    3. Anim pariatur cliche reprehenderit, enim eiusmod high
                    life accusamus terry richardson ad squid. 3 wolf moon
                    officia aute, non cupidatat skateboard dolor brunch. Food
                    truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                    tempor, sunt aliqua put a bird on it squid single-origin
                    coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim
                    aesthetic synth nesciunt you probably havent heard of them
                    accusamus labore sustainable VHS.
                  </CCardBody>
                </CCollapse>
              </CCard>
            </CContainer>
          </div>
          {/* Footer */}
          <footer className="p-5 text-white text-center position-relative hub">
            <div className="container">
              <p className="lead">Copyright &copy; 2021 Company Inc</p>
            </div>
          </footer>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Homepage;
