import * as actionTypes from "../type";
// routes config
import routes from "../../routes";

const initialState = {
  processLogin: false,
  loginErrors: {
    email: [],
    password: [],
    message: [],
  },
  auth: {},
  users: [],
  userErrors: {
    email: [],
    password: [],
    confPassword: [],
    username: [],
  },
  moduleRoutes: [],
  creatingUser: false,
  updatingUser: false,
  sytemRoutes: ["can_view_home", "can_view_dashboard"],
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.processingLogin:
      return { ...state, processLogin: action.payload };

    case actionTypes.loginErrors:
      return {
        ...state,
        loginErrors: {
          email: action.payload.email,
          password: action.payload.password,
          message: action.payload.badRequest,
        },
      };

    case actionTypes.clearLoginErrors:
      return {
        ...state,
        loginErrors: { email: [], password: [], message: [] },
      };

    case actionTypes.fetchAuthUser:
      const permissions = action.payload.permissions;
      let moduleRoutes = [];
      const defaultRoutes = routes.filter((e) =>
        state.sytemRoutes.includes(e.slug)
      );
      //
      if (permissions.length > 0) {
        moduleRoutes = routes.filter((i) => permissions.includes(i.slug));
      }
      //
      moduleRoutes = [...defaultRoutes, ...moduleRoutes];

      return {
        ...state,
        auth: action.payload,
        moduleRoutes,
      };

    case actionTypes.fetchUsers:
      return {
        ...state,
        users: action.payload,
      };

    case actionTypes.createUser:
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case actionTypes.creatingUser:
      return {
        ...state,
        creatingUser: action.payload,
      };

    case actionTypes.updatingUser:
      return {
        ...state,
        updatingUser: action.payload,
      };

    case actionTypes.userErrors:
      let err = action.payload.data;
      let errResData = state.userErrors;
      if (err) {
        const errRes = err.errors;
        if (errRes.username) {
          errResData.username = errRes.username;
        } else if (errRes.email) {
          errResData.email = errRes.email;
        } else if (errRes.password) {
          errResData.password = errRes.password;
        } else if (errRes.confPassword) {
          errResData.confPassword = errRes.confPassword;
        }
      }

      return {
        ...state,
        userErrors: errResData,
      };

    case actionTypes.updateUser:
      let users = state.users;

      users = state.users.map((u) => {
        if (u.id === action.payload.id) {
          return Object.assign({}, u, action.payload);
        }
        return u;
      });

      return {
        ...state,
        users,
      };

    case actionTypes.clearUserErrors:
      return {
        ...state,
        userErrors: {
          email: [],
          password: [],
          confPassword: [],
          username: [],
        },
      };

    case actionTypes.destroyUser:
      let userIds = [];
      let filtUsers = state.users;
      if (action.payload.length) {
        for (let i = 0; i < action.payload.length; i++) {
          userIds.push(action.payload[i].id);
        }
        filtUsers = state.users.filter((i) => !userIds.includes(i.id));
      }
      return {
        ...state,
        users: filtUsers,
      };

    default:
      return state;
  }
};

export default UserReducer;
