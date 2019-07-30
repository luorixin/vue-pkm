import variables from '@/assets/styles/element-variables.scss'
import Util from '@/util'

const state = {
    theme: variables.theme,
    collapse: false,
    currentMenu: 'home',
    menusList: [],
    hospitals: [],
    currentTag: 'home',
    tagsList: []
}

const mutations = {
  changeTheme (state, mainTheme) {
      state.theme = mainTheme;
      Util.setStore('theme', state.theme);
  },
  changeCollapse (state, collapse) {
      state.collapse = collapse;
      Util.setStore('collapse', state.collapse);
  },
  setMenusList (state, list) {
      state.menusList = list;
  },
  setCurrentMenu (state, currentMenu) {
      state.currentMenu = currentMenu;
      Util.setStore('currentMenu', state.currentMenu);
  },
  setTagsList (state, list) {
      state.tagsList = list;
      Util.setStore('tagsList', state.tagsList);
  },
  setCurrentTag (state, currentTag) {
      state.currentTag = currentTag;
      Util.setStore('currentTag', state.currentTag);
  }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}