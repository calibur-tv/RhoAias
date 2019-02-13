export default ({ app, store }) => {
  const isTencent = store.state.ua.tencent
  app.router.onReady(() => {
    app.router.beforeResolve((to, from, next) => {
      if (isTencent) {
        window.location = to.fullPath
        return next(false)
      }
      next()
    })

    app.router.afterEach((to, from) => {
      // eslint-disable-line
      _hmt.push(['_trackPageview', to.fullPath])
      M.sentry.setPageInfo(to.name)
    })
  })
}
