import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CInput,
  CInputCheckbox,
  CInvalidFeedback,
  CLabel,
  CRow,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import loaderSharp from "../../../assets/loader/sharp.svg";
import { ToastContainer } from "react-toastify";
import { createLoginUser } from "src/redux/actions/UsersAction";
import * as actionTypes from "../../../redux/type";

const Login = () => {
  const processLogin = useSelector((state) => state.user.processLogin);
  const loginErrors = useSelector((state) => state.user.loginErrors);
  const history = useHistory();
  const dispatch = useDispatch();

  const [loginData, setLogin] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...loginData,
      [name]: value,
    });
  };

  const handleRememberLogin = (e) => {
    const { name, checked } = e.target;
    setLogin({
      ...loginData,
      [name]: checked,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: actionTypes.clearLoginErrors, payload: true });
    const data = {
      username: loginData.email,
      password: loginData.password,
      rememberMe: loginData.rememberMe,
    };
    dispatch({ type: actionTypes.processingLogin, payload: true });
    createLoginUser(data)
      .then(() => {
        dispatch({ type: actionTypes.processingLogin, payload: false });
        history.push("/dashboard");
      })
      .catch((err) => {
        if (err.errResp) {
          dispatch({ type: actionTypes.loginErrors, payload: err.errResp });
        }
        dispatch({ type: actionTypes.processingLogin, payload: false });
      });
  };

  return (
    <div className="login-wrapper">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6" lg="5" sm="6">
            <CCard className="login-box">
              <CCardBody>
                <CForm
                  className="rs-field"
                  onSubmit={(e) => handleLoginSubmit(e)}
                >
                  <div className="login-box-header">
                    <div className="l_left">
                      <h3>Login | MyCovTest Hub</h3>
                    </div>
                  </div>
                  <div className="login-box-body">
                    <CRow className="form_div">
                      <CCol md="12">
                        <CFormGroup>
                          <CLabel htmlFor="email" className="mb-0">
                            Email
                          </CLabel>
                          <CInput
                            id="email"
                            className="form-control-xss mt-2"
                            name="email"
                            value={loginData.email}
                            onChange={(e) => handleChangeLogin(e)}
                            required
                            invalid={
                              loginErrors.email && loginErrors.email.length > 0
                                ? true
                                : false
                            }
                          />
                          <CInvalidFeedback className="rs-feedback animated fadeIn">
                            {loginErrors.email}
                          </CInvalidFeedback>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow className="form_div">
                      <CCol md="12">
                        <CFormGroup>
                          <CLabel htmlFor="password" className="mb-0">
                            Password
                          </CLabel>
                          <CInput
                            type="password"
                            id="password"
                            className="form-control-xss mt-2"
                            name="password"
                            value={loginData.password}
                            onChange={(e) => handleChangeLogin(e)}
                            invalid={
                              loginErrors.password &&
                              loginErrors.password.length > 0
                                ? true
                                : false
                            }
                            required
                          />
                          <CInvalidFeedback className="rs-feedback animated fadeIn">
                            {loginErrors.password}
                          </CInvalidFeedback>

                          {loginErrors.message &&
                          loginErrors.message.length > 0 ? (
                            <div className="help-block text-danger rs-feedback animated fadeIn">
                              {loginErrors.message}
                            </div>
                          ) : null}
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md="12">
                        <CFormGroup variant="custom-checkbox" className="mb-3">
                          <CInputCheckbox
                            id="rememberMe"
                            custom
                            className="form-control-xss"
                            checked={loginData.rememberMe ? true : false}
                            name="rememberMe"
                            onChange={(e) => handleRememberLogin(e)}
                          />
                          <CLabel
                            variant="custom-checkbox"
                            htmlFor="rememberMe"
                            style={{ paddingTop: "4px" }}
                          >
                            Remember me
                          </CLabel>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md="12">
                        <CButton
                          color="primary"
                          className="px-4"
                          block
                          type="submit"
                          size="lg"
                          disabled={processLogin ? true : false}
                        >
                          {processLogin ? (
                            <span>
                              Processing <img src={loaderSharp} alt="" />
                            </span>
                          ) : (
                            <span>Login</span>
                          )}
                        </CButton>
                      </CCol>
                    </CRow>
                  </div>
                  <div className="login-box-footer">
                    <CRow>
                      <CCol md="12">
                        <div className="_info_links">
                          <p>
                            <Link to="/homepage" className="_info-a">
                              Homepage
                            </Link>
                          </p>
                          <p>
                            <Link to="/login" className="_info-a">
                              Forgot Password?
                            </Link>
                          </p>
                        </div>
                        <div className="_info-content">
                          <p>
                            Company Copyright © 2021. All rights reserved.
                            <br />
                            Help and Support : info@company.com
                          </p>
                        </div>
                      </CCol>
                    </CRow>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      {/* toast notification */}
      <ToastContainer pauseOnHover={false} autoClose={6000} />
    </div>
  );
};

export default Login;
