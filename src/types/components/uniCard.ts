import { Platform } from "../response/base";

export interface UniCardData {
  cover: {
    src: string;
    size?: number;
  };
  title: string | ClickableText;
  subtitle?: string | ClickableText;
  platform: Platform;
}

interface ClickableText {
  text: string;
  onClick?: {
    (text: string): unknown;
  };
}
