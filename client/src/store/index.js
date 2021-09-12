import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: [],
  },
  mutations: {
    PUSH_USERS(state, payload) {
      state.users.push(payload);
    },
  },
  actions: {},
  getters: {
    getUsers(state) {
      return state.users;
    },
  },
  modules: {},
});
