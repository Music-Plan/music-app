import { Platform } from "./response/base";

export interface StoreState {
  currentTab: string;
  loading: boolean;
  search: {
    activeKey: string;
    keywordUpdated: boolean;
    keyword: string;
  };
  artistDetail: {
    id: number | string | null;
    platform: Platform | null;
  };
  albumDetail: {
    id: number | string | null;
    platform: Platform | null;
  };
}
