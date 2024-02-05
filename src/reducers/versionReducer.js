// src/reducers/roomReducer.js

import { SET_VERSION } from "../actions/versionActions";

const initialState = {
  version: null,
};

export default function roomReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VERSION:
      return {
        ...state,
        version: action.payload,
      };
    default:
      return state;
  }
}
