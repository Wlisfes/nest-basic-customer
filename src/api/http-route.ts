import { request } from '@/utils/utils-request'
import type { IResolver, Result, Notice } from '@/interface/static.resolver'
export enum IRouteHot {
    Default = 'default',
    GET = 'info',
    POST = 'success',
    PUT = 'warning',
    DELETE = 'error'
}
export interface IRoute extends IResolver {
    source: string
    title: string
    path: string
    redirect: string
    icon: string
    order: number
    parent: string
    isLeaf: boolean
    method: keyof typeof IRouteHot
    children: Array<IRoute>
}

/**动态路由菜单**/
export function httpDynamicRoute() {
    return request<Result<IRoute>>({
        url: `/api-basic/route/dynamic`,
        method: 'GET'
    })
}

/**路由菜单列表**/
export function httpColumnRoute() {
    return request<Result<IRoute>>({
        url: `/api-basic/route/column`,
        method: 'GET'
    })
}

/**路由权限列表**/
export function httpOptionsRoute() {
    return request<Result<IRoute>>({
        url: `/api-basic/route/options`,
        method: 'GET'
    })
}

/**路由信息**/
export function httpBasicRoute(params: Pick<IRoute, 'id'>) {
    return request<IRoute>({
        url: `/api-basic/route/basic`,
        method: 'GET',
        params
    })
}

/**新增路由**/
export function httpCreateRoute(
    data: Pick<IRoute, 'status' | 'source' | 'title' | 'order' | 'path'> & Partial<Pick<IRoute, 'redirect' | 'icon' | 'parent'>>
) {
    return request<Notice>({
        url: `/api-basic/route/create`,
        method: 'POST',
        data
    })
}

/**编辑路由**/
export function httpUpdateRoute(
    data: Pick<IRoute, 'id' | 'status' | 'source' | 'title' | 'order' | 'path'> & Partial<Pick<IRoute, 'redirect' | 'icon' | 'parent'>>
) {
    return request<Notice>({
        url: `/api-basic/route/update`,
        method: 'PUT',
        data
    })
}

/**编辑路由状态**/
export function httpRouteTransfer(data: Pick<IRoute, 'id' | 'status'>) {
    return request<Notice>({
        url: `/api-basic/route/transfer`,
        method: 'PUT',
        data
    })
}

/**新增接口规则**/
export function httpCreateRule(data: Pick<IRoute, 'path' | 'title' | 'method' | 'status' | 'parent'>) {
    return request<Notice>({
        url: `/api-basic/route/create/rule`,
        method: 'POST',
        data
    })
}

/**编辑接口规则**/
export function httpUpdateRule(data: Pick<IRoute, 'id' | 'path' | 'title' | 'method' | 'status' | 'parent'>) {
    return request<Notice>({
        url: `/api-basic/route/update/rule`,
        method: 'PUT',
        data
    })
}

/**接口规则信息**/
export function httpBasicRule(params: Pick<IRoute, 'id'>) {
    return request<IRoute>({
        url: `/api-basic/route/basic/rule`,
        method: 'GET',
        params
    })
}

/**编辑规则状态**/
export function httpRuleTransfer(data: Pick<IRoute, 'id' | 'status'>) {
    return request<Notice>({
        url: `/api-basic/route/transfer/rule`,
        method: 'PUT',
        data
    })
}
