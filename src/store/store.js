import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 默认使用 localStorage

const persistConfig = {
  key: "root",
  storage,
};

const initialState = {
  vcsClient: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_VCS_CLIENT":
      return { ...state, vcsClient: action.payload };
    default:
      return state;
  }
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
