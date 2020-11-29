import { BaseResponse, Entity, Platform } from "./base";
import { Song } from "./song";

export interface Album extends Entity {
  pic: string;
  publishTime: string;
  artist: Entity;
  songCount: number;
  platform: Platform;
}

export interface AlbumDetail {
  songs: Omit<Song, "album">[];
  info: Omit<Album, "songCount">;
}

export type AlbumDetailResponse = BaseResponse<AlbumDetail>;
