import $http from '@/util/httpRequest'

const baseUrl = '/api'

/**
 * 上传文档
 */
export const upload = (params) => $http({
    url: $http.adornUrl(baseUrl+'/upload'),
    method: 'post',
    data: $http.adornData(params)
})
