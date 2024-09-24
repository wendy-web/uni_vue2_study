// 仓库模块下,通用的types类型

// 搜索传入的类型
export interface ISearchQuery {
  keyword?: string;
  dept_id?: number;
  start_time?: string;
  end_time?: string;
  status?: number;
  page: number;
  size: number;
}

// 文件类型
export interface IFileInfo {
  name: string;
  src: string;
}

// list页面 emit携带的参数类型
export interface IListEmit {
  val: number;
  id?: number;
  assocType?: number;
}

// add页面 emit携带的参数类型
// 使用了泛型, preInfo动态设置类型
export interface IAddEmit<T> {
  val: number;
  preInfo?: T;
}

// detail页面 emit携带的参数类型
export interface IDetailEmit {
  val: number;
  id?: number;
}
