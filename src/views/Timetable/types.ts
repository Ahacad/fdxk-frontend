/* eslint-disable camelcase */
/** 原始上课时间段结构体（来自 JSON 文件） */
export interface RawTimeSlot {
  /** 课程 Id */
  cid: number;
  /** 课时范围，1-2 对应第一至第二节课 */
  section: string;
  /** 上课地点 */
  place: string;
  /** 星期几，1 对应星期一 */
  day: number;
  /** 上课周语义描述 */
  week: string;
}

/** 原始课程数据结构体（来自 JSON 文件） */
export interface RawCourse {
  /** 学期 */
  semester: string;
  /** 开课院系 */
  department: string;
  /** 时间段 */
  time_slot: RawTimeSlot[];
  /** 校区 */
  campus: string;
  /** 课程代码 */
  code: string;
  /** 分类 */
  category: string;
  /** 学分 */
  credit: number;
  /** 考试类型 */
  exam_type: string;
  /** 考试时间 */
  exam_time: string;
  /** Id */
  id: number;
  /** 课程名 */
  name: string;
  /** 课程序号 */
  code_id: string;
  /** 备注 */
  remark: string;
  /** 教师，用 , 分隔 */
  teachers: string;
  /** 周学时 */
  week_hour: number;
  /** 是否可以期中退课 */
  drop: boolean;
  /** 选课人数上限 */
  max_student: number;
}

/** 课程 ID 到数据映射集 */
export type AllCourses = { [id: number]: RawCourse };

/** 课程搜索索引项 - 开课时间段 */
export interface SearchIndexItemTimeSlot {
  /** 起止周 */
  week: string;
  /** 星期 */
  day: number;
  /** 节次 */
  section: [number, number];
  /** 上课地点 */
  place: string;
  /** 星期（汉字） */
  dayText: string;
}

/** 课程搜索索引项 */
export interface SearchIndexItem {
  /** 课程名 */
  name: string;
  /** 授课教师 */
  teachers: string[];
  /** 开课院系 */
  department: string;
  /** 上课时间段 */
  timeSlots: SearchIndexItemTimeSlot[];
  /** 课程序号 */
  codeId: string;
  /** 课程 Id */
  courseId: number;
  /** 授课教师（字符串化） */
  teachersText: string;
  /** 上课时间段（字符串化） */
  timeSlotsTexts: string[];
}

/** 课时数据 */
export interface Section extends RawCourse {
  /** 当前课时数据 */
  currentSlot: RawTimeSlot;
}

/** 课时 key 到课时数据映射集 */
export type Sections = { [key: string]: Section };

/** 课程详情信息（展示用） - 上课时间段 */
export interface CourseDetailInfoTimeSlot {
  /** 起止周 */
  week: string;
  /** 星期 */
  day: string;
  /** 节次 */
  section: [number, number];
  /** 上课地点 */
  place: string;
}

/** 课程详情信息（展示用） */
export interface CourseDetailInfo {
  /** 课程序号 */
  codeId: string;
  /** 课程名称 */
  name: string;
  /** 学分 */
  credit: number;
  /** 周课时数 */
  sectionCount: number;
  /** 人数上限 */
  maxStudent: number;
  /** 开课院系 */
  department: string;
  /** 校区 */
  campus: string;
  /** 备注 */
  remark: string;
  /** 考试时间 */
  examTime: string;
  /** 考试类型 */
  examType: string;
  /** 是否允许期中退课 */
  drop: string;
  /** 开课时间段 */
  timeSlots: CourseDetailInfoTimeSlot[];
  /** 授课教师 */
  teachers: string;
}

/** 已选课程列表项 */
export interface SelectedCourse {
  /** lesson Id */
  id: number;
  /** 课程名称 */
  name: string;
  /** 授课教师 */
  teachers: string[];
  /** 课程代码 */
  code: string;
}
