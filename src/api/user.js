import $http from '@/util/httpRequest'

const baseUrl = '/api'

/**
 * 登录
 */
export const login = (params) => $http({
    url: $http.adornUrl(baseUrl+'/login'),
    method: 'post',
    data: $http.adornData(params)
})

/**
 * 登出
 */
export const logoff = () => $http({
    url: $http.adornUrl(baseUrl+'/logoff'),
    method: 'get',
    params: $http.adornParams({})
})

/**
 * 账号注册
 */
export const register = (params) => $http({
    url: $http.adornUrl(baseUrl+'/register'),
    method: 'post',
    data: $http.adornData(params)
})

/**
 * 修改密码
 */
export const changePwd = (pwd) => $http({
    url: $http.adornUrl(baseUrl+'/changePwd'),
    method: 'get',
    params: $http.adornParams({
        pwd: pwd
    })
})