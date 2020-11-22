import { BaseResponse } from "./base";
import { Song } from "./song";
import { Album } from "./album";

export type SearchType =
  | "song"
  | "album"
  | "signer"
  | "songlist"
  | "user"
  | "mv";

interface SearchSongPlatformResult {
  songs: Song[];
  total: number;
}
interface SearchAlbumPlatformResult {
  albums: Album[];
  total: number;
}

interface SearchResultBase {
  keyword: string;
  searchType: SearchType;
  pageSize: number;
  pageNo: number;
}

interface SearchSongResult extends SearchResultBase {
  qqMusic: SearchSongPlatformResult;
  cloudMusic: SearchSongPlatformResult;
  searchType: "song";
}
interface SearchAlbumResult extends SearchResultBase {
  qqMusic: SearchAlbumPlatformResult;
  cloudMusic: SearchAlbumPlatformResult;
  searchType: "album";
}

export type SearchSongResultResponse = BaseResponse<SearchSongResult>;
export type SearchAlbumResultResponse = BaseResponse<SearchAlbumResult>;
