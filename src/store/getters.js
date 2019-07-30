const getters = {
  sidebar: state => state.common.sidebar,
  token: state => state.user.token,
  name: state => state.user.name,
}
export default getters