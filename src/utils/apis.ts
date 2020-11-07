import { instance } from "./request";
import { SearchType } from "@/types/response/search";

export function searchByKeyword(
  keyword: string,
  pageNo = 1,
  type: SearchType = "song"
) {
  return instance.get("/search", {
    params: { keyword, pageNo, type }
  });
}
