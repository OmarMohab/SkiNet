export type pagination<T> = {
    pageIndex: number;
    pagesize: number;
    count: number;
    data: T[]
}