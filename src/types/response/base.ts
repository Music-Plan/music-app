export interface BaseResponse<T> {
  error: boolean;
  msg?: string;
  data: T;
}

export interface Entity {
  id: number;
  mid?: string;
  name: string;
  alias?: string[];
}

export type Platform = "qqMusic" | "cloudMusic";
