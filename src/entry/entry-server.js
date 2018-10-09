import { createApp } from "~/app.js";

export default ssrContext => {
  const { app, router, store } = createApp();
  const meta = app.$meta();

  return new Promise((resolve, reject) => {
    router.push(ssrContext.url);
    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ code: 404 });
      }
      const ctx = ssrContext.ctx;
      const routerMatched = router.currentRoute.matched;
      const useAuth = routerMatched.some(record => record.meta.useAuth);
      const mustAuth = routerMatched.some(record => record.meta.mustAuth);
      const mustAdmin = routerMatched.some(record => record.meta.mustAdmin);
      try {
        if (mustAuth || mustAdmin) {
          await store.dispatch("initAuth", {
            ctx,
            must: true,
            admin: mustAdmin
          });
        }
        const matched = matchedComponents.map(
          ({ asyncData }) =>
            asyncData &&
            asyncData({
              ctx,
              store,
              route: router.currentRoute
            })
        );
        if (useAuth) {
          matched.unshift(
            store.dispatch("initAuth", {
              ctx,
              must: false,
              admin: false
            })
          );
        }
        await Promise.all(matched);
      } catch (e) {
        reject(e);
      }
      ssrContext.state = store.state;
      ssrContext.meta = meta;
      resolve(app);
    }, reject);
  });
};
