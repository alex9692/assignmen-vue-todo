// import Vue from "vue";

const todoActions = {
  ADD_TODO: "ADD_TODO",
  REMOVE_TODO: "REMOVE_TODO",
  UPDATE_TODO: "UPDATE_TODO",
  CLEAR_TODOS: "CLEAR_TODOS",
  FETCH_TODOS: "FETCH_TODOS",
  SET_SELECTED_TODO: "SET_SELECTED_TODO",
  FINISH_STATUS: "FINISH_STATUS",
  UPDATE_FAV: "UPDATE_FAV",
  SORT_TODOS: "SORT_TODOS",
  SET_LOADING: "SET_LOADING",
  SET_FILTER_TEXT: "SET_FILTER_TEXT",
};

const state = () => ({
  todos: [],
  selectedTodo: null,
  loading: false,
  filterText: "",
});

const mutations = {
  [todoActions.SET_LOADING]: (state, payload) => {
    state.loading = payload;
  },
  // [todoActions.ADD_TODO]: (state, payload) => {
  //   state.todos = [...state.todos, payload];
  // },
  // [todoActions.REMOVE_TODO]: (state, payload) => {
  //   state.todos = state.todos.filter((todo) => todo.id !== payload);
  // },
  // [todoActions.CLEAR_TODO]: (state, payload) => {},
  [todoActions.FETCH_TODOS]: (state, payload) => {
    state.todos = [...payload];
  },
  [todoActions.SET_SELECTED_TODO]: (state, payload) => {
    const todo = state.todos.find((todo) => todo.id === payload);
    state.selectedTodo = todo;
  },
  // [todoActions.FINISH_STATUS]: (state, payload) => {
  //   const todoIndex = state.todos.findIndex((todo) => todo.id === payload);
  //   const todo = state.todos.find((todo) => todo.id === payload);
  //   Vue.set(state.todos, todoIndex, {
  //     ...todo,
  //     finished: true,
  //   });
  // },
  // [todoActions.UPDATE_TODO]: (state, payload) => {
  //   const todoIndex = state.todos.findIndex((todo) => todo.id === payload.id);
  //   Vue.set(state.todos, todoIndex, { ...payload });
  // },
  // [todoActions.UPDATE_FAV]: (state, payload) => {
  //   const todoIndex = state.todos.findIndex((todo) => todo.id === payload);
  //   const todo = state.todos.find((todo) => todo.id === payload);
  //   Vue.set(state.todos, todoIndex, {
  //     ...todo,
  //     fav: !todo.fav,
  //   });
  // },
  // [todoActions.SORT_TODOS]: (state) => {
  //   const finishedTodos = state.todos.filter((todo) => todo.finished);
  //   const pendingTodos = state.todos.filter((todo) => !todo.finished);
  //   state.todos = [...pendingTodos, ...finishedTodos];
  // },
  [todoActions.SET_FILTER_TEXT]: (state, payload) => {
    state.filterText = payload;
  },
};

const actions = {
  addTodo({ commit }, payload) {
    commit(todoActions.ADD_TODO, payload);
  },
  removeTodo({ commit }, payload) {
    commit(todoActions.REMOVE_TODO, payload);
  },
  clearTodos({ commit }, payload) {
    commit(todoActions.CLEAR_TODOS, payload);
  },
  updateTodo({ commit }, payload) {
    commit(todoActions.UPDATE_TODO, payload);
  },
  fetchTodo({ commit }, payload) {
    commit(todoActions.FETCH_TODOS, payload);
  },
  selectedTodo({ commit }, payload) {
    commit(todoActions.SET_SELECTED_TODO, payload);
  },
  updateTodoPending({ commit }, payload) {
    commit(todoActions.FINISH_STATUS, payload);
  },
  updateTodoFav({ commit }, payload) {
    commit(todoActions.UPDATE_FAV, payload);
  },
  updateSortTodos({ commit }) {
    commit(todoActions.SORT_TODOS);
  },
  setLoading({ commit }, payload) {
    commit(todoActions.SET_LOADING, payload);
  },
  filterText({ commit }, payload) {
    commit(todoActions.SET_FILTER_TEXT, payload);
  },
};

const getters = {
  getAllTodos(state) {
    return state.filterText
      ? state.todos.filter((todo) => todo.title.includes(state.filterText))
      : state.todos;
  },
  getFilterText(state) {
    return state.filterText;
  },
  getTodoCount(state) {
    return state.todos.length;
  },
  getFavCount(state) {
    return state.todos.filter((todo) => todo.fav).length;
  },
  isLoading(state) {
    return state.loading;
  },
  getSelectedTodo(state) {
    return state.selectedTodo;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
