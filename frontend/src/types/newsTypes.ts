import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL,
    NEWS_LIST_RESET,

    NEWS_SELECT_QUERY,
    NEWS_SELECT_SUCCESS,
    NEWS_SELECT_FAIL,
    NEWS_SELECT_RESET,
    
    NEWS_TRANSLATE_QUERY,
    NEWS_TRANSLATE_SUCCESS,
    NEWS_TRANSLATE_FAIL,
    NEWS_TRANSLATE_RESET
} from '../constants/newsConstants';

export interface News {
    title: string,
    description: string,
    url: string,
    source: {
        name: string,
    },
    paragraphs?: string[],
    sentences?: string[],
    translations?: string[]
}

export interface NewsListQueryParams {
    q?: string,
    category_list?: string[],
    from_date?: string,
    to_date?: string
};

export interface NewsListInfo {
    newsList: News[],
    loading?: boolean,
    errors?: string
}

export interface NewsListQueryAction {
    type: typeof NEWS_LIST_QUERY
}

export interface NewsListSuccessAction {
    type: typeof NEWS_LIST_SUCCESS,
    payload: News[]
}

export interface NewsListFailAction {
    type: typeof NEWS_LIST_FAIL,
    payload: string
}

export interface NewsListResetAction {
    type: typeof NEWS_LIST_RESET
}

export type NewsListAction = 
    NewsListQueryAction | 
    NewsListSuccessAction | 
    NewsListFailAction |
    NewsListResetAction;

export interface NewsSelectInfo {
    newsSelected: News,
    loading?: boolean,
    errors?: string
}

export interface NewsSelectQueryAction {
    type: typeof NEWS_SELECT_QUERY
}

export interface NewsSelectSuccessAction {
    type: typeof NEWS_SELECT_SUCCESS,
    payload: News
}

export interface NewsSelectFailAction {
    type: typeof NEWS_SELECT_FAIL,
    payload: string
}

export interface NewsSelectResetAction {
    type: typeof NEWS_SELECT_RESET
}

export type NewsSelectAction = 
    NewsSelectQueryAction | 
    NewsSelectSuccessAction | 
    NewsSelectFailAction |
    NewsSelectResetAction;

export interface NewsTranslateInfo {
    newsTranslated: News,
    loading?: boolean,
    errors?: string
}

export interface NewsTranslateQueryAction {
    type: typeof NEWS_TRANSLATE_QUERY
}

export interface NewsTranslateSuccessAction {
    type: typeof NEWS_TRANSLATE_SUCCESS,
    payload: News
}

export interface NewsTranslateFailAction {
    type: typeof NEWS_TRANSLATE_FAIL,
    payload: string
}

export interface NewsTranslateResetAction {
    type: typeof NEWS_TRANSLATE_RESET
}

export type NewsTranslateAction = 
    NewsTranslateQueryAction | 
    NewsTranslateSuccessAction | 
    NewsTranslateFailAction |
    NewsTranslateResetAction;