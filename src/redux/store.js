import { combineReducers, compose, createStore } from "redux";
import ChartReducer from "./reducers/ChartReducer";

import SystemReducer from "./reducers/SystemReducer";
import TestResultsReducer from "./reducers/TestResultsReducer";
import UserReducer from "./reducers/UserReducer";
import RoleReducer from "./reducers/RoleReducer";
import PermReducer from "./reducers/PermReducer";

const rootReducer = combineReducers({
  system: SystemReducer,
  testResult: TestResultsReducer,
  user: UserReducer,
  chart: ChartReducer,
  role: RoleReducer,
  perm: PermReducer,
});

const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  compose()
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
