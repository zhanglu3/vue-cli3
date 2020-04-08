<template>
    <div class="co-chart-dashboard">
        <canvas ref="dashboard_dial" :width="width" :height="height"></canvas>
        <canvas ref="dashboard_hand" :width="width" :height="height"></canvas>
    </div>
</template>

<script lang="ts">

interface DataConfig {
    ctx: any,
    baseCtx: any,
    area:  number,                // 4个刻度区域
    split: number,               // 每个区域有5个刻度
    emptyAreaDegree: number,    // 下方空白区域所占角度
    areaGap: number,            // 每个区域间隔的度数
    gapRadian: number,           // 每个区域间隔的弧度
    valueAmount: number,         // 当前value所占刻度数
    unitDegree: number,          // 每个刻度所占弧度
    startRadian: number,         // 起始弧度
    step: number,             // 动画每帧所转的弧度
    stepFrequency: number,      // 动画帧数
    rangeList: number[],          // [最小值，最大值]
    currentValue: number,     // 当前正在渲染的弧度
    radian: number,              // 每个刻度区域的弧度
    raf: number|null,              // canvas动画标识
    valueEndRadian: number      // 当前value对应的弧度
}

import Vue from 'vue'
export default Vue.extend({
    name: 'Dashboard',
    props: {
        width: {
            type: Number,
            default: 200
        },
        height: {
            type: Number,
            default: 200
        },
        radius: {
            type: Number,
            default: 72
        },
        pointLower: { // 指针点位距离中心点下浮的高度
            type: Number,
            default: 20
        },
        pointRadius: {
            type: Number,
            default: 6
        },
        pointerLength: {
            type: Number,
            default: 35
        },
        pointerWidth: {
            type: Number,
            default: 4
        },
        range: {
            type: Array,
            default() {
                return [0, 100];
            }
        },
        value: {
            type: [Number, String],
            default: 40
        },
        color: {
            type: Array,
            default() {
                return ['#B1DBCE', '#9EBCF7', '#F6BBA5', '#F18484', '#75A8FF'];
            }
        },
        fontSize: {
            type: Number,
            default: 16
        },
        fontFamily: {
            type: String,
            default: 'Arial'
        },
        fontWeight: {
            type: [Number, String],
            default: 500
        },
        textLower: { // 文字距离中心点下浮的高度
            type: Number,
            default: 55
        },
    },
    data():DataConfig {
        return {
            ctx: null,
            baseCtx: null,
            area: 4,                // 4个刻度区域
            split: 5,               // 每个区域有5个刻度
            emptyAreaDegree: 80,    // 下方空白区域所占角度
            areaGap: 10,            // 每个区域间隔的度数
            gapRadian: 0,           // 每个区域间隔的弧度
            valueAmount: 0,         // 当前value所占刻度数
            unitDegree: 0,          // 每个刻度所占弧度
            startRadian: 0,         // 起始弧度
            step: 0,             // 动画每帧所转的弧度
            stepFrequency: 60,      // 动画帧数
            rangeList: [],          // [最小值，最大值]
            currentValue: 0,     // 当前正在渲染的弧度
            radian: 0,              // 每个刻度区域的弧度
            raf: null,              // canvas动画标识
            valueEndRadian: 0,      // 当前value对应的弧度
        };
    },
    watch: {
        value(val) {
            if(val === '') val = 0;
            val = Number(val) > this.rangeList[1] ? this.rangeList[1] : Number(val); // 超出最大值时取最大值
            this.valueEndRadian = this.getRadian(val);
            this.step = (this.valueEndRadian - this.currentValue) / this.stepFrequency;
            this.currentValue += this.step;
            this.draw();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            const canvas_dial = this.$refs.dashboard_dial as HTMLCanvasElement;
            const canvas_hand = this.$refs.dashboard_hand as HTMLCanvasElement;
            this.baseCtx = canvas_dial.getContext('2d') as CanvasRenderingContext2D;
            this.ctx = canvas_hand.getContext('2d') as CanvasRenderingContext2D;

            if (this.range.length !== 2) {
                this.$emit('onError', 'property range must have two number members!');
                throw new Error('property range must have two number members!');
            }
            
            this.rangeList = this.range.sort() as number[];
            // 每个刻度区域的弧度
            this.radian = (360 - this.emptyAreaDegree - this.areaGap * (this.area - 1)) / this.area * Math.PI / 180;
            // 每个刻度的弧度
            this.unitDegree = this.radian / this.split;
            // 最左侧圆弧的起始弧度
            this.startRadian = (90 + this.emptyAreaDegree/2) * Math.PI / 180;
            // 单个区域间隔的弧度
            this.gapRadian = this.areaGap * Math.PI / 180;

            // 当前值最终弧度
            this.valueEndRadian = this.getRadian(Number(this.value));
            this.currentValue = this.startRadian;
            this.step = (this.valueEndRadian - this.startRadian) / this.stepFrequency;

            // 绘制表盘
            this.drawDial();
            
            this.draw();
        },

        /**
         * 获取新图层
         */
        getNewCanvas():{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D} {
            const viceCanvas = document.createElement('canvas')
            viceCanvas.width = this.width;
            viceCanvas.height = this.height;
            let viceCtx = viceCanvas.getContext('2d') as CanvasRenderingContext2D;

            return {
                canvas: viceCanvas,
                ctx: viceCtx
            }
        },

        /**
         * 获取当前val对应弧度
         */
        getRadian(val: number): number {
            const total = this.area * this.split;
            const amount = (val - this.rangeList[0]) / (this.rangeList[1] - this.rangeList[0]) * total;
            const gap = amount === total ? this.area - 1 : parseInt( `${amount / this.split}`);
            // 当前值最终弧度
            return this.startRadian + this.unitDegree * amount + gap * this.gapRadian;
        },

        draw() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // 绘制文字
            this.drawText();

            // 绘制指针
            this.drawHand(this.currentValue);
            this.currentValue += this.step;

            this.raf = window.requestAnimationFrame(this.draw);
            
            // 区别增加跟减少两种情况
            if( (this.step > 0 && this.currentValue > this.valueEndRadian) || (this.step < 0 && this.currentValue < this.valueEndRadian)){
                window.cancelAnimationFrame(this.raf)
            }
        },

        /**
         * 绘制表盘
         */
        drawDial() {
            const pi = Math.PI;
            let {
                baseCtx: ctx,
                width,
                height,
                radius,
                area,
                color,
                split,
                radian
            } = this;

            ctx.save();
            ctx.translate(width/2, height/2);

            for (let i=0; i < area; i++) {
                const start = this.startRadian + i * (radian + this.gapRadian);
                ctx.beginPath();
                ctx.arc(0, 0, radius, start, start + radian); // 绘制圆弧
                ctx.strokeStyle = color[i];
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.closePath();

                for (let j = 0; j <= split; j++){ // 绘制刻度
                    ctx.save();
                    if(i + j === 0 || (i + 1) * j === area * split) {
                        ctx.lineWidth = 4;
                    } else if(!j) { // 除去头尾刻度，每个区域的第一个刻度不画
                        ctx.restore();
                        continue;
                    } else {
                        ctx.lineWidth = 2;
                    }
                    ctx.rotate(start + j * this.unitDegree);  // 旋转坐标轴。坐标轴x的正方形从 向上开始算起
                    ctx.beginPath();
                    ctx.moveTo(radius - 8, 0);
                    ctx.lineTo(radius + 2, 0);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                }
            }
            ctx.restore();
        },

        /**
         * 渲染文字
         */
        drawText() {
            let ctx = this.ctx;

            ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
            const measure =  ctx.measureText(this.value);

            ctx.textBaseline = "middle";
            ctx.fillStyle = this.color[this.area];
            ctx.fillText(this.value, (this.width - measure.width) / 2, this.height / 2 + this.textLower); // 文字居中
        },

        /**
         * 绘制指针
         */
        drawHand(val:number) {
            const pi = Math.PI;
            let {
                ctx,
                color,
                area
            } = this;

            ctx.save();
            ctx.translate(this.width/2, this.height/2);
            ctx.beginPath();
            ctx.arc(0, 0, this.pointRadius, 0, 2 * pi);
            ctx.fillStyle = color[area];
            ctx.fill();

            // 画指针
            ctx.beginPath();

            // 由于原点相较表盘下浮一些高度，所以起始弧度需要根据下浮高度重新计算
            // TODO: 咋算？？？？-- 目前按指针原点与表盘中心点一致的方案来实现

            ctx.rotate(val);
            ctx.moveTo(0, 0);
            ctx.lineTo(this.pointerLength, 0);
            ctx.lineWidth = this.pointerWidth;
            ctx.lineCap = 'round';
            ctx.strokeStyle = color[area];
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }
})
</script>
<style lang="less">
.co-chart-dashboard {
    position: relative;

    canvas {
        position: absolute;
        // 如果不设置translate，canvas就会相对父元素left: 50%，=.=???
        // 我发现原因了！！！因为祖先元素#app设置了text-align: center;所以导致canvas向右偏移了50%
        // 那索性直接让canvas居中吧
        left: 50%;
        transform: translate(-50%);
    }
}
</style>