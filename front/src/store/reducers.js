// reducers.js
const initialGlobalState = {
  branchData: null,
  menuData: null,
  categoryData: null,
};
export const globalReducer = (state = initialGlobalState, action) => {
  switch (action.type) {
    case 'SET_GLOBAL_DATA':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};