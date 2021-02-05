const userActions = {
  SET_CURRENT_USER: "SET_CURRENT_USER",
  SET_LOADING: "SET_LOADING",
};

const state = () => ({
  currentUser: null,
  loading: false,
});

const mutations = {
  [userActions.SET_CURRENT_USER]: (state, payload) => {
    state.currentUser = payload;
  },
  [userActions.SET_LOADING]: (state, payload) => {
    state.loading = payload;
  },
};

const actions = {
  setCurrentUser({ commit }, payload) {
    commit(userActions.SET_CURRENT_USER, payload);
  },
  setLoading({ commit }, payload) {
    commit(userActions.SET_LOADING, payload);
  },
};

const getters = {
  getId(state) {
    return state.currentUser && state.currentUser.id;
  },
  isAuth(state) {
    return !!state.currentUser;
  },
  isLoading(state) {
    return state.loading;
  },
  getName(state) {
    return state.currentUser.name;
  },
  getEmail(state) {
    return state.currentUser.email;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
