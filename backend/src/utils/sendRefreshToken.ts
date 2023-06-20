const { Response } = require('express')

export function sendRefreshToken(res: any, token: string) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: true,
    path: '/api/v1/authentication',
  })
}