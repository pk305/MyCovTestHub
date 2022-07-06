import * as actionTypes from "../type";

const initialState = {
  testResults: [],
  creatingResults: false,
  resultsErrors: {
    TTNCode: [],
    address: [],
    age: [],
    email: [],
    fullName: [],
    postCode: [],
    gender: [],
    testResult: [],
  },
  destroyingTest: false,
};

const ResultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.fetchTestResults:
      return { ...state, testResults: action.payload };

    case actionTypes.creatingResults:
      return { ...state, creatingResults: action.payload };

    case actionTypes.deletingTest:
      return { ...state, destroyingTest: action.payload };

    case actionTypes.destroyTest:
      let testIds = [];
      let filtIds = state.testResults;
      if (action.payload.length) {
        for (let i = 0; i < action.payload.length; i++) {
          testIds.push(action.payload[i].id);
        }

        filtIds = state.testResults.filter((i) => !testIds.includes(i.id));
      }

      return { ...state, testResults: filtIds };

    case actionTypes.resultsErrors:
      let err = action.payload.data;
      let errResData = state.resultsErrors;
      if (err) {
        const errRes = err.errors;
        if (errRes.TTNCode) {
          errResData.TTNCode = errRes.TTNCode;
        } else if (errRes.fullName) {
          errResData.fullName = errRes.fullName;
        } else if (errRes.email) {
          errResData.email = errRes.email;
        } else if (errRes.age) {
          errResData.age = errRes.age;
        } else if (errRes.address) {
          errResData.address = errRes.address;
        } else if (errRes.postCode) {
          errResData.postCode = errRes.postCode;
        } else if (errRes.gender) {
          errResData.gender = errRes.gender;
        } else if (errRes.testResult) {
          errResData.testResult = errRes.testResult;
        }
      }
      return {
        ...state,
        resultsErrors: errResData,
      };

    case actionTypes.clearResultsErrors:
      return {
        ...state,
        resultsErrors: {
          TTNCode: [],
          address: [],
          age: [],
          email: [],
          fullName: [],
          postCode: [],
          gender: [],
          testResult: [],
        },
      };

    default:
      return state;
  }
};

export default ResultsReducer;
