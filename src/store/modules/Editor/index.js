import initialState from "./initialState";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations,
};
