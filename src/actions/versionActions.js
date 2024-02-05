// src/actions/roomActions.js

export const SET_VERSION = "SET_VERSION";

export const setVersion = (version) => ({
  type: SET_VERSION,
  payload: version,
});
