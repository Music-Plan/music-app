import { BaseResponse } from "./base";
import { Song } from "./song";

export type SearchType =
  | "song"
  | "album"
  | "signer"
  | "songlist"
  | "user"
  | "mv";

export interface SearchSongPlatform {
  songs: Song[];
  total: number;
}

interface SearchResultBase {
  keyword: string;
  searchType: SearchType;
  pageSize: number;
  pageNo: number;
}

interface SearchSongResult extends SearchResultBase {
  qqMusic: SearchSongPlatform;
  cloudMusic: SearchSongPlatform;
  searchType: "song";
}

export type SearchSongResultResponse = BaseResponse<SearchSongResult>;
