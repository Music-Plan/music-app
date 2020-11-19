import { createStore } from "vuex";
import { merge } from "lodash";
import { StoreState } from "../types/store";

export default createStore<StoreState>({
  state: {
    currentTab: "",
    loading: false,
    search: {
      activeKey: "song",
      keywordUpdated: false,
      keyword: ""
    },
    albumDetail: {
      id: null,
      platform: null
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
