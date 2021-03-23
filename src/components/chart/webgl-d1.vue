<template>
    <div class="co-webgl-d1">
        <canvas id="co-webgl-d1" width="500" height="500"></canvas>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface IData {
    canvas?: HTMLCanvasElement;
    gl?: WebGLRenderingContext;
    program?: WebGLProgram;
    triangles: ITriangleInfo[];
    points?: Float32Array;
}

interface ITriangleInfo {
    u_color: number[];
    u_rotation: number;
    u_scale: number;
    u_time: number;
    u_duration: number;
    u_dir: number[];
    startTime: number;
}

export default Vue.extend({
    name: 'WebGL-demo1',
    data(): IData {
        return {
            canvas: undefined,
            gl: undefined,
            program: undefined,
            triangles: [],
            points: undefined,
        }
    },
    mounted() {
        this.canvas = document.querySelector('#co-webgl-d1') as HTMLCanvasElement;
        this.gl = this.canvas.getContext('webgl')!;

        // 三角形的三个顶点
        this.points = new Float32Array([
            -1, -1,
            0, 1,
            1, -1,
        ]);
        
        this.initDemo2();

    },
    methods: {
        /**
         * demo1：单个三角形渲染
         */
        initDemo1() {
            const gl = this.gl!;

            // 在 GLSL 中，attribute 表示声明变量，vec2 是变量的类型，它表示一个二维向量，position 是变量名
            // attribute 变量只能在顶点着色器中使用
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
            // 通过precision关键字可以批量声明一些变量精度，以下声明表示片元着色器中所有的浮点数为中精度
            const fragment = `
                precision mediump float;
                varying vec3 color;

                void main()
                {
                    gl_FragColor = vec4(color, 1.0);
                }    
            `;

            // 创建成 shader 对象
            const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
            gl.shaderSource(vertexShader, vertex);
            gl.compileShader(vertexShader);

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
            gl.shaderSource(fragmentShader, fragment);
            gl.compileShader(fragmentShader);

            this.program = gl.createProgram()!
            const program = this.program;
            
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            // 将这两个 shader 关联到这个 WebGL 程序上
            gl.linkProgram(program);

            // 启用这个 WebGLProgram 对象
            gl.useProgram(program);

            // 将定义好的数据写入 WebGL 的缓冲区
            // 创建一个缓存对象
            const bufferId = gl.createBuffer();
            // 将它绑定为当前操作对象
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            // 再把当前的数据写入缓存对象
            gl.bufferData(gl.ARRAY_BUFFER, this.points!, gl.STATIC_DRAW);

            // 将 buffer 的数据绑定给顶点着色器的 position 变量
            const vPosition = gl.getAttribLocation(program, 'position'); // 获取顶点着色器中的position变量的地址
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // 给变量设置长度和类型
            gl.enableVertexAttribArray(vPosition); // 激活这个变量

            // 将当前画布的内容清除
            gl.clear(gl.COLOR_BUFFER_BIT);
            // 绘图指令，gl.TRIANGLES 表示以三角形为图元绘制，再传入绘制的顶点偏移量和顶点数量
            gl.drawArrays(gl.TRIANGLES, 0, this.points!.length / 2);

        },

        /**
         * demo2：随机多三角形粒子效果
         */
        initDemo2() {
            const gl = this.gl!;

            // unform 变量的值在 shader 执行的过程中不可改变。而且一个变量的值是唯一的，不随顶点变化。
            // uniform 变量既可以在顶点着色器中使用，也可以在片元着色器中使用。
            // p 是当前动画进度
            // rad 是旋转角度，它的值是初始角度 u_rotation 加上 10π，表示在动画过程中它会绕自身旋转 5 周
            // scale 是缩放比例，p * (2.0 - p) 是一个缓动函数，它的作用是让 scale 的变化量随着时间推移逐渐减小
            // translateMatrix 是偏移矩阵，rotateMatrix 是旋转矩阵，scaleMatrix 是缩放矩阵
            const vertex = `
                attribute vec2 position;

                uniform float u_rotation;
                uniform float u_time;
                uniform float u_duration;
                uniform float u_scale;
                uniform vec2 u_dir;

                varying float vP;

                void main() {
                    float p = min(1.0, u_time / u_duration);
                    float rad = u_rotation + 3.14 * 10.0 * p;
                    float scale = u_scale * p * (2.0 - p);
                    vec2 offset = 2.0 * u_dir * p * p;
                    mat3 translateMatrix = mat3(
                        1.0, 0.0, 0.0,
                        0.0, 1.0, 0.0,
                        offset.x, offset.y, 1.0
                    );
                    mat3 rotateMatrix = mat3(
                        cos(rad), sin(rad), 0.0,
                        -sin(rad), cos(rad), 0.0,
                        0.0, 0.0, 1.0
                    );
                    mat3 scaleMatrix = mat3(
                        scale, 0.0, 0.0,
                        0.0, scale, 0.0,
                        0.0, 0.0, 1.0
                    );
                    gl_PointSize = 1.0;
                    vec3 pos = translateMatrix * rotateMatrix * scaleMatrix * vec3(position, 1.0);
                    gl_Position = vec4(pos, 1.0);
                    vP = p;
                }
            `;

            // 通过变量 varying vP 在片元着色器中让 alpha 值随着 vP 值变化，来实现粒子的淡出效果
            const fragment = `
                precision mediump float;
                uniform vec4 u_color;
                varying float vP;

                void main()
                {
                    gl_FragColor.xyz = u_color.xyz;
                    gl_FragColor.a = (1.0 - vP) * u_color.a;
                }  
            `;

            // 创建成 shader 对象
            const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
            gl.shaderSource(vertexShader, vertex);
            gl.compileShader(vertexShader);

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
            gl.shaderSource(fragmentShader, fragment);
            gl.compileShader(fragmentShader);

            const program = gl.createProgram()!
            
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            // 将这两个 shader 关联到这个 WebGL 程序上
            gl.linkProgram(program);

            // 启用这个 WebGLProgram 对象
            gl.useProgram(program);
            
            this.program = program;

            // 将定义好的数据写入 WebGL 的缓冲区
            // 创建一个缓存对象
            const bufferId = gl.createBuffer();
            // 将它绑定为当前操作对象
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            // 再把当前的数据写入缓存对象
            gl.bufferData(gl.ARRAY_BUFFER, this.points!, gl.STATIC_DRAW);

            // 将 buffer 的数据绑定给顶点着色器的 position 变量
            const vPosition = gl.getAttribLocation(program, 'position'); // 获取顶点着色器中的position变量的地址
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // 给变量设置长度和类型
            gl.enableVertexAttribArray(vPosition); // 激活这个变量

            // 开启绘制
            this.update();
        },
        /**
         * 动画效果，每帧刷新
         */
        update() {
            const gl = this.gl!;
            for(let i = 0; i < 5 * Math.random(); i++) {
                this.triangles.push(this.randomTriangles());
            }
            gl.clear(gl.COLOR_BUFFER_BIT);
            // 对每个三角形重新设置u_time
            this.triangles.forEach((triangle) => {
                // performance.now()返回一个表示从性能测量时刻开始经过的毫秒数
                triangle.u_time = (performance.now() - triangle.startTime) / 1000;
                this.setUniforms(triangle);
                gl.drawArrays(gl.TRIANGLES, 0, this.points!.length / 2);
            });
            // 移除已经结束动画的三角形
            this.triangles = this.triangles.filter((triangle) => {
                return triangle.u_time <= triangle.u_duration;
            });
            requestAnimationFrame(this.update);
        },

        // 创建随机三角形属性
        randomTriangles(): ITriangleInfo {
            const u_color = [Math.random(), Math.random(), Math.random(), 1.0]; // 随机颜色
            const u_rotation = Math.random() * Math.PI; // 初始旋转角度
            const u_scale = Math.random() * 0.05 + 0.03; // 初始大小
            const u_time = 0; // 初始时间
            const u_duration = 3.0; // 动画持续时间, 持续3秒钟

            const rad = Math.random() * Math.PI * 2;
            const u_dir = [Math.cos(rad), Math.sin(rad)]; // 运动方向
            const startTime = performance.now();

            return {u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime};
        },

        /**
         * 将随机三角形信息传给 shader 里的 uniform 变量
         */
        setUniforms({u_color, u_rotation, u_scale, u_time, u_duration, u_dir}: ITriangleInfo) {
            const gl = this.gl!;
            const program = this.program!;
            // gl.getUniformLocation 拿到uniform变量的指针
            let loc = gl.getUniformLocation(program, 'u_color');
            
            // 将数据传给 unfirom 变量的地址
            gl.uniform4fv(loc, u_color); // 传入四个浮点数，对应的 uniform 变量类型为 float[4]

            loc = gl.getUniformLocation(program, 'u_rotation');
            gl.uniform1f(loc, u_rotation); // 传入一个浮点数，对应的 uniform 变量的类型为 float

            loc = gl.getUniformLocation(program, 'u_scale');
            gl.uniform1f(loc, u_scale);

            loc = gl.getUniformLocation(program, 'u_time');
            gl.uniform1f(loc, u_time);

            loc = gl.getUniformLocation(program, 'u_duration');
            gl.uniform1f(loc, u_duration);

            loc = gl.getUniformLocation(program, 'u_dir');
            gl.uniform2fv(loc, u_dir); // 传入两个浮点数，对应的 uniform 变量类型为 float[2]
        },

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
        },

    }
})
</script>

<style lang="less">
    .co-webgl-d1 {

    }
</style>
