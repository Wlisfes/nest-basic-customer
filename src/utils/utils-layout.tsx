import { createVNode, computed, type Component, type CSSProperties } from 'vue'
import { useRoute } from 'vue-router'
import { sompute, type INameUI } from '@/utils/utils-compute'
export interface ClientOption {
    label: string
    key: string
    icon: INameUI
    size: number
}

export function useLoyout() {
    const route = useRoute()

    const IsHeader = computed(() => {
        return route.meta.Header === 'HIDE' ? false : true
    })

    const IsSidebar = computed(() => {
        return route.meta.Sidebar === 'HIDE' ? false : true
    })

    return {
        query: computed(() => route.query),
        params: computed(() => route.params),
        path: computed(() => route.path),
        IsHeader,
        IsSidebar
    }
}

/**异步渲染组件**/
export function createLoyout(component: Component, props: Record<string, unknown>) {
    return async () => {
        return createVNode(component, props)
    }
}

/**同步渲染组件**/
export function createElement(component: Component, props: Record<string, unknown> = {}) {
    return () => {
        return createVNode(component, props)
    }
}

/**条件样式返回值**/
export function whereProperter<T = CSSProperties>(where: boolean, whereValue: T = {} as T, defaultValue: T = {} as T) {
    return where ? whereValue : defaultValue
}

/**菜单数据转换**/
export function formatter(data: Array<ClientOption> = []) {
    return data.map(item => {
        return {
            key: item.key,
            label: createElement(
                <router-link to={item.key}>
                    <n-el tag="h1" style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>
                        {item.label}
                    </n-el>
                </router-link>
            ),
            icon: createElement(sompute(item.icon), { size: item.size })
        }
    })
}

export const Client = {
    captchar: [
        { label: '概述', key: '/captchar/describe', icon: 'Describe', size: 30 },
        { label: '应用服务', key: '/captchar/service', icon: 'Service', size: 28 },
        { label: '验证记录', key: '/captchar/recorder', icon: 'DataBase', size: 28 },
        { label: '验证统计', key: '/captchar/compute', icon: 'Compute', size: 30 }
    ],
    message: [
        { label: '概述', key: '/message/describe', icon: 'Describe', size: 30 },
        { label: '应用服务', key: '/message/service', icon: 'Service', size: 28 },
        { label: '任务队列', key: '/message/schedule', icon: 'Schedule', size: 30 },
        { label: '发送记录', key: '/message/recorder', icon: 'DataBase', size: 28 },
        { label: '发送统计', key: '/message/compute', icon: 'Compute', size: 30 }
    ],
    mailer: [
        { label: '概述', key: '/mailer/describe', icon: 'Describe', size: 30 },
        { label: '应用服务', key: '/mailer/service', icon: 'Service', size: 28 },
        { label: '资源套餐', key: '/mailer/package', icon: 'Package', size: 28 },
        { label: '模板管理', key: '/mailer/template', icon: 'Template', size: 30 },
        { label: '邮件群发', key: '/mailer/bulksender', icon: 'MailForwar', size: 30 },
        { label: '任务队列', key: '/mailer/schedule', icon: 'Schedule', size: 30 },
        { label: '发送记录', key: '/mailer/recorder', icon: 'DataBase', size: 30 },
        { label: '发送统计', key: '/mailer/compute', icon: 'Compute', size: 28 }
    ]
}
