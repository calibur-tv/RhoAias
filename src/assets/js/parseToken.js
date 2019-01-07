export default ctx => {
  if (!ctx) {
    return ''
  }
  const isClient = typeof window !== 'undefined'
  if (isClient && window.__JWT_TOKEN__) {
    return window.__JWT_TOKEN__
  }
  let token = ''
  if (isClient) {
    token = ctx.$store
      ? ctx.$store.state.login
        ? ctx.$store.state.user.token
        : ''
      : ctx
    window.__JWT_TOKEN__ = token
    return token
  }
  const authHeader = ctx.header['authorization']
  if (authHeader) {
    token = authHeader.split('Bearer ')[1]
  }
  const cookies = ctx.header.cookie
  if (cookies) {
    cookies.split('; ').forEach(item => {
      const temp = item.split('=')
      if (temp[0] === 'JWT-TOKEN') {
        token = temp[1]
      }
    })
  }
  return token
}
