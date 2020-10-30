export interface StoreState {
  currentTab: string;
  search: {
    keywordUpdated: boolean;
    keyword: string;
  };
}
