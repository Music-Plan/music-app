export interface BaseResponse<T> {
  error: boolean;
  msg?: string;
  data: T;
}

export interface Entity {
  id: number;
  /**
   * qq音乐有id与mid之分
   * 网易云只有一个id
   */
  mid?: string;
  name: string;
  alias?: string[];
}

export type Platform = "qqMusic" | "cloudMusic";
