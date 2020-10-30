import { createStore } from "vuex";
import { StoreState } from "../types/store";

export default createStore<StoreState>({
  state: {
    currentTab: "",
    search: {
      keywordUpdated: false,
      keyword: ""
    }
  },
  mutations: {
    setState(state, payload: StoreState) {
      for (const key of Object.keys(payload)) {
        state[key] = payload[key];
      }
    }
  },
  actions: {},
  modules: {}
});
