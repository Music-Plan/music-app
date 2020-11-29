import { WithKey, ClickableText } from "../base";
import { Platform } from "../response/base";

export interface UniCardData extends WithKey {
  cover: {
    src: string;
    size?: number;
  };
  title: string | ClickableText;
  subtitle?: string | ClickableText;
  platform: Platform;
}
