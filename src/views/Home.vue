<template>
  <div class="home">
    <h1 @click="refresh">{{ msg }}</h1>
    <HelloWorld ref="canvas" :msg="msg" :test="{name: 'xxx'}"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data() {
    return {
      msg: 'Welcome to Hello World'
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
}
</style>
