import { Platform } from "./response/base";

export interface StoreState {
  currentTab: string;
  loading: boolean;
  search: {
    activeKey: string | null;
    keywordUpdated: boolean;
    keyword: string;
  };
  albumDetail: {
    platform: Platform | null;
  };
}
