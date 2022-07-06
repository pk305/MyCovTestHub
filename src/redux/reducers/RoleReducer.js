import * as actionTypes from "src/redux/type";

const initialState = {
  roles: [],
  roleErrors: {
    title: [],
    description: [],
  },
  creatingRole: false,
  loadingRoles: false,
  updatingRole: false,
};

const RoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.fetchRoles:
      return {
        ...state,
        roles: action.payload,
      };

    case actionTypes.createRole:
      return {
        ...state,
        roles: [...state.roles, action.payload],
      };

    case actionTypes.creatingRole:
      return {
        ...state,
        creatingRole: action.payload,
      };

    case actionTypes.fetchingRoles:
      return {
        ...state,
        loadingRoles: action.payload,
      };

    case actionTypes.roleErrors:
      let err = action.payload.data;
      let errResData = state.roleErrors;
      if (err) {
        const errRes = err.errors;
        if (errRes.title) {
          errResData.title = errRes.title;
        } else if (errRes.description) {
          errResData.description = errRes.description;
        }
      }
      return {
        ...state,
        roleErrors: errResData,
      };

    case actionTypes.destroyRole:
      let rIds = [];
      let filtRoles = state.roles;
      if (action.payload.length) {
        for (let i = 0; i < action.payload.length; i++) {
          rIds.push(action.payload[i].id);
        }

        filtRoles = state.roles.filter((i) => !rIds.includes(i.id));
      }

      return {
        ...state,
        roles: filtRoles,
      };

    case actionTypes.updateRole:
      return {
        ...state,
        roles: state.roles.map((role) => {
          if (role.id === action.payload.id) {
            return Object.assign({}, role, action.payload);
          }
          return role;
        }),
      };

    case actionTypes.updatingRole:
      return {
        ...state,
        updatingRole: action.payload,
      };

    case actionTypes.clearRoleErrors:
      return {
        ...state,
        roleErrors: {
          title: [],
          description: [],
        },
      };

    default:
      return state;
  }
};

export default RoleReducer;
