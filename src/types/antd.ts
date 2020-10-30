export interface TableColumn<T> {
  dataIndex?: keyof T;
  fixed?: "left" | "right";
  key?: string;
  title: string;
  width?: number;
  customRender?: {
    (_: { text: any; record: T; index: number }): unknown;
  };
  slots?: { customRender: string };
}

export interface Pagination {
  total: number;
  current: number;
  pageSize: number;
}
