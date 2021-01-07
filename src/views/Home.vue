<template>
    <div class="home">
        <div @click="refresh">点击刷新以下文字</div>
        <HelloWorld ref="canvas" :msg="msg"/>
        <Clock></Clock>
        <div class="demo_dashboard">
            <el-input v-model="value" @input="onInput"/>
            <Dashboard :value="value"></Dashboard>
        </div>
    </div>
</template>

<script>
import HelloWorld from '@/components/chart/HelloWorld.vue'
import Clock from '@/components/chart/clock.vue'
import Dashboard from '@/components/chart/dash-board.vue'

export default {
    name: 'home',
    components: {
        HelloWorld,
        Clock,
        Dashboard
    },
    data() {
        return {
            msg: 'Welcome to Hello World',
            value: 80
        };
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
    },
    methods: {
        onResize() {
            this.$refs.canvas.resize();
        },
        refresh() {
            this.$refs.canvas.refresh();
        },
        onInput(val) {
            this.value = Number(val);
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    }
}
</script>
<style scoped lang="less">
.home {
    width: 100%;
    .demo_dashboard {
        width: 300px;
        margin: 10px auto;
    }
}
</style>
