import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/test/fx/login/userLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'test/fx/login/userVerify',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'test/fx/login/userLoginOut',
    method: 'post'
  })
}

export function validUser(data) {
  return request({
    url: 'test/fx/user/validUser',
    method: 'post',
    data
  })
}