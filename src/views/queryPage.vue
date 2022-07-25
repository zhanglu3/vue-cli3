<!--  -->
<template>
<div class="page-query-page">
    <van-search
        v-model="searchVal"
        placeholder="请输入搜索关键词"
        :clearable="false"
        @search="onSearch"
        @input="onInput"
    />
    <div>
        <van-tag
            plain
            type="primary"
            v-for="(item, index) in searchHistory"
            :key="index"
            @click="onHistoryItemSelect(index)"
        >{{item.text}}</van-tag>
    </div>
    <div v-show="!this.isSearchFinished && !!searchKeys.length">
        <van-list
            v-model="keyListLoading"
            :finished="true"
            finished-text="没有更多了"
            :immediate-check="false"
        >
            <van-cell v-for="(item, index) in searchKeys" :key="index" :title="item" is-link @click="onSelect(item)" />
        </van-list>
    </div>
    <div class="page-query-page__result">{{searchResult}}</div>
</div>
</template>

<script>
import { Search, List, Cell, Tag } from 'vant';

const debounceLimit = 500;    // 输入查询时间间隔限制
const maxCount = 5;           // 搜索记录限制个数
const maxTime = 5000;         // 搜索记录限制时长，毫秒单位

export default {
    components: {
        [Search.name]: Search,
        [List.name]: List,
        [Cell.name]: Cell,
        [Tag.name]: Tag,
    },
    data() {
        return {
            searchVal: '',
            searchKeys: [],
            searchHistory: [],
            searchResult: '',
            keyListLoading: false,
            isSearchFinished: false,
        };
    },
    computed: {},
    methods: {
        /**
         * 搜索事件回调
         */
        onSearch() {
            // 可能完成搜索但是联想词查询还未响应
            this.isSearchFinished = true;
            this.searchKeys = [];

            this.fetchApi(`我是 ${this.searchVal} 的搜索结果`).then((res) => {
                this.searchResult = res;
            })

            this.searchHistory.unshift({
                text: this.searchVal,
                time: new Date().getTime(),
            });
            
            if(this.searchHistory.length > maxCount) {
                this.searchHistory.pop();
            }
        },
        /**
         * 输入事件回调
         * @param {String} val 当前输入值
         */
        onInput(val) {
            this.isSearchFinished = false;
            // 搜索词联想查询
            if(this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                val && this.getSearchKeys(val);
            }, debounceLimit);
        },
        /**
         * 搜索词联想查询接口调用
         * @param {String} val 当前输入值
         */
        getSearchKeys(val) {
            this.keyListLoading = true;
            // 模拟数据
            const data = Array.apply(null, { length: 5}).map((_, i) => `${val}..${i}`);
            this.fetchApi(data).then((res) => {
                // 存在一种情况：若此时结果已经查询完成，则无需展示联想词
                if (!this.isSearchFinished && val === this.searchVal) {
                    this.searchKeys = res;
                    this.keyListLoading = false;
                }
            })
        },
        /**
         * 搜索联想词选中事件
         * @param {*} text 
         */
        onSelect(text) {
            this.searchVal = text;
            // 选中即搜索
            this.onSearch();
        },
        /**
         * 搜索记录项选中事件
         * @param {Number} index 搜索记录数组索引
         */
        onHistoryItemSelect(index) {
            if(index === 0) return;
            const arr = this.searchHistory.splice(index, 1);
            this.onSelect(arr[0].text);
        },
        /**
         * 模拟接口调用
         */
        fetchApi(result) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(result);
                }, 500 * (Math.floor(Math.random() * 2 + 0.5)));
            })
        }
    },
    created() {
        this.searchHistory = JSON.parse(localStorage.getItem('history') || '[]')
            .filter((item) => (new Date().getTime() - item.time) < maxTime);
    },
    beforeDestroy() {
        localStorage.setItem('history', JSON.stringify(this.searchHistory));
    }
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
.page-query-page {
    .van-tag + .van-tag {
        margin-left: 10px;
    }
    .van-tag {
        cursor: pointer;
        &:hover {
            background-color: #1989fa;
            color: #fff;
        }
    }
    &__result {
        margin-top: 20px;
    }
}
</style>