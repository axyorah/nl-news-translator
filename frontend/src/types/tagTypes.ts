import {
    TAG_LIST_QUERY,
    TAG_LIST_SUCCESS,
    TAG_LIST_FAIL,

    TAG_SELECT_QUERY,
    TAG_SELECT_SUCCESS,
    TAG_SELECT_FAIL,
    TAG_SELECT_RESET,

    TAG_CREATE_QUERY,
    TAG_CREATE_SUCCESS,
    TAG_CREATE_FAIL,
    TAG_CREATE_RESET,

    TAG_UPDATE_QUERY,
    TAG_UPDATE_SUCCESS,
    TAG_UPDATE_FAIL,
    TAG_UPDATE_RESET,

    TAG_DELETE_QUERY,
    TAG_DELETE_SUCCESS,
    TAG_DELETE_FAIL,
    TAG_DELETE_RESET

} from '../constants/tagConstants';


export interface Tag {
    id: string,
    created: string,
    owner: Number,
    name: string
}

export interface TagMinimal {
    id?: string,
    name: string
}

export interface TagListInfo {
    tagList: Tag[],
    loading?: boolean,
    errors?: string
}

export interface TagListQueryAction {
    type: typeof TAG_LIST_QUERY
}

export interface TagListSuccessAction {
    type: typeof TAG_LIST_SUCCESS,
    payload: Tag[]
}

export interface TagListFailAction {
    type: typeof TAG_LIST_FAIL,
    payload: string
}

export type TagListAction = 
    TagListQueryAction | 
    TagListSuccessAction | 
    TagListFailAction;


export interface TagSelectInfo {
    tagSelect: Tag,
    loading?: boolean,
    errors?: string
}

export interface TagSelectQueryAction {
    type: typeof TAG_SELECT_QUERY
}

export interface TagSelectSuccessAction {
    type: typeof TAG_SELECT_SUCCESS,
    payload: Tag
}

export interface TagSelectFailAction {
    type: typeof TAG_SELECT_FAIL,
    payload: string
}

export interface TagSelectResetAction {
    type: typeof TAG_SELECT_RESET
}

export type TagSelectAction = 
    TagSelectQueryAction | 
    TagSelectSuccessAction | 
    TagSelectFailAction |
    TagSelectResetAction;


export interface TagCreateInfo {
    tagCreate?: Tag,
    loading?: boolean,
    errors?: string
}

export interface TagCreateQueryAction {
    type: typeof TAG_CREATE_QUERY
}

export interface TagCreateSuccessAction {
    type: typeof TAG_CREATE_SUCCESS,
    payload: Tag
}

export interface TagCreateFailAction {
    type: typeof TAG_CREATE_FAIL,
    payload: string
}

export interface TagCreateResetAction {
    type: typeof TAG_CREATE_RESET
}

export type TagCreateAction = 
    TagCreateQueryAction | 
    TagCreateSuccessAction | 
    TagCreateFailAction |
    TagCreateResetAction;


export interface TagUpdateInfo {
    tagUpdate?: Tag,
    loading?: boolean,
    errors?: string
}

export interface TagUpdateQueryAction {
    type: typeof TAG_UPDATE_QUERY
}

export interface TagUpdateSuccessAction {
    type: typeof TAG_UPDATE_SUCCESS,
    payload: Tag
}

export interface TagUpdateFailAction {
    type: typeof TAG_UPDATE_FAIL,
    payload: string
}

export interface TagUpdateResetAction {
    type: typeof TAG_UPDATE_RESET
}

export type TagUpdateAction = 
    TagUpdateQueryAction | 
    TagUpdateSuccessAction | 
    TagUpdateFailAction |
    TagUpdateResetAction;


export interface TagDeleteInfo {
    tagDelete?: { id: string },
    loading?: boolean,
    errors?: string
}

export interface TagDeleteQueryAction {
    type: typeof TAG_DELETE_QUERY
}

export interface TagDeleteSuccessAction {
    type: typeof TAG_DELETE_SUCCESS,
    payload: { id: string }
}

export interface TagDeleteFailAction {
    type: typeof TAG_DELETE_FAIL,
    payload: string
}

export interface TagDeleteResetAction {
    type: typeof TAG_DELETE_RESET
}

export type TagDeleteAction = 
    TagDeleteQueryAction | 
    TagDeleteSuccessAction | 
    TagDeleteFailAction |
    TagDeleteResetAction;