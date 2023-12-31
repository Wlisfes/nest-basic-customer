export interface IResolver {
    keyId: number
    createTime: string
    updateTime: string
}

export interface Notice {
    message: string
}

export interface Result<T = Object> {
    page: number
    size: number
    total: number
    list: Array<T>
    message: string
}

export interface IColumn<T = Object> {
    page: number
    size: number
    total: number
    loading: boolean
    dataSource: Array<T>
}
