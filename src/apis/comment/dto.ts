import { CommentItem } from './types';

/** GET comments Resp */
export interface GetCommentsRespDto {
  /** 列表数据 */
  data: CommentItem[];
}

/** POST comments Req */
export interface PostCommentsReqDto {
  /** 回复内容 */
  content: string;
  /** 点评 ID */
  id: string;
}

/** POST comments Resp */
export interface PostCommentsRespDto {
  data: CommentItem[];
}

/** PUT comments/:id Req */
export interface PutCommentsIdReqDto {
  /** 回复内容 */
  content: string;
  /** 点评 ID */
  id: string;
}

/** PUT comments/:id Resp */
export interface PutCommentsIdRespDto {
  /** 当前修改的回复 */
  data: CommentItem;
}

/** DELETE comments/:id Resp */
export interface DeleteCommentsIdRespDto {
  /** 回复列表 */
  data: CommentItem[];
}
