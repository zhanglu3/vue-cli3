<template>
    <div class="test">
        <el-input v-model="value" @blur="onBlur" />
    </div>
</template>
<script>
import {getPreOrderBST} from '@/utils/algorithm/algorithm';

export default {
    name: 'Test',
    components: {
    },
    data() {
        return {
            value: 'AB#D##C##'
        };
    },
    mounted() {
    },
    methods: {
        onBlur(evt) {
            console.log(getPreOrderBST(evt.target.value));
        }
    },
    beforeDestroy() {
    }
};
</script>
<style scoped lang="less">
.test {
    width: 100%;
    .el-input {
        width: 300px;
    }
}
</style>
