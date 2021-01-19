import { instance } from "./request";
import { SearchType } from "@/types/response/search";
import { Platform } from "@/types/response/base";

export function searchByKeyword(
  keyword: string,
  pageNo = 1,
  type: SearchType = "song"
) {
  return instance.get("/search", {
    params: { keyword, pageNo, type }
  });
}

export function fetchAlbumDetail(id: number | string, platform: Platform) {
  return instance.get(`/album/${id}/detail?platform=${platform}`);
}

export function getHotSongs(
  id: number | string,
  platform: Platform,
  pageNo = 1
) {
  return instance.get(
    `/artist/${id}/songs?platform=${platform}&pageNo=${pageNo}`
  );
}

export function getArtistDetail(id: number | string, platform: Platform) {
  return instance.get(`/artist/${id}/detail?platform=${platform}`);
}

export function getArtistAlbums(
  id: number | string,
  platform: Platform,
  pageNo = 1,
  pageSize = 10
) {
  return instance.get(
    `/artist/${id}/album?platform=${platform}&pageNo=${pageNo}&pageSize=${pageSize}`
  );
}
