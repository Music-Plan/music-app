import { Entity, Platform } from "./base";
import { Song } from "./song";

export interface Album extends Entity {
  pic: string;
  publishTime: string;
  artist: Entity;
  songCount: number;
  platform: Platform;
}

export type AlbumSong = Omit<Song, "album">;
