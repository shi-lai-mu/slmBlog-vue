export default {
  /**
   * 设置客户端标识
   */
  setClientUA(state, data) {
    state.isMobile = data;
  },

  /**
   * 是否正在显示遮罩层
   */
  maskUpdate(state, data) {
    state.isMask = data;
  },

  /**
   * 初始化滚动条
   */
  initGeminiScrollbar(state, data) {
    state.body.GeminiScrollbar = data;
    console.log(data);
  },

  /**
   * 初始化用户数据
   */
  initUser(state, data) {
    state.user = data;
  },

  /**
   * 设定JWT
   */
  setJWT(state, data) {
    state.jwt = data;
  }
}