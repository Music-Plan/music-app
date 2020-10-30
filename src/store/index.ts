import { createStore } from "vuex";
import { merge } from "lodash";
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
      merge(state, payload);
    }
  },
  actions: {},
  modules: {}
});
