import { Entity, Platform } from "./base";

export interface Artist extends Entity {
  pic: string;
  albumSize: number;
  mvSize: number;
  accountId?: number;
  followed?: boolean;
  platform: Platform;
}
