export default req => {
  const isClient = typeof window !== 'undefined'
  if (isClient && window.__JWT_TOKEN__) {
    return window.__JWT_TOKEN__
  }
  let token = ''
  const cookies = isClient ? document.cookie : req ? req.headers.cookie : ''
  if (cookies) {
    cookies.split('; ').forEach(item => {
      const temp = item.split('=')
      if (temp[0] === 'JWT-TOKEN') {
        token = temp[1]
      }
    })
  }
  const authHeader = req ? req.headers['authorization'] : ''
  if (authHeader) {
    token = authHeader.split('Bearer ')[1]
  }
  if (isClient) {
    window.__JWT_TOKEN__ = token
  }
  return token
}
