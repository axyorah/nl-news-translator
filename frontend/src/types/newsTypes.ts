import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL
} from '../constants/newsConstants';

export interface News {
    title: string,
    description: string,
    url: string,
    source: string
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