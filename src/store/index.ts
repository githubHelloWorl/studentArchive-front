import { createStore } from "vuex";

export default createStore({
  state: {
    forgetPassFlag: 0,
    loginUser: Object
  },
  getters: {},
  mutations: {
    changeForgetPassFlag(state) {
      state.forgetPassFlag += 1;
    },
    setUser(state, value) {
      state.loginUser = value;
    }
  },
  actions: {
    changeForgetPassFlag(context) {
      context.commit("changeForgetPassFlag");
    },
    setUser(context, value) {
      context.commit("setUser", value);
    }
  },
  modules: {}
});
