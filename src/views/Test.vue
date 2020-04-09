<template>
    <div class="test">
        <div>
            前序字符串: <el-input v-model="value" @blur="onBlur" />
        </div>
        <div>
            <el-input-number v-model="num" :min="0" :max="100"></el-input-number>
            <el-row>
                <el-button type="primary" icon="el-icon-grape" circle @click="numOpt('insert')">插入</el-button>
                <el-button type="success" icon="el-icon-delete" circle @click="numOpt('delete')">删除</el-button>
                <el-button type="info" icon="el-icon-sugar" circle></el-button>
                <el-button type="warning" icon="el-icon-star-off" circle></el-button>
                <el-button type="danger" icon="el-icon-cherry" circle></el-button>
            </el-row>
        </div>
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
            // value: 'AB#D##C##'
            value: '52#4##7##',
            treeData: null,
            num: 0
        };
    },
    watch: {
        treeData: {
            handler: function(val) {
                console.log(val);
            },
            deep: true
        }
    },
    mounted() {
        this.treeData = getPreOrderBST(this.value);
    },
    methods: {
        onBlur(evt) {
            this.treeData = getPreOrderBST(evt.target.value);
        },
        numOpt(type) {
            switch (type) {
                case 'insert':
                    this.treeData.insert(this.num);
                    break;
                case 'delete':
                    this.treeData.delete(this.num);
                    break;
            }
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

    .el-input-number {
        margin: 10px 0;
    }
}
</style>
