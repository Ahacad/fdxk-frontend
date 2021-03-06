import { createStore } from 'vuex';
import { localStorage, sessionStorage } from '@/utils/storage';
import { Sections } from '@/views/Timetable/types';
import { RateForm } from '@/components/listCard';

/** 需要持久化保存的 state */
const persistedState = {
  localStorage: [
    'user',
    'semester',
    'selectedCoursesIds',
    'selectedSectionsByDay',
    'lastSawChangeLogDate',
  ],
  sessionStorage: ['ratingForms'],
};

const store = createStore({
  state: {
    user: {
      jwtToken: '',
      id: '',
      email: '',
      name: '',
      nickname: '',
      avatar: '',
      bio: '',
      fans: 0,
      watchers: 0,
      watchees: 0,
    },
    detailPageCourse: {},
    lectures: [],
    /** 最后一次查看的课表学期 */
    semester: '2020-2021学年2学期',
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

    selectedCoursesIds: {} as { [key: string]: number[] },
    // 仅缓存用户打开 Timetable 会加载的第一个页面的内容
    selectedSectionsByDay: [{}, {}, {}, {}, {}, {}, {}] as Sections[],
    hoveredCourseId: -1,

    /** 点评表单页缓存 */
    ratingForms: {} as { [lectureId: string]: RateForm },

    /** 最后一次看过的更新日志 date */
    lastSawChangeLogDate: '',

    // storage 中保存的 state
    ...localStorage.getVuexStates(),
    ...sessionStorage.getVuexStates(),
  },
  mutations: {
    setJwtToken(state, token) {
      state.user.jwtToken = token;
      const payload = decodeURIComponent(escape(window.atob(token.split('.')[1])));
      state.user.id = JSON.parse(payload).sub.toString();
    },
    setUser(state, payload: { name: string; email: string }) {
      state.user.name = payload.name;
      state.user.email = payload.email;
    },
    logout(state) {
      // log.info('logout');
      state.user.jwtToken = '';
      state.user.name = '';
      state.user.nickname = '';
      state.user.id = '';
      state.user.email = '';
      state.hasFetchedSelectedCourses = false;
    },
    setUserProfile(state, profile) {
      state.user.avatar = profile.avatar;
      state.user.bio = profile.bio;
      state.user.nickname = profile.nickname;
      state.user.name = profile.name;
      state.user.fans = profile.fans;
      state.user.watchers = profile.watchers;
      state.user.watchees = profile.watchees;
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
    setSemester(state, semester) {
      state.semester = semester;
    },
    setSelectedCourses(
      state,
      payload: {
        semester: string;
        selectedCoursesIds: number[];
        selectedSectionsByDay: Sections[];
      },
    ) {
      state.selectedSectionsByDay = payload.selectedSectionsByDay;
      state.selectedCoursesIds[payload.semester] = payload.selectedCoursesIds;
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
    /** 设置 ratingForms */
    setRatingForm(state, payload: { lectureId: string; formData: RateForm }) {
      const { lectureId, formData } = payload;
      state.ratingForms[lectureId] = formData;
    },
    /** 设置 lastSawChangeLogDate */
    setLastSawChangeLogDate(state, value) {
      state.lastSawChangeLogDate = value;
    },
  },
  getters: {
    userLoggedIn: (state) => !!state.user.jwtToken,
  },
});

// 监听需要持久化保存的 state，在变化时存入 storage
persistedState.localStorage.forEach((stateKey) => {
  store.watch(
    (state) => state[stateKey],
    (newValue) => {
      localStorage.setVuexState(stateKey, newValue);
    },
    {
      deep: true,
    },
  );
});
persistedState.sessionStorage.forEach((stateKey) => {
  store.watch(
    (state) => state[stateKey],
    (newValue) => {
      sessionStorage.setVuexState(stateKey, newValue);
    },
    {
      deep: true,
    },
  );
});

export default store;
