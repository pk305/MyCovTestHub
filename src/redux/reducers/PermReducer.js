import * as actionTypes from "src/redux/type";

const initialState = {
  perms: [],
  permErrors: {
    title: [],
  },
  rolePerms: [],
  creatingPermission: false,
  filterdPerms: [],
  addingRolePerm: false,
  removingRolePerm: false,
};

const PermReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.creatingPermission:
      return {
        ...state,
        creatingPermission: action.payload,
      };

    case actionTypes.addingRolePerm:
      return {
        ...state,
        addingRolePerm: action.payload,
      };

    case actionTypes.removingRolePerm:
      return {
        ...state,
        removingRolePerm: action.payload,
      };

    case actionTypes.findRolePerms:
      let permsIds = [];
      let filterdPerms = [];
      if (action.payload.length) {
        for (let i = 0; i < action.payload.length; i++) {
          permsIds.push(action.payload[i].id);
        }
        filterdPerms = state.perms.filter(
          (item) => !permsIds.includes(item.id)
        );
      }
      if (filterdPerms.length <= 0 && action.payload.length <= 0) {
        let fillPerms = [];
        for (let i = 0; i < state.perms.length; i++) {
          fillPerms.push(state.perms[i]);
        }
        filterdPerms = fillPerms;
      }

      return {
        ...state,
        rolePerms: action.payload,
        filterdPerms,
      };

    case actionTypes.findPermRole:
      let pIds = [];
      let fPerms = [];
      if (action.payload.length) {
        for (let i = 0; i < action.payload.length; i++) {
          pIds.push(action.payload[i].id);
        }

        fPerms = state.perms.filter((item) => !pIds.includes(item.id));
      }

      if (fPerms.length <= 0 && action.payload.length <= 0) {
        let filPerms = [];
        for (let i = 0; i < state.perms.length; i++) {
          filPerms.push(state.perms[i]);
        }
        fPerms = filPerms;
      }

      return {
        ...state,
        rolePerms: action.payload,
        filterdPerms: fPerms,
      };

    case actionTypes.fetchPerms:
      return {
        ...state,
        perms: action.payload,
        filterdPerms: action.payload,
      };

    case actionTypes.createPerm:
      return {
        ...state,
        perms: [...state.perms, action.payload],
        filterdPerms: [...state.filterdPerms, action.payload],
      };

    case actionTypes.permErrors:
      let err = action.payload.data;
      let errResData = state.permErrors;
      if (err) {
        const errRes = err.errors;
        if (errRes.title) {
          errResData.title = errRes.title;
        }
      }
      return {
        ...state,
        permErrors: errResData,
      };

    case actionTypes.clearPermErrors:
      return {
        ...state,
        permErrors: {
          title: [],
        },
      };

    default:
      return state;
  }
};

export default PermReducer;
