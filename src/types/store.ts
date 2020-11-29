import { Platform } from "./response/base";

export interface StoreState {
  currentTab: string;
  loading: boolean;
  search: {
    activeKey: string;
    keywordUpdated: boolean;
    keyword: string;
  };
  albumDetail: {
    id: number | string | null;
    platform: Platform | null;
  };
  playing: {
    url: string;
    cover: string;
    title: string;
    artist: string;
    duration: number;
  };
}
