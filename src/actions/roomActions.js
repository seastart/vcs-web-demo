// src/actions/roomActions.js

export const SET_ROOM = "SET_ROOM";

export const setRoom = (room) => ({
  type: SET_ROOM,
  payload: room,
});
