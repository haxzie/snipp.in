import initialState from "./initialState";

const types = {
  RESET: "RESET",
};

export default {
  // Resets the current module
  [types.RESET]: (state) => {
    const freshState = initialState();
    Object.keys(freshState).forEach((key) => {
      state[key] = freshState[key];
    });
  },
};
