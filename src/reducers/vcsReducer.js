// src/reducers/vcsReducer.js
import { SET_VCS_CLIENT } from "../actions/vcsActions";
const initialState = {
  vcsClient: null,
};

const vcsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_VCS_CLIENT":
      return {
        ...state,
        vcsClient: action.payload,
      };
    default:
      return state;
  }
};

export default vcsReducer;
