<template>
  <div class="home">
    <h1 @click="refresh">{{ msg }}</h1>
    <!-- <HelloWorld ref="canvas" :msg="msg"/>
    <Clock></Clock> -->
    <div class="demo_dashboard">
      <el-input v-model="value" @input="onInput"/>
      <Dashboard :value="value"></Dashboard>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Clock from '@/components/clock.vue'
import Dashboard from '@/components/chart/dash-board.vue'

export default {
  name: 'home',
  components: {
    // HelloWorld,
    // Clock,
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
      console.log(val)
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
