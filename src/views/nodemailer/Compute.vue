<script lang="tsx">
import { defineComponent } from 'vue'
import { useResize } from '@/hooks/hook-resize'
import { whereProperter } from '@/utils/utils-layout'

export default defineComponent({
    name: 'Compute',
    setup() {
        const { mobile } = useResize()

        return () => (
            <common-container
                bordered
                mobile={mobile.value}
                content-style={whereProperter(mobile.value, { padding: '0 20px' }, { padding: '0 40px' })}
                request-style={whereProperter(mobile.value, { padding: '40px 20px 20px' }, { padding: '60px 40px 30px' })}
                request={<common-header vertical={mobile.value} title="验证统计"></common-header>}
            ></common-container>
        )
    }
})
</script>
