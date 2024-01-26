// src/reducers/roomReducer.js

import { SET_ROOM } from "../actions/roomActions";

const initialState = {
  room: null,
};

export default function roomReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ROOM:
      return {
        ...state,
        room: action.payload,
      };
    default:
      return state;
  }
}
