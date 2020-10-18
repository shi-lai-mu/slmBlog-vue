<template>
  <li :class="[ 'slm', 'blog-themes', $store.state.themes.mainBColor ]" @click.self="showPopup = !showPopup">
    <Masks :styleList="styleList" :show="!showPopup" @close="() => showPopup = false">
      <div class="popup-box">
        <h4 class="popup-title">
          自定义主题皮肤
        </h4>
        <div class="popup-tips">管理字体大小、颜色和背景。这些设置会影响此浏览器上，如果登录账号将同步到云端。</div>
        <div class="popup-content">
          <div class="row-box">
            <span>字体大小</span>
            <div class="row-content slider-box">
              <i class="slm blog-Aa"></i>
              <a-slider
                class="font-size-slider"
                :marks="ThemesConfig.fontSize.marks"
                :min="ThemesConfig.fontSize.min"
                :max="ThemesConfig.fontSize.max"
                :defaultValue="ThemesConfig.fontSize.current"
                @change="fontSizeChang"/>
              <i class="slm blog-Aa big-Aa"></i>
            </div>
          </div>
          <div class="row-box">
            <span>颜色</span>
            <div class="row-content">
              <a-radio-group :default-value="ThemesConfig.color.current" size="large" class="themes-color-group">
                <a-radio-button
                  class="themes-color-item"
                  v-for="(item, index) in ThemesConfig.color.list"
                  :key="index"
                  :value="index"
                  @click="toggleMainColor(index, item.color)">
                  <div class="color-round" :style="`background-color: ${item.color}`">
                    <i class="slm blog-xuanzhong" v-show="ThemesConfig.color.current === index"></i>
                  </div>
                  <i :class="`slm blog-${item.icon}`" :style="`color: ${item.color}`"></i>
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div class="row-box">
            <span>背景</span>
            <div class="row-content"> 
              <a-radio-group :default-value="ThemesConfig.backgroundColor.current" size="large" class="themes-bgcolor-group">
                <a-radio-button
                  class="themes-bgcolor-item"
                  v-for="(item, index) in ThemesConfig.backgroundColor.list"
                  :key="index"
                  :value="index">
                  <div class="color-round" :style="`background-color: ${item.color}; color: ${item.fontColor}`">
                    {{ item.name }}<i class="slm blog-xuanzhong"></i>
                  </div>
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
        </div>
        <div :class="[ 'button', 'submit-btn', $store.state.themes.mainBColor ]" @click="() => showPopup = false">确定</div>
      </div>
    </Masks>
  </li>
</template>  

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator';
import Masks from '~/components/Masks.vue';

@Component({
  components: {
    Masks,
  },
})
export default class HeaderThemes extends Vue {
  styleList: any = {};
  /**
   * 是否显示弹窗
   */
  showPopup: boolean = false;

  /**
   * 皮肤配置
   */
  get ThemesConfig() {
    return this.$config.themes;
  }


  created() {
    const { isMobile } = this.$store.state;
    this.styleList.marginLeft = isMobile ? '0' : '-5vw';
  }

  mounted() {
    // 初始化本地配置信息
    const { ThemesConfig } = this;
    if (ThemesConfig.isLocalUpdate) {
      const callFn = {
        fontSize: {
          fn: 'fontSizeChang',
        },
        color: {
          fn: 'toggleMainColor',
          cb: (val, arr) => [ val, arr.list[val].color ],
        },
      };
      Object.keys(ThemesConfig).forEach(key => {
        const targetFn = callFn[key];
        if (targetFn) {
          const currentConifg = ThemesConfig[key];
          const params = targetFn.cb ? targetFn.cb(currentConifg.current, currentConifg) : [ currentConifg.current ];
          this[targetFn.fn].apply(this, [...params, false]);
        }
      });
    }
  }


  @Watch('$store.state.isMobile')
  isMobileUpdate(val) {
    this.styleList.marginLeft = val ? '0' : '-5vw';
    this.$forceUpdate();
  }


  /**
   * 切换UI主题色
   */
  toggleAntdThemes(color: string) {
    window.less
      .modifyVars({
        '@primary-color': color,
        '@link-color': color,
        '@btn-primary-bg': color
      })
      .then(() => {
        console.log('成功')
      })
      .catch(error => {
        alert('失败')
        console.log(error)
      })
    ;
    return true;
  }


  /**
   * slider修改文字大小时
   */
  fontSizeChang(fontsize: number, storage: boolean = true) {
    const root: any = document.getElementsByTagName('html')[0];
    root.style = `font-size: ${fontsize}px`;
    if (storage) this.$config.themes.fontSize.current = fontsize;
  }


  /**
   * 切换主题色
   */
  toggleMainColor(colorName: string, color16: string, storage: boolean = true) {
    this.$store.commit('setThemesMainColor', colorName);
    if (storage) {
      this.toggleAntdThemes(color16);
      this.$config.themes.color.current = colorName;
    } else {
      const { less }: any = window;
      // 对应 index.js 等待 less.min.js 加载完成执行cb传入params
      if (less.modifyVars) {
        this.toggleAntdThemes(color16);
      } else {
        less.cb = this.toggleAntdThemes.bind(this);
        less.params = color16;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-box {
  width: 50vw;
  padding: 0 10px;
  max-width: 600px;
  min-width: 350px;
  font-size: .8rem;
  text-align: center;
  @include themify($themes) {
    color: themed('font-lv1-color');
  }
  box-sizing: border-box;

  .popup-title {
    margin: 1rem 0 .3rem;
    font-size: 1.3rem;
    @include themify($themes) {
      color: themed('font-color');
    }
  }

  .popup-content {
    text-align: left;
    padding: 15px 10px 10px;
    @include themify($themes) {
      color: themed('font-lv1-color');
    }
  }
  
  .row-box {
    margin-bottom: 10px;

    .row-content {
      margin-top: .5rem;
      padding: 10px;
      @include themify($themes) {
        background-color: themed('main-bg-f1-color');
      }
      border-radius: 15px;
    }
  }

  .submit-btn {
    display: inline-block;
    width: 5rem;
    margin-bottom: 20px;
    @include themify($themes) {
      color: themed('font-color');
    }
  }

  // 文字大小拖动选择器
  .slider-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .blog-Aa {
      font-size: 1rem;
      margin: 0 10px;
    }

    .big-Aa {
      font-size: 2rem;
      vertical-align: text-bottom;
    }

    .font-size-slider {
      width: 100%;
      margin-bottom: 14px;
    }
  }

  // 主题颜色选择器
  .themes-color-group,
  .themes-bgcolor-group {
    display: flex;
    justify-content: space-between;

    .themes-color-item,
    .themes-bgcolor-item {
      height: auto;
      width: 100%;
      text-align: center;
      background-color: transparent;
      border: 0;
      box-shadow: none;

      &::before {
        display: none;
      }

      &:hover {
        border: 0 !important;
        box-shadow: none;
      }

      &:focus-within {
        outline: none;
      }
      
      .color-round {
        display: flex;
        width: 50px;
        height: 50px;
        margin: 0 auto;
        color: #FFF;
        border-radius: 50%;
        align-items: center;
        justify-content: center;

        & + .slm {
          display: inline-block;
          transform: translateY(5px);
        }
      }

      .slm {
        font-size: 1.5rem;
      }
    }

    .themes-bgcolor-item {
      .color-round {
        width: 100%;
        height: 70px;
        border: 1px solid;
        border-radius: 10px;

        &:hover {
          border-color: #FFAD1F;
        }
      }
      
      .slm {
        display: flex;
        width: 1.1rem;
        height: 1.1rem;
        margin-left: 10px;
        font-size: .6rem;
        border: 1px solid;
        border-radius: 50%;
        justify-content: center;
        align-items: center;

        &::before {
          display: none;
        }
      }

      &.ant-radio-button-wrapper-checked .slm::before {
        display: block;
      }
    }
  }
}

.layout-default-mobile {
  .themes-color-group {
    flex-wrap: wrap;

    .themes-color-item {
      width: 33.33%;
      margin-bottom: 20px;
    }
  }
}
  
/deep/ .ant-radio-button-wrapper,
/deep/ .ant-slider-mark-text-active {
  color: #8899a6;
}
</style>