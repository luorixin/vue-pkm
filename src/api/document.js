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
 * 添加/修改文档
 */
export const optDocument = (params) => $http({
    url: $http.adornUrl(baseUrl+'/optDocument'),
    method: 'post',
    data: $http.adornData(params)
})
