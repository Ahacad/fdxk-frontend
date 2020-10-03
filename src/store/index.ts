import { createStore } from 'vuex';
import storage from '@/utils/localStorage';

export type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** 需要持久化保存的 state */
const persistedState = ['user', 'profile', 'selectedCoursesIds', 'selectedSectionsByDay'];

const store = createStore({
  state: {
    breakpoint: 'xs' as BreakpointType,
    user: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      jwt_token: '',
      id: '',
      name: '',
      bio: '',
      avatar: '',
      nickName: '',
      email: '',
    },
    profile: {
      notifications: [],
      trends: [],
      userStar: [],
      userRate: [],
      follower: [],
      following: [],
      history: [],
    },
    detailPageCourse: {},
    secret: {
      posts: [],
      postsMapping: [],
    },
    lectures: [],
    /** 是否自动云同步过 */
    hasFetchedSelectedCourses: false,
    isDetailPageCourseDeleted: false,
    isDetailDialogVisible: false,

    isGlobalMessageVisible: false,
    globalMessageColor: 'info',
    globalMessageTimeout: 2500,
    globalMessageText: '',
    globalMessageTimer: -1,
    // globalMessageIcon: '',

    selectedCoursesIds: {} as { [key: string]: any },
    // 仅缓存用户打开 Timetable 会加载的第一个页面的内容
    selectedSectionsByDay: [{}, {}, {}, {}, {}, {}, {}],
    hoveredCourseId: -1,

    // localStorage 中保存的 state
    ...storage.getVuexStates(),
  },
  mutations: {
    SET_JWT_TOKEN(state, token) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      state.user.jwt_token = token;
      const payload = decodeURIComponent(escape(window.atob(token.split('.')[1])));
      state.user.id = JSON.parse(payload).sub;
      // log.info('set jwt_token', token);
    },
    SET_USER(state, payload: { name: string; email: string }) {
      state.user.name = payload.name;
      state.user.email = payload.email;
    },
    LOGOUT(state) {
      // log.info('LOGOUT');
      // eslint-disable-next-line @typescript-eslint/camelcase
      state.user.jwt_token = '';
      state.user.name = '未登录';
      state.user.email = '';
      state.hasFetchedSelectedCourses = false;
    },
    SET_USER_PROFILE(state, profile) {
      state.user.avatar = profile.avatar;
      state.user.bio = profile.bio;
      state.user.nickName = profile.nickName;
    },
    SET_HISTORY(state, history) {
      state.profile.history = history;
    },
    showDetailDialog(state) {
      state.isDetailDialogVisible = true;
    },
    hideDetailDialog(state) {
      state.isDetailDialogVisible = false;
    },
    changeDetailPageContent(state, course) {
      state.detailPageCourse = course;
      state.isDetailPageCourseDeleted = false;
    },
    onDeleteDetailPageCourse(state) {
      state.isDetailPageCourseDeleted = true;
    },
    onRestoreDetailPageCourse(state) {
      state.isDetailPageCourseDeleted = false;
    },

    sendGlobalMessage(state, action) {
      state.globalMessageText = action.text || '';
      state.globalMessageColor = action.color || 'info';
      // -1 表示不自动关闭
      state.globalMessageTimeout = action.timeout || 2500;
      state.isGlobalMessageVisible = true;
      state.globalMessageTimer += 1;
    },
    hideGlobalMessage(state) {
      state.isGlobalMessageVisible = false;
    },
    clearGlobalMessageTimer(state) {
      state.globalMessageTimer = -1;
    },

    setSelectedCourses(
      state,
      payload: { semester: string; selectedCoursesIds: number[]; selectedSectionsByDay: any[] },
    ) {
      state.selectedSectionsByDay = payload.selectedSectionsByDay;
      state.selectedCoursesIds[payload.semester] = [...payload.selectedCoursesIds];
    },
    setHoveredCourseId(state, courseId) {
      state.hoveredCourseId = courseId;
    },
    resetHoveredCourseId(state) {
      state.hoveredCourseId = -1;
    },
    setHasFetchedSelectedCourses(state) {
      state.hasFetchedSelectedCourses = true;
    },
    /** 设置断点 */
    setBreakpoint(state, newBreakpoint: BreakpointType) {
      state.breakpoint = newBreakpoint;
    },
  },
  getters: {
    userLoggedIn: (state) => state.user.jwt_token !== '',
  },
});

// 监听需要持久化保存的 state，在变化时存入 localStorage
persistedState.forEach((stateKey) => {
  store.watch(
    (state) => state[stateKey],
    (newValue) => {
      storage.setVuexState(stateKey, newValue);
    },
    {
      deep: true,
    },
  );
});

export default store;