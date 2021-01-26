import { BaseResponse, Entity, Platform } from "./base";
import { Song } from "./song";
import { Album } from "./album";

export interface Artist extends Entity {
  pic: string;
  albumSize: number;
  mvSize: number;
  accountId?: number;
  followed?: boolean;
  platform: Platform;
}

export interface HotSongResult {
  hotSongs: Song[];
  total: number;
  pageSize: number;
}

export interface ArtistDetail {
  desc: string;
}

export interface ArtistAlbumResult {
  albums: Album[];
  total: number;
  more?: boolean;
}

export type HotSongResponse = BaseResponse<HotSongResult>;
export type ArtistDetailResponse = BaseResponse<ArtistDetail>;
export type ArtistAlbumResponse = BaseResponse<ArtistAlbumResult>;
