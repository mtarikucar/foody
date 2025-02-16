import authReducer from "./AuthSlice";
import languageReducer from "./LanguageSlice";

import { configureStore, combineReducers } from '@reduxjs/toolkit';


import storage from 'redux-persist/lib/storage';


import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
  
  // Combine the reducers first
  const rootReducer = combineReducers({
    auth: authReducer,
    language: languageReducer,
  });
  
  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  
  export const persistor = persistStore(store);
  
  export default store;