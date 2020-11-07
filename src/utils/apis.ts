import { instance } from "./request";

export function fetchSongs(keyword: string, pageNo = 1) {
  return instance.get("/search", {
    params: { keyword, pageNo }
  });
}
