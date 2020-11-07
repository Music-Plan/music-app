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

interface SearchSongPlatform {
  songs: Song[];
  total: number;
}
interface SearchAlbumPlatform {
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
  qqMusic: SearchSongPlatform;
  cloudMusic: SearchSongPlatform;
  searchType: "song";
}
interface SearchAlbumResult extends SearchResultBase {
  qqMusic: SearchAlbumPlatform;
  cloudMusic: SearchAlbumPlatform;
  searchType: "album";
}

export type SearchSongResultResponse = BaseResponse<SearchSongResult>;
export type SearchAlbumResultResponse = BaseResponse<SearchAlbumResult>;
