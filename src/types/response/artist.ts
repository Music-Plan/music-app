import { SongQuality } from "./song";
import { Entity, Platform, BaseResponse } from "./base";

export interface Artist extends Entity {
  pic: string;
  albumSize: number;
  mvSize: number;
  accountId?: number;
  followed?: boolean;
  platform: Platform;
}

export interface HotSong extends Entity {
  vip: boolean;
  artists: Entity[];
  album: Entity & {
    /**
     * 网易云有，qq音乐没有
     */
    pic?: string;
  };
  quality: SongQuality[];
  url: string;
  duration: number;
}

export interface HotSongResult {
  hotSongs: HotSong[];
  total: number;
  pageSize: number;
}

export interface ArtistDetail {
  desc: string;
}

export interface ArtistAlbum extends Entity {
  pic: string;
  publishTime: string;
  artist: Entity;
  songCount: number;
  platform: Platform;
}

export interface ArtistAlbumResult {
  albums: Omit<ArtistAlbum, "artist">[];
  total: number;
  more?: boolean;
}

export type HotSongResponse = BaseResponse<HotSongResult>;
export type ArtistDetailResponse = BaseResponse<ArtistDetail>;
export type ArtistAlbumResponse = BaseResponse<ArtistAlbumResult>;
