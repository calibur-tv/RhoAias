export const getQuestionInfo = (ctx, { id }) => {
  return ctx.$axios.$get(`question/qaq/${id}/show`)
}

export const createQuestion = (
  ctx,
  { title, tags, content, images, intro, geetest }
) => {
  return ctx.$axios.$post('question/qaq/create', {
    title,
    tags,
    content,
    images,
    intro,
    geetest
  })
}

export const deleteAnswer = (ctx, { id }) => {
  return this.http.post(`question/soga/${id}/delete`)
}
