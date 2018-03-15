<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span v-for="(item,index) in dots" class="dot" :class="{active:index===currentPageIndex}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {addClass} from 'common/js/dom';

  export default {
    data(){
      return {
        dots:[],
        currentPageIndex:0,// 指示当前dots
      };
    },
    props:{
      loop:{
        type:Boolean,
        default:true,
      },
      autoPlay:{
        type:Boolean,
        default:true,
      },
      interval:{
        type:Number,
        default:4000
      }
    },
    mounted(){
      // DOM准备好时，初始化；可以用this.$nextTick(),更推荐用setTimeout(()=>{},20);
      setTimeout(()=>{
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        if(this.autoPlay){
          this._play();
        }
      },20);

      window.addEventListener('resize',()=>{
        if(!this.slider){
          return ;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      });

    },
    destoryed(){
      clearTimeout(this.timer);
    },
    methods:{
      _setSliderWidth(isResize){
        this.children=this.$refs.sliderGroup.children;

        let width=0;
        let sliderWidth=this.$refs.slider.clientWidth;

        for(let i=0;i<this.children.length;i++){
          let child =this.children[i];
          // 我们不应该要求传入的slot是特定样式的，应该我们主动添加样式，这样可以降低和外部的耦合
          addClass(child,'slider-item');

          child.style.width=sliderWidth+'px';
          width+=sliderWidth;
        }

        // 因为better-scroll在循环时，会在前后自动复制一个，所以总宽度需要加2
        if(this.loop && !isResize){
          width+=2*sliderWidth;
        }

        // 设置内容的宽度
        this.$refs.sliderGroup.style.width=width + 'px';
      },
      _initDots(){
        // dots为一个只有长度的空数组，方便渲染dots
        // this.children在_setSliderWidth中已经声明
        this.dots=new Array(this.children.length);
      },
      _initSlider(){
        this.slider=new BScroll(this.$refs.slider,{
          scrollX: true,// 横向滚动
          scrollY: false,
          momentum: false,// 动量动画
          snap: {
            loop: true,// 循环
            threshold: 0.1,
            speed:400
          },
        });

        // 监听better-scroll派发的scrollEnd事件，更新currentPageIndex
        this.slider.on('scrollEnd',()=>{
          let pageIndex=this.slider.getCurrentPage().pageX;

          // 循环播放会在头尾复制一个，所以index需要-1
          if(this.loop){
            pageIndex-=1;
          }

          this.currentPageIndex=pageIndex;

          if(this.autoPlay){
            clearTimeout(this.timer);
            this._play();
          }
        });
      },
      _play(){
        // 要滚动到的索引值
        let pageIndex=this.currentPageIndex+1;

        // 循环，因为存在头尾复制，所以需要再+1
        if(this.loop){
          pageIndex+=1;
        }

        this.timer=setTimeout(()=>{
          // 横向滚动到pageIndex页
          this.slider.goToPage(pageIndex,0,400);
        },this.interval);
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
