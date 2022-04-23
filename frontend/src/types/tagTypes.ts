import {
    TAG_LIST_QUERY,
    TAG_LIST_SUCCESS,
    TAG_LIST_FAIL
} from '../constants/tagConstants';


export interface Tag {
    id: string,
    created: string,
    owner: Number,
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