<template>
    <div class="co-canvas-tree">
        <canvas ref="canvas-tree" width="512" height="400"></canvas>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Vector2D } from '@/utils/common/vector2d'

export default Vue.extend({
    name: 'CanvasTree',
    data() {
        return {
        }
    },
    mounted() {
        const canvas = document.querySelector('canvas')!;
        const ctx = canvas.getContext('2d')!;

        // 将坐标原点从左上角移动到左下角，并且让 y 轴翻转为向上
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        ctx.lineCap = 'round';

        const v0 = new Vector2D(256, 0);
        this.drawBranch(ctx, v0, 50, 10, 1, 3);
    },
    methods: {
        /**
         * @param context Canvas2D 上下文
         * @param v0 起始向量
         * @param length 当前树枝的长度
         * @param thickness 当前树枝的粗细
         * @param dir 当前树枝的方向，用与 x 轴的夹角表示，单位是弧度
         * @param bias 随机偏向因子，用来让树枝的朝向有一定的随机性
         */
        drawBranch(context: CanvasRenderingContext2D, v0: Vector2D, length: number, thickness: number, dir: number, bias: number) {
            const v = new Vector2D(1, 0).rotate(dir).scale(length);
            const v1 = v0.copy().add(v);

            context.lineWidth = thickness;
            context.beginPath();
            context.moveTo(v0[0], v0[1]);
            context.lineTo(v1[0], v1[1]);
            context.stroke();

            if(thickness > 2) {
                const left = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5);
                this.drawBranch(context, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
                const right = Math.PI / 4 + 0.5 * (dir - 0.2) + bias * (Math.random() - 0.5);
                this.drawBranch(context, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
            }

            if(thickness < 5 && Math.random() < 0.3) {
                context.save();
                context.strokeStyle = '#c72c35';
                const th = Math.random() * 6 + 3;
                context.lineWidth = th;
                context.beginPath();
                context.moveTo(v1[0], v1[1]);
                context.lineTo(v1.x, v1.y - 2);
                context.stroke();
                context.restore();
            }
        }
    }
})
</script>
