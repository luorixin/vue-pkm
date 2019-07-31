import $http from '@/util/httpRequest'

const baseUrl = '/api'

/**
 * 文档列表
 */
export const documentList = (params) => $http({
    url: $http.adornUrl(baseUrl+'/documentList'),
    method: 'post',
    data: $http.adornData(params)
})

/**
 * 添加文档
 */
export const documentCreate = (params) => $http({
    url: $http.adornUrl(baseUrl+'/documentCreate'),
    method: 'post',
    data: $http.adornData(params)
})
