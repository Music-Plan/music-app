import { RecursivePartial } from "@/types/base";
import { StoreState } from "@/types/store";
import { Store } from "vuex";

/**
 * @description 将一维数组变成二维Grid，每个row的length都相等，最后一行空缺的部分值为undefined
 * @param arr 一维数组
 * @param col row的length
 */
export function expandDims<T>(arr: T[], col: number): T[][] {
  const rows = Math.ceil(arr.length / col);
  const result: T[][] = new Array(rows);
  let cur = -1;
  for (let i = 0; i < arr.length; i++) {
    if (i % col === 0) {
      result[++cur] = new Array(col);
    }
    result[cur][i % col] = arr[i];
  }
  return result;
}

/**
 * 将秒数转发为min:sec格式的字符串
 * @param duration 时长，单位秒
 */
export function sec2Time(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration - minutes * 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function setStoreState(
  store: Store<StoreState>,
  payload: RecursivePartial<StoreState>
) {
  store.commit("setState", payload);
}
