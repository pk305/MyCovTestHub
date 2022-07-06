import * as actionTypes from "../type";

const initialState = {
  positiveNegativeCases: [],
  isAble: [],
};

const ChartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.getPostiveNegativeCases:
      return {
        ...state,
        positiveNegativeCases: action.payload,
      };

    case actionTypes.dashErrors:
      let isAble = [];
      if (action.payload.status === 403) {
        isAble.push(action.payload.isAble);
      }
      return {
        ...state,
        isAble,
      };

    default:
      return state;
  }
};

export default ChartReducer;
