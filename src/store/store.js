// src/store/store.js

import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import vcsReducer from "../reducers/vcsReducer";
import roomReducer from "../reducers/roomReducer";
import yuyinReducer from "../reducers/yuyinReducer";
import shexiangReducer from "../reducers/shexiangReducer";

const rootReducer = combineReducers({
  vcs: vcsReducer, // 这是您现有的 vcs 状态管理
  room: roomReducer, // 新增的 room 状态管理
  yuyin: yuyinReducer, //加入会议麦克风状态管理
  shexiang: shexiangReducer, //加入会议摄像头状态管理
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
