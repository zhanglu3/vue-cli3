<template>
  <div ref="canvas_wrap" class="hello">
    <canvas ref="canvas" id="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

class Particle {
  private x: number;
  private y: number;
  public item: number;
  private vx: number;
  private vy: number;
  private initX: number;
  private initY: number;
  private ctx: any;

  constructor(center, opt) {
      this.x = center.x; // 记录点位最终应该停留在的x轴位置
      this.y = center.y; // 记录点位最终应该停留在的y轴位置
      this.item = 0;     // 贝塞尔曲线系数
      this.vx = 2.0;      // 点位在x轴的移动速度
      this.vy = 1.6;       // 点位在y轴的移动速度
      this.initX = Math.random() * opt.WIDTH; // 点位随机在画布中的x坐标
      this.initY = Math.random() * opt.HEIGHT; // 点位随机在画布中的y坐标
      this.ctx = opt.ctx;
  }
  draw(){ // 绘制点位
      this.ctx.beginPath();
      const {x, y} = threeBezier( // 贝塞尔曲线，获取每一个tick点位所在位置
        this.item,
        [this.initX,this.initY],
        [this.x,this.y],
        [this.x,this.y],
        [this.x, this.y]
      )
      // this.ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
      this.ctx.rect(x, y, 2, 2);
      this.ctx.fillStyle="red"
      this.ctx.fill();
      this.ctx.closePath();
      this.speed(); // 点位下次tick绘制时的坐标
  }
  speed() { // 每个点位绘制后的坐标
      this.initX +=this.vx;
      this.initY +=this.vy;
      this.item += 0.005;
  }
}

// t:贝塞尔曲线系数，0-1之前。p1: 轨迹移动的起点。p2: 轨迹移动的终点。cp1: 第一个控制点。cp2: 第二个控制点。
const threeBezier = (t, p1, p2, cp1, cp2) => {
  const [startX,startY] = p1;
  const [endX,endY] = p2;
  const [cpX1,cpY1] = cp1;
  const [cpX2,cpY2] = cp2
  let x = startX * Math.pow(1-t,3) +
          3 * cpX1 * t * Math.pow(1-t,2) +
          3 * cpX2 * (1-t) * Math.pow(t,2) +
          endX * Math.pow(t,3);
  let y = startY * Math.pow(1-t,3) +
          3 * cpY1 * t * Math.pow(1-t,2) +
          3 * cpY2 *(1- t) * Math.pow(t,2) +
          endY * Math.pow(t,3)
  return {
      x,
      y,
  }
}

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  @Prop({
    type: Number,
    default: 1000
  }) private delayTime: number

   WIDTH: number = 0;
   HEIGHT: number = 0;
   ctx: CanvasRenderingContext2D;
   raf: number;
   points: Particle[];
   timer: any;

  private mounted (): void { 
    this.initCanvas();
  }

  initCanvas(): void {
    this.WIDTH = (this.$refs.canvas_wrap as HTMLElement).offsetWidth;
    this.HEIGHT = (this.$refs.canvas_wrap as HTMLElement).offsetHeight;
    const canvas: any =  this.$refs.canvas; //主画布
    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;
    this.ctx = canvas.getContext('2d');
    this.points =  this.createViceCanvas(); // 创建副画布，写出想展示的文字，并且获取文字的位置信息。
    this.init();
  }

  createViceCanvas(): Particle[] {
    const viceCanvas = document.createElement('canvas')
    viceCanvas.width = this.WIDTH;
    viceCanvas.height = this.HEIGHT;
    let viceCxt = viceCanvas.getContext('2d')
    this.createTextCanvas(viceCxt)
    return this.getFontInfo(viceCxt); // 获取文字粒子的位置信息
  }

  createTextCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.font = '60px Arial';
    const measure =  ctx.measureText(this.msg);
    ctx.fillText(this.msg, (this.WIDTH - measure.width) / 2, this.HEIGHT / 2); // 文字居中
  }

  getFontInfo(ctx: CanvasRenderingContext2D): Particle[] { //ctx是副画布，文字取点，获取每个文字在画布中的坐标
    let imageData = ctx.getImageData(0,0,this.WIDTH,this.HEIGHT).data; // 返回Uint8ClampedArray（8位无符号整型固定数组）类型化数组，长度为长*宽*4
    const particles = [];
    for(let x = 0; x < this.WIDTH; x += 4) {
        for(let y=0; y < this.HEIGHT; y += 4) {
            const fontIndex = (x + y * this.WIDTH) * 4 + 3;
            if(imageData[fontIndex] > 0) {
                particles.push(new Particle({
                    x,
                    y,
                }, this))
            }
        }
    }
    return particles;
  }

  init(): void {
    this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT)
    this.points.forEach((value) => {
        value.draw();
    })
    this.raf = window.requestAnimationFrame(this.init) // 递归调用init方法，requestAnimationFrame是个异步方法
    if(this.points[0].item>=1){
        window.cancelAnimationFrame(this.raf)
    }
  }

  refresh(): void {
    this.initCanvas();
  }

  resize(): void {
    if (!this.timer) {
        this.timer = setTimeout(()=> {
          this.WIDTH = (this.$refs.canvas_wrap as HTMLElement).offsetWidth;
          this.HEIGHT = (this.$refs.canvas_wrap as HTMLElement).offsetHeight;
          this.refresh();
          this.timer = clearTimeout(this.timer);
          console.log(this.WIDTH, this.HEIGHT);
        }, this.delayTime);
      }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
