export const downloadUrl = (ctx, { type }) => {
  return ctx.$axios.$get('app/version/check', {
    params: { type, version: '0.0.0' }
  })
}
