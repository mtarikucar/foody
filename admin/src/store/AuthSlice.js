import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  currentUserRole: null,
  branchId: null,
  menuId: null,
  package: null,
  companyId: null,
  companyLogo: null,
  accessToken: null,
  refreshToken: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.currentUser = action.payload.user;
      state.currentUserRole = action.payload.role;
      state.companyId = action.payload.company;
      state.branchId = action.payload.branch;
      state.companyLogo = action.payload.logo;
      state.accessToken = action.payload.access_token
      state.refreshToken = action.payload.refresh_token
      state.package = action.payload.package
    },
    setBranch(state, action) {
      state.branchId = action.payload.branchId
      state.menuId = action.payload.menuId
    },
    setPackage(state, action) {
      state.package = action.payload.package
    },
    logoutSuccess(state) {
      state.currentUser = null;
      state.currentUserRole = null;
      state.companyId = null;
      state.companyLogo = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.branchId = null;
      state.package = null;
    },
  },
});

export const {loginSuccess,logoutSuccess,setBranch  } = authSlice.actions;

export default authSlice.reducer;
