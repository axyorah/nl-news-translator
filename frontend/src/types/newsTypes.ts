import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL,
    NEWS_SELECT_QUERY,
    NEWS_SELECT_SUCCESS,
    NEWS_SELECT_FAIL
} from '../constants/newsConstants';

export interface News {
    title: string,
    description: string,
    url: string,
    source: {
        name: string,
    }
}

export interface NewsListQueryParams {
    q?: string,
    category_list?: string[],
    from_date?: string,
    to_date?: string
};

export interface NewsListInfo {
    newsList: News[],
    loading?: string,
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

export type NewsListAction = 
    NewsListQueryAction | 
    NewsListSuccessAction | 
    NewsListFailAction;

export interface NewsSelectInfo {
    paragraphs: string[],
    loading?: string,
    errors?: string
}

export interface NewsSelectQueryAction {
    type: typeof NEWS_SELECT_QUERY
}

export interface NewsSelectSuccessAction {
    type: typeof NEWS_SELECT_SUCCESS,
    payload: string[]
}

export interface NewsSelectFailAction {
    type: typeof NEWS_SELECT_FAIL,
    payload: string
}

export type NewsSelectAction = 
    NewsSelectQueryAction | 
    NewsSelectSuccessAction | 
    NewsSelectFailAction;