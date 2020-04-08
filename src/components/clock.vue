<template>
    <div class="co_clock">
        <canvas ref="canvas_clock" id="canvas_clock" width="300" height="300"></canvas>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {};
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let canvas = this.$refs.canvas_clock as HTMLCanvasElement;
            let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            this.draw(ctx);
        },
        
        draw(ctx: CanvasRenderingContext2D) {
            const me = this;
            requestAnimationFrame(function step(){
                me.drawDial(ctx); //绘制表盘
                me.drawAllHands(ctx); //绘制时分秒针
                requestAnimationFrame(step);
            });
        },

        /**
         * 绘制表盘
         */
        drawDial(ctx: CanvasRenderingContext2D) {
            let pi = Math.PI;

            ctx.clearRect(0, 0, 300, 300); //清除所有内容
            ctx.save();

            ctx.translate(150, 150); //移动坐标原点到原来的中心
            ctx.beginPath();
            ctx.arc(0, 0, 148, 0, 2 * pi); //绘制圆周
            ctx.stroke();
            ctx.closePath();

            for (let i = 0; i < 60; i++){//绘制刻度。
                ctx.save();
                ctx.rotate(-pi / 2 + i * pi / 30);  //旋转坐标轴。坐标轴x的正方形从 向上开始算起
                ctx.beginPath();
                ctx.moveTo(110, 0);
                ctx.lineTo(140, 0);
                ctx.lineWidth = i % 5 ? 2 : 4;
                ctx.strokeStyle = i % 5 ? "blue" : "red";
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
            ctx.restore();
        },

        /**
         * 绘制时分秒针
         */
        drawAllHands(ctx: CanvasRenderingContext2D) {
            let time = new Date();

            let s = time.getSeconds();
            let m = time.getMinutes();
            let h = time.getHours();

            let pi = Math.PI;
            let secondAngle = pi / 180 * 6 * s;  //计算出来s针的弧度
            let minuteAngle = pi / 180 * 6 * m + secondAngle / 60;  //计算出来分针的弧度
            let hourAngle = pi / 180 * 30 * h + minuteAngle / 12;  //计算出来时针的弧度

            this.drawHand(hourAngle, 60, 6, "red", ctx);  //绘制时针
            this.drawHand(minuteAngle, 106, 4, "green", ctx);  //绘制分针
            this.drawHand(secondAngle, 129, 2, "blue", ctx);  //绘制秒针
        },

        /**
         * 绘制时针、或分针、或秒针
         * 参数1：要绘制的针的角度
         * 参数2：要绘制的针的长度
         * 参数3：要绘制的针的宽度
         * 参数4：要绘制的针的颜色
         * 参数5：ctx
         */
        drawHand(angle: number, len: number, width: number, color: string, ctx: CanvasRenderingContext2D) {
            ctx.save();
            ctx.translate(150, 150); //把坐标轴的远点平移到原来的中心
            ctx.rotate(-Math.PI / 2 + angle);  //旋转坐标轴。 x轴就是针的角度
            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(len, 0);  // 沿着x轴绘制针
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }
})
</script>

<style lang="less">
.co_clock {
    padding: 0;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.1);

    canvas {
        margin: 20px auto;
    }
}
</style>