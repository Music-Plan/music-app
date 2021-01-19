import { BaseResponse } from "./base";
import { Song } from "./song";
import { Album } from "./album";
import { Artist } from "./artist";

export type SearchType =
  | "song"
  | "album"
  | "artist"
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

interface SearchArtistPlatform {
  artists: Artist[];
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

interface SearchArtistResult extends SearchResultBase {
  qqMusic: SearchArtistPlatform;
  cloudMusic: SearchArtistPlatform;
  searchType: "artist";
}

export type SearchSongResultResponse = BaseResponse<SearchSongResult>;
export type SearchAlbumResultResponse = BaseResponse<SearchAlbumResult>;
export type SearchArtistResultResponse = BaseResponse<SearchArtistResult>;
