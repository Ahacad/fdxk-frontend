import { LessonItemDto } from './types';

/** GET selects Resp */
export interface GetSelectsRespDto {
  /** 课程列表 */
  data: LessonItemDto[];
}

/** PUT selects Req */
export interface PutSelectsReqDto {
  id: string[];
  semester: string;
}

/** POST selects Req */
export interface PostSelectsReqDto {
  id: string;
  semester: string;
}

/** DELETE selects Req */
export interface DeleteSelectsReqDto {
  id: string;
  semester: string;
}
