<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default{
    props: {
      // 如何派发scroll事件(0默认值，不派发；1屏幕滑动超过一定时间后派发；2实时派发；3实时派发，而且在缓动时也派发)
      probeType: {
        type: Number,
        default:1
      },
      // 是否主动派发点击事件
      click: {
        type: Boolean,
        default: true
      },
      // 在低版本的better-scroll中需要手动监听数据的变化并重新初始化组件，但高版本的已经不需要手动监听data了
      data: {
        type: Array,
        default: null
      },
      // 是否监听滚动
      listenScroll:{
        type:Boolean,
        default:false
      },
      // 是否派发滚动到底部事件
      pullup:{
        type:Boolean,
        default:false
      },
      // 是否派发beforeScroll事件
      beforeScroll:{
        type:Boolean,
        default:false
      }
    },
    mounted() {
      // DOM准备好时初始化组件
      setTimeout(()=> {
        this._initScroll();
      }, 20)
    },
    methods: {
      _initScroll(){
        if (!this.$refs.wrapper) {
          return;
        }
        // 创建一个scroll
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        });

        // 派发滚动事件
        if (this.listenScroll) {
          let me = this;
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos);
          });
        }

        // 派发滚动到底部事件
        if(this.pullup){
          this.scroll.on('scrollEnd',()=>{
            if(this.scroll.y<=(this.scroll.maxScrollY+50)){
              this.$emit('scrollToEnd');
            }
          });
        }

        // 派发beforeScroll事件
        if(this.beforeScroll){
          this.scroll.on('beforeScrollStart',()=>{
            this.$emit('beforeScroll');
          });
        }
      },
      // 代理并暴露一些常用接口
      enable(){
        this.scroll && this.enable();
      },
      disable(){
        this.scroll && this.disable();
      },
      refresh(){
        console.log('refresh');
        this.scroll && this.scroll.refresh();
      },
      scrollTo(){
        this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments);
      },
      scrollToElement(){
        this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments);
      }
    }
  }
</script>
