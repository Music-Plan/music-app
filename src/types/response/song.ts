import { Entity, Platform } from "./base";

export type SongFileType = "mp3" | "ogg" | "aac" | "flac" | "ape";

export type SongBitRate = 128 | 192 | 320 | 999;

export interface SongQuality {
  type: SongFileType;
  bitRate: SongBitRate;
  size: number;
}

export interface Song extends Entity {
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
  platform: Platform;
  duration: number;
}
