import Api from "~/api/bangumiApi";
import ScoreApi from "~/api/scoreApi";

export default {
  namespaced: true,
  state: () => ({
    follows: null,
    released: [],
    timeline: {
      list: [],
      year: new Date().getFullYear(),
      noMore: false
    },
    category: {
      list: [],
      noMore: false,
      page: 0,
      take: 10,
      total: 0
    },
    tags: [],
    info: null,
    videos: {
      id: 0,
      list: [],
      total: 0,
      has_season: false
    },
    cartoon: {
      page: 0,
      take: 12,
      sort: "desc",
      total: 0,
      list: [],
      noMore: false
    },
    topPosts: [],
    topFetchedId: false,
    score: null,
    scoreFetchId: 0
  }),
  mutations: {
    selectTag(state, index) {
      const tag = state.tags[index];
      tag.selected = !tag.selected;
      state.tags[index] = tag;
    },
    SET_FOLLOW(state, { result }) {
      state.info.followed = result;
      result ? state.info.count_like++ : state.info.count_like--;
    },
    SET_RELEASED(state, data) {
      state.released = data;
    },
    SET_TIMELINE(state, data) {
      const temp = state.timeline;
      state.timeline.list = temp.list.concat(data.list);
      state.timeline.year = temp.year - 1;
      state.timeline.noMore = data.noMore;
    },
    SET_TAGS(state, { tags, id }) {
      const ids = id ? id.split("-") : undefined;
      tags.forEach((tag, index) => {
        tags[index].selected = ids
          ? ids.indexOf(tag.id.toString()) !== -1
          : false;
      });
      state.tags = tags;
    },
    SET_CATEGORY(state, data) {
      state.category.list = state.category.list.concat(data.list);
      state.category.noMore = data.noMore;
      state.category.total = data.total;
      state.category.page++;
    },
    SET_TOP_POST(state, { data, id }) {
      state.topFetchedId = id;
      state.topPosts = data;
    },
    SET_BANGUMI_INFO(state, data) {
      state.info = data;
    },
    SET_VIDEOS(state, { data, id }) {
      state.videos.id = id;
      state.videos.list = data.videos;
      state.videos.total = data.total;
      state.videos.has_season = data.has_season;
    },
    SET_BANGUMI_CARTOON(state, data) {
      state.cartoon.list = state.cartoon.list.concat(data.list);
      state.cartoon.noMore = data.noMore;
      state.cartoon.total = data.total;
      state.cartoon.page = state.cartoon.page + 1;
    },
    REVERSE_CARTOON(state, { sort }) {
      state.cartoon.list = state.cartoon.list.reverse();
      state.cartoon.sort = sort;
    },
    RESET_CARTOON(state, { sort }) {
      state.cartoon = {
        page: 0,
        take: 12,
        sort,
        total: 0,
        list: [],
        noMore: false
      };
    },
    SET_BANGUMI_SCORE(state, { id, data }) {
      state.score = data;
      state.scoreFetchId = id;
    }
  },
  actions: {
    async getTags({ state, commit }, { id, ctx }) {
      if (state.tags.length) {
        return;
      }
      const api = new Api(ctx);
      const tags = await api.tags();
      tags && commit("SET_TAGS", { tags, id });
    },
    async getBangumi({ state, commit }, { ctx, id }) {
      if (state.info && state.info.id === +id) {
        return;
      }
      const api = new Api(ctx);
      const data = await api.show(id);
      data && commit("SET_BANGUMI_INFO", data);
    },
    async getVideos({ state, commit }, { id, ctx }) {
      if (state.videos.id && state.videos.id === id) {
        return;
      }
      const api = new Api(ctx);
      const data = await api.videos(id);
      commit("SET_VIDEOS", { data, id });
    },
    async follow({ commit, rootState }, { ctx, id }) {
      const api = new Api(ctx);
      const followed = await api.follow(id);
      commit("SET_FOLLOW", {
        followed,
        self: {
          id: rootState.user.id,
          zone: rootState.user.zone,
          avatar: rootState.user.avatar,
          nickname: rootState.user.nickname
        }
      });
    },
    async getReleased({ state, commit }, ctx) {
      if (state.released.length) {
        return;
      }
      const api = new Api(ctx);
      const data = await api.released();
      data && commit("SET_RELEASED", data);
    },
    async getTimeline({ state, commit }, ctx) {
      if (state.timeline.noMore) {
        return;
      }
      const api = new Api(ctx);
      const data = await api.timeline({
        year: state.timeline.year
      });
      data && commit("SET_TIMELINE", data);
    },
    async getCategory({ state, commit }, { id, ctx }) {
      const api = new Api(ctx);
      const data = await api.category({
        id,
        page: state.category.page,
        take: state.category.take
      });
      data && commit("SET_CATEGORY", data);
    },
    async getCartoons({ state, commit }, { ctx, bangumiId }) {
      const api = new Api(ctx);
      const data = await api.cartoon({
        bangumiId,
        page: state.cartoon.page,
        take: state.cartoon.take,
        sort: state.cartoon.sort
      });
      data && commit("SET_BANGUMI_CARTOON", data);
    },
    async changeCartoonSort({ state, commit }, { ctx, bangumiId, sort }) {
      if (state.cartoon.noMore) {
        commit("REVERSE_CARTOON", { sort });
        return;
      }
      commit("RESET_CARTOON", { sort });
      const api = new Api(ctx);
      const data = await api.cartoon({
        take: state.cartoon.take,
        page: 0,
        bangumiId,
        sort
      });
      data && commit("SET_BANGUMI_CARTOON", data);
    },
    async getTopPosts({ state, commit }, { ctx, id }) {
      if (state.topFetchedId === id) {
        return;
      }
      const api = new Api(ctx);
      const data = await api.getTopPosts({ id });
      commit("SET_TOP_POST", { data, id });
    },
    async getBangumiScore({ state, commit }, { ctx, id }) {
      if (state.score && state.scoreFetchId === id) {
        return;
      }
      const api = new ScoreApi(ctx);
      const data = await api.bangumiScore(id);
      commit("SET_BANGUMI_SCORE", { data, id });
    }
  },
  getters: {}
};
