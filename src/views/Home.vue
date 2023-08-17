<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { useNow, useDateFormat, useClipboard } from '@vueuse/core'
import { compute, sompute, type INameUI } from '@/utils/utils-remix'
import { useUser } from '@/store/user'
import { useState } from '@/hooks/hook-state'
import { useCurrent } from '@/locale/instance'
import { useResize } from '@/hooks/hook-resize'
import { divineCols, divineHandler } from '@/utils/utils-common'
import { createNotice } from '@/utils/utils-naive'

export default defineComponent({
    name: 'Home',
    setup(props) {
        const { copy, isSupported } = useClipboard()
        const { width } = useResize()
        const { t, tm } = useCurrent()
        const { state } = useState({ loading: false })
        const user = useUser()
        const hours = computed(() => Number(useDateFormat(useNow(), 'HH').value))
        const cols = computed(() => divineCols({ 768: 1, 1081: 2 }, width.value, 3))
        const client = computed(() => ({
            title: t('client.title'),
            document: t('client.document'),
            welcome: {
                morning: t('client.welcome.morning', { nickname: user.nickname }),
                midday: t('client.welcome.midday', { nickname: user.nickname }),
                afternoon: t('client.welcome.afternoon', { nickname: user.nickname }),
                night: t('client.welcome.night', { nickname: user.nickname })
            },
            service: {
                title: t('client.service.title'),
                document: t('client.service.document'),
                column: tm('client.service.column') as Array<{ icon: INameUI; name: string; path: string; document: string }>
            }
        }))

        /**复制事件**/
        async function onSupporter(value: string) {
            return await divineHandler(isSupported.value, async () => {
                try {
                    await copy(value)
                    return await createNotice({ title: t('common.copy.notice') })
                } catch (e) {
                    return await createNotice({ type: 'error', title: t('common.copy.fail') })
                }
            }).then(result => {
                return divineHandler(!result, () => {
                    return createNotice({ type: 'error', title: t('common.copy.supported') })
                })
            })
        }

        return () => (
            <common-container max-width="1680px" native-style={{ padding: '20px' }} react-style={{ padding: '64px 32px 32px' }}>
                <n-h1 strong>
                    {hours.value >= 18 ? (
                        <n-text>{client.value.welcome.night}</n-text>
                    ) : hours.value >= 13 ? (
                        <n-text>{client.value.welcome.afternoon}</n-text>
                    ) : hours.value >= 10 ? (
                        <n-text>{client.value.welcome.midday}</n-text>
                    ) : (
                        <n-text>{client.value.welcome.morning}</n-text>
                    )}
                </n-h1>
                <div class="common-basic">
                    <div class="common-basic__container">
                        <n-h2 style={{ marginBottom: '10px' }}>{client.value.title}</n-h2>
                        <n-blockquote style={{ margin: '0 0 30px' }}>{client.value.document}</n-blockquote>
                        <n-form ref="formRef" size="large" label-placement="top">
                            <n-form-item label="API Key">
                                <n-input-group>
                                    <n-input value={user.appKey} type="text" placeholder="API Key" readonly />
                                    <n-button
                                        focusable={false}
                                        style={{ padding: '0 12px', backgroundColor: 'var(--input-color-disabled)' }}
                                        v-slots={{ icon: () => sompute('CopyRound', { size: '18px', color: 'var(--n-icon-color)' }) }}
                                        onClick={(e: Event) => onSupporter(user.appKey)}
                                    ></n-button>
                                </n-input-group>
                            </n-form-item>
                            <n-form-item label="API Secret" show-feedback={false}>
                                <n-input-group>
                                    <n-input
                                        value={user.appSecret}
                                        type="password"
                                        show-password-on="click"
                                        placeholder="API Secret"
                                        readonly
                                    />
                                    <n-button
                                        focusable={false}
                                        style={{ padding: '0 12px', backgroundColor: 'var(--input-color-disabled)' }}
                                        v-slots={{ icon: () => sompute('CopyRound', { size: '18px', color: 'var(--n-icon-color)' }) }}
                                        onClick={(e: Event) => onSupporter(user.appSecret)}
                                    ></n-button>
                                </n-input-group>
                            </n-form-item>
                        </n-form>
                    </div>
                    <div class="common-basic__approve">{/* <n-skeleton height="100%" /> */}</div>
                </div>
                <div class="common-service">
                    <n-h2 style={{ marginBottom: '10px' }}>{client.value.service.title}</n-h2>
                    <n-blockquote style={{ margin: '0 0 30px' }}>{client.value.service.document}</n-blockquote>
                    <n-grid x-gap={24} y-gap={24} cols={cols.value}>
                        {client.value.service.column.map(item => (
                            <n-grid-item class="n-pointer" style={{ backgroundColor: 'var(--back-color)' }}>
                                <common-render
                                    loading={state.loading}
                                    spin={<n-skeleton height="156px" />}
                                    component={
                                        <router-link to={item.path} style={{ textDecoration: 'none' }}>
                                            <n-space size={15} wrap-item={false} style={{ padding: '32px', minHeight: '91px' }}>
                                                <n-button text focusable={false}>
                                                    <n-icon component={compute(item.icon)} size={68} />
                                                </n-button>
                                                <n-space size={5} vertical wrap-item={false} style={{ flex: 1 }} justify="center">
                                                    <n-h2 style={{ marginBottom: 0, lineHeight: '36px' }}>{item.name}</n-h2>
                                                    <n-text style={{ lineHeight: '22px' }}>
                                                        <n-ellipsis tooltip={false} line-clamp={2}>
                                                            {item.document}
                                                        </n-ellipsis>
                                                    </n-text>
                                                </n-space>
                                            </n-space>
                                        </router-link>
                                    }
                                ></common-render>
                            </n-grid-item>
                        ))}
                    </n-grid>
                </div>
            </common-container>
        )
    }
})
</script>

<style lang="scss" scoped>
.common-basic {
    display: flex;
    overflow: hidden;
    column-gap: 50px;
    @media (max-width: 1080px) {
        flex-direction: column;
        row-gap: 32px;
    }
    &__container {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .n-input {
            background-color: var(--n-color-disabled);
        }
    }
    &__approve {
        width: 380px;
        height: 260px;
        background-color: var(--back-color);
        @media (max-width: 1080px) {
            width: 100%;
        }
    }
}

.common-service {
    position: relative;
    margin-top: 40px;
}
</style>