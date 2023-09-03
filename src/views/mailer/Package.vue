<script lang="tsx">
import { defineComponent, computed, Fragment, onMounted } from 'vue'
import { useResize } from '@/hooks/hook-resize'
import { useSource } from '@/hooks/hook-source'
import { whereProperter } from '@/utils/utils-layout'
import { compute, type INameUI } from '@/utils/utils-remix'
import { divineAsyncBatch, divineSkeleton, divineTransfer, divineDelay } from '@/utils/utils-common'
import { httpColumnBundleMailer, httpUserComputeMailer, httpColumnUserMailer } from '@/api/mailer.service'
import type { BundleMailer, UserBundleMailer } from '@/interface/mailer.resolver'

export default defineComponent({
    name: 'Package',
    setup() {
        const { mobile } = useResize()
        const { state, fetchUpdate, setState } = useSource<UserBundleMailer, Object>(
            {
                immediate: false,
                size: 50,
                form: {},
                data: {
                    total: 0,
                    current: 0,
                    prevent: 0,
                    dataExper: [],
                    dataOffer: []
                },
                dataColumn: [
                    { title: '套餐包名称', key: 'name', minWidth: 180 },
                    { title: '套餐包类型', key: 'type', minWidth: 120 },
                    {
                        title: '实付价',
                        key: 'expense',
                        minWidth: 120,
                        render: (e: UserBundleMailer) => (
                            <n-h3 type="warning" class="n-flex n-center" style={{ margin: 0 }}>
                                <n-icon component={compute('Money')} size={20} color="var(--n-bar-color)" />
                                <n-text type="warning" style={{ marginLeft: '-2px', fontSize: '20px' }}>
                                    {divineTransfer(e.expense)}
                                </n-text>
                            </n-h3>
                        )
                    },
                    { title: '购买时间', key: 'createTime', minWidth: 170 },
                    { title: '总条数', key: 'total', minWidth: 100 },
                    {
                        title: '剩余量',
                        key: 'consume',
                        minWidth: 100,
                        render: (e: UserBundleMailer) => <n-text>{e.total - e.consume}</n-text>
                    },
                    { title: '失效时间', key: 'expireTime', minWidth: 170 },
                    { title: '状态', key: 'status', minWidth: 140 },
                    { title: '操作', key: 'command', minWidth: 120 }
                ]
            },
            async ({ size, page }) => {
                return await httpColumnUserMailer({ size, page })
            }
        )

        onMounted(async () => {
            await divineAsyncBatch([fetchUpdate, fetchComputeMailer])
            return await setState({ loading: false })
        })

        /**统计当前用户套餐包余量**/
        async function fetchComputeMailer() {
            const { data } = await httpColumnBundleMailer()
            return await httpUserComputeMailer().then(response => {
                return setState({
                    data: {
                        total: response.data.total ?? 0,
                        current: response.data.current ?? 0,
                        prevent: response.data.prevent ?? 0,
                        dataExper: data.list.filter(item => item.type === 'small'),
                        dataOffer: data.list.filter(item => item.type === 'large')
                    }
                })
            })
        }

        const dataCompute = computed<Array<{ name: string; value: number; icon: INameUI; type: string }>>(() => [
            { name: '套餐总余量:', value: state.data.total, icon: 'Package', type: 'success' },
            { name: '本月发送:', value: state.data.current, icon: 'MailReadr', type: 'info' },
            { name: '上月发送:', value: state.data.prevent, icon: 'MailForwar', type: 'warning' }
        ])

        return () => (
            <common-container
                bordered
                content-style={whereProperter(mobile.value, { padding: '0 20px' }, { padding: '0 40px' })}
                request-style={whereProperter(mobile.value, { padding: '40px 20px 20px' }, { padding: '60px 40px 30px' })}
                request={<common-header vertical={mobile.value} title="套餐资源"></common-header>}
            >
                <common-render
                    loading={state.loading}
                    spin={
                        <n-element style={{ paddingBottom: '48px' }}>
                            <n-skeleton height="35.2px" width="100%" style={{ marginBottom: '10px', maxWidth: '256px' }} />
                            <n-skeleton height={72} style={{ borderRadius: '3px' }} />
                        </n-element>
                    }
                    component={
                        <n-element style={{ paddingBottom: '48px' }}>
                            <n-h2 style={{ marginBottom: '10px' }}>资源包余量</n-h2>
                            <common-resize
                                cols={{ 960: 1 }}
                                default-cols={3}
                                data-render={(e: { cols: number }) => (
                                    <Fragment>
                                        {dataCompute.value.map(item => (
                                            <n-card embedded>
                                                <n-space wrap-item={false} size={5} align="center">
                                                    <n-button text focusable={false}>
                                                        <n-icon component={compute(item.icon)} size={30} />
                                                    </n-button>
                                                    <n-h3 style={{ margin: 0, fontSize: '20px' }}>{item.name}</n-h3>
                                                    <n-text type={item.type} style={{ fontSize: '20px' }}>
                                                        {`${item.value}条`}
                                                    </n-text>
                                                </n-space>
                                            </n-card>
                                        ))}
                                    </Fragment>
                                )}
                            ></common-resize>
                        </n-element>
                    }
                ></common-render>
                <n-element>
                    <common-render
                        loading={state.loading}
                        spin={<n-skeleton height="35.2px" width="100%" style={{ marginBottom: '10px', maxWidth: '256px' }} />}
                        component={<n-h2 style={{ marginBottom: '10px' }}>体验套餐包</n-h2>}
                    ></common-render>
                    <common-source
                        loading={state.loading}
                        pagination={false}
                        total={state.data.dataExper.length}
                        data-source={state.data.dataExper}
                        came-style={{ paddingBottom: '48px' }}
                        cols={{ 840: 1, 1280: 2, 1800: 3, 2280: 4, 2680: 5 }}
                        default-cols={3}
                        data-render={(data: BundleMailer) => {
                            return <mailer-package key={data.id} node={data} mobile={mobile.value}></mailer-package>
                        }}
                        data-spin={
                            <common-resize
                                style={{ paddingBottom: '48px' }}
                                cols={{ 840: 1, 1280: 2, 1800: 3, 2280: 4, 2680: 5 }}
                                default-cols={3}
                                data-render={(e: { cols: number }) => {
                                    return divineSkeleton(e.cols, <n-skeleton height={215.58} style={{ borderRadius: '3px' }} />)
                                }}
                            ></common-resize>
                        }
                        onUpdate={fetchUpdate}
                    ></common-source>
                </n-element>
                <n-element>
                    <common-render
                        loading={state.loading}
                        spin={<n-skeleton height="35.2px" width="100%" style={{ marginBottom: '10px', maxWidth: '256px' }} />}
                        component={<n-h2 style={{ marginBottom: '10px' }}>特惠套餐包</n-h2>}
                    ></common-render>
                    <common-source
                        loading={state.loading}
                        pagination={false}
                        total={state.data.dataOffer.length}
                        data-source={state.data.dataOffer}
                        came-style={{ paddingBottom: '48px' }}
                        cols={{ 840: 1, 1280: 2, 1800: 3, 2280: 4, 2680: 5 }}
                        default-cols={3}
                        data-render={(data: BundleMailer) => {
                            return <mailer-package key={data.id} node={data} mobile={mobile.value}></mailer-package>
                        }}
                        data-spin={
                            <common-resize
                                style={{ paddingBottom: '48px' }}
                                cols={{ 840: 1, 1280: 2, 1800: 3, 2280: 4, 2680: 5 }}
                                default-cols={3}
                                data-render={(e: { cols: number }) => {
                                    return divineSkeleton(e.cols, <n-skeleton height={215.58} style={{ borderRadius: '3px' }} />)
                                }}
                            ></common-resize>
                        }
                        onUpdate={fetchUpdate}
                    ></common-source>
                </n-element>
                <n-element style={{ paddingBottom: '64px' }}>
                    <common-render
                        loading={state.loading}
                        spin={<n-skeleton height="35.2px" width="100%" style={{ marginBottom: '10px', maxWidth: '256px' }} />}
                        component={<n-h2 style={{ marginBottom: '10px' }}>已购资源套餐</n-h2>}
                    ></common-render>
                    <n-data-table
                        size="large"
                        scroll-x={state.dataColumn.reduce((a, b) => a + b.minWidth, 0)}
                        bordered={false}
                        loading={state.loading}
                        data={state.dataSource}
                        columns={state.dataColumn}
                        pagination={{ page: state.page, pageSize: state.size }}
                    ></n-data-table>
                </n-element>
            </common-container>
        )
    }
})
</script>