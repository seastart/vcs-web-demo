// src/reducers/vcsReducer.js
import { SET_VCS_CLIENT } from "../actions/yuyinActions";
const initialState = {
  yuyin: null,
};

const yuyinReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_YUYIN":
      return {
        ...state,
        yuyin: action.payload,
      };
    default:
      return state;
  }
};

export default yuyinReducer;
