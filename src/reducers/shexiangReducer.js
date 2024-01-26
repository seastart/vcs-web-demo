// src/reducers/vcsReducer.js
import { SET_VCS_CLIENT } from "../actions/yuyinActions";
const initialState = {
  shexiang: null,
};

const shexiangReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SHEXIANG":
      return {
        ...state,
        shexiang: action.payload,
      };
    default:
      return state;
  }
};

export default shexiangReducer;
