<template>
    <div class="co-webgl-d1">
        <canvas></canvas>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface IData {
    canvas?: HTMLCanvasElement;
    gl?: WebGLRenderingContext;
}

export default Vue.extend({
    name: 'WebGL-demo1',
    data(): IData {
        return {
            canvas: undefined,
            gl: undefined,
        }
    },
    mounted() {
        this.canvas = document.querySelector('canvas')!;
        this.gl = this.canvas.getContext('webgl')!;

        // 在 GLSL 中，attribute 表示声明变量，vec2 是变量的类型，它表示一个二维向量，position 是变量名
        // 顶点着色器还可以将数据通过 varying 变量传给片元着色器，这些值会根据片元着色器的像素坐标与顶点像素坐标的相对位置做线性插值
        // 例子中的color变量是一个三维向量，映射为一个RGB颜色值
        const vertex = `
            attribute vec2 position;
            varying vec3 color;

            void main() {
                gl_PointSize = 1.0;
                color = vec3(0.5 + position * 0.5, 0.0);
                gl_Position = vec4(position * 0.5, 1.0, 1.0);
            }
        `;

        // gl_FragColor 是 WebGL 片元着色器的内置变量，表示当前像素点颜色，它是一个用 RGBA 色值表示的四维向量数据
        const fragment = `
        precision mediump float;
        varying vec3 color;

        void main()
        {
            gl_FragColor = vec4(color, 1.0);
        }    
        `;

        // 创建成 shader 对象
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)!;
        this.gl.shaderSource(vertexShader, vertex);
        this.gl.compileShader(vertexShader);

        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
        this.gl.shaderSource(fragmentShader, fragment);
        this.gl.compileShader(fragmentShader);


        const program = this.gl.createProgram()!;
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        // 将这两个 shader 关联到这个 WebGL 程序上
        this.gl.linkProgram(program);

        // 启用这个 WebGLProgram 对象
        this.gl.useProgram(program);

        // 三角形的三个顶点
        const points = new Float32Array([
            -1, -1,
            0, 1,
            1, -1,
        ]);

        // 将定义好的数据写入 WebGL 的缓冲区
        // 创建一个缓存对象
        const bufferId = this.gl.createBuffer();
        // 将它绑定为当前操作对象
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferId);
        // 再把当前的数据写入缓存对象
        this.gl.bufferData(this.gl.ARRAY_BUFFER, points, this.gl.STATIC_DRAW);

        // 将 buffer 的数据绑定给顶点着色器的 position 变量
        const vPosition = this.gl.getAttribLocation(program, 'position'); // 获取顶点着色器中的position变量的地址
        this.gl.vertexAttribPointer(vPosition, 2, this.gl.FLOAT, false, 0, 0); // 给变量设置长度和类型
        this.gl.enableVertexAttribArray(vPosition); // 激活这个变量

        // 将当前画布的内容清除
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // 绘图指令，gl.TRIANGLES 表示以三角形为图元绘制，再传入绘制的顶点偏移量和顶点数量
        this.gl.drawArrays(this.gl.TRIANGLES, 0, points.length / 2);

    },
    methods: {
        // 生成多边形顶点坐标数组
        createCircleVertex(x: number, y: number, r: number, n: number) {
            const sin = Math.sin;
            const cos = Math.cos;
            const perAngel = (2 * Math.PI) / n;
            const positionArray = [];
            for (let i = 0; i < n; i++) {
                const angel = i * perAngel;
                const nx = x + r * cos(angel);
                const ny = y + r * sin(angel);
                positionArray.push(nx, ny);
            }
            return new Float32Array(positionArray);
        },
        // 生成正多角星顶点坐标数组
        create2CircleVertex(x: number, y: number, r: number, R: number, n: number) {
            const sin = Math.sin;
            const cos = Math.cos;
            const perAngel = Math.PI / n;
            const positionArray = [];
            for (let i = 0; i < 2 * n; i++) {
                const angel = i * perAngel;
                if (i % 2 !== 0) {
                    const Rx = x + R * cos(angel);
                    const Ry = y + R * sin(angel);
                    positionArray.push(Rx, Ry);
                } else {
                    const rx = x + r * cos(angel);
                    const ry = y + r * sin(angel);
                    positionArray.push(rx, ry);
                }
            }
            return new Float32Array(positionArray);
        }
    }
})
</script>

<style lang="less">
    .co-webgl-d1 {

    }
</style>
