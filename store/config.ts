import $cookie from 'js-cookie';
import defaultsDeep from 'lodash/defaultsDeep';

import { StoreOptions } from 'vuex';
import { GlobalTool } from '@/utils/tool';
import { isServer } from '@/config/system';
import { themesdefaultConfig } from '@/config/themes';
import { saveUserConfig } from '@/core/service/data/user';
import { color as ThemesConfigColor } from '@/config/themes';
import { webSetting, WebSettingService, _WEB_CONFIG_VERSION_ } from '@/config/websetting';

let saveUserConfigClock = null;

export const stateData = {
  /**
   * 网站位置
   */
  setting: {
    /**
     * 站点版本
     */
    version: _WEB_CONFIG_VERSION_,
    /**
     * 主题设置
     */
    theme: themesdefaultConfig,
    /**
     * 网站设置
     */
    web: webSetting,
    /**
     * 配置项
     */
    config: {
      /**
       * 主题配置
       */
      theme: {},
    }
  },
  /**
   * 定时器下标
   */
  clock: {
    /**
     * 保存用户配置
     */
    saveUserConfig: null,
  }
}

export const configModule: StoreOptions<typeof stateData> = {
  state: () => stateData,
  mutations: {
    /**
     * 设置站点参数
     */
    setWebOptions(state, payload) {
      if (payload.version !== undefined && payload.version !== _WEB_CONFIG_VERSION_) {
        payload = state.setting;
      }
      state.setting = WebSettingService.deepExtends(payload, state.setting);
      const config = GlobalTool.excludeKey(defaultsDeep({}, state.setting), ['title', 'description', 'type', 'config']);
      delete config.config;

      if (isServer) return false;
  
      clearTimeout(saveUserConfigClock);
      saveUserConfigClock = setTimeout(async () => {
        await saveUserConfig(config);
        $cookie.set('web', JSON.stringify(config), { expires: 365 });
      }, 1000);
      
      if (typeof saveUserConfigClock === 'number') {
        state.clock.saveUserConfig = saveUserConfigClock;
      }
    },

    /**
     * 设置主题色
     */
    setThemesMainColor(_state, payload) {
      this.commit('setWebOptions',  {
        theme: {
          color: payload,
        }
      });
    },

    /**
     * 设置配置项
     */
    setConfig(state, payload) {
      state.setting.config = {
        ...state.setting.config,
        ...payload,
      };
    },
  },
  getters: {
    /**
     * 获取主题色16进制
     */
    webMainThemes16Color: state => {
      return ThemesConfigColor.list[state.setting.theme.color].color;
    }
  },
  actions: {},
};

export default configModule;