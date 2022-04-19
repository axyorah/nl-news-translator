import { Dispatch } from 'redux';

import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL,
    NEWS_SELECT_QUERY,
    NEWS_SELECT_SUCCESS,
    NEWS_SELECT_FAIL,
} from '../constants/newsConstants';
import backend from '../api/backend';

import { 
    News, 
    NewsListQueryParams ,
    NewsListQueryAction,
    NewsListSuccessAction,
    NewsListFailAction,
    NewsSelectQueryAction,
    NewsSelectSuccessAction,
    NewsSelectFailAction
} from '../types/newsTypes';

interface NewsListApiResponse {
    totalResults: Number,
    articles: News[],
    message?: string
    errors?: string
}

export const getNewsList = (
    params: NewsListQueryParams
) => async (dispatch: Dispatch) => {
    const { q } = params;

    try {
        dispatch<NewsListQueryAction>({
            type: NEWS_LIST_QUERY
        });
    
        const { data } = await backend.get<NewsListApiResponse>(
            '/news/', 
            { params: { q: q } }
        );

        if (data.errors) {
            throw new Error( 
                data.errors || 'Something went wrong while fetching news'
            )
        }

        dispatch<NewsListSuccessAction>({
            type: NEWS_LIST_SUCCESS,
            payload: data.articles || []
        });
    } catch (e) {
        if (typeof e === 'string') {
            dispatch<NewsListFailAction>({
                type: NEWS_LIST_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<NewsListFailAction>({
                type: NEWS_LIST_FAIL,
                payload: e.message
            });
        } else {
            dispatch<NewsListFailAction>({
                type: NEWS_LIST_FAIL,
                payload: 'Something went wrong while fetching news list...'
            });
        }
    }
};

interface NewsSelectedApiResponse {
    paragraphs: string[],
    message?: string
    errors?: string
}

export const selectNewsItem = (item: News) => async (dispatch: Dispatch) => {
    
    const { source, url } = item;

    try {
        dispatch<NewsSelectQueryAction>({
            type: NEWS_SELECT_QUERY
        });

        const { data } =  await backend.get<NewsSelectedApiResponse>(
            '/news/selected/',
            { params: { source: source.name, url: url.toString() } }
        );

        if (data.errors) {
            throw new Error( 
                data.errors || 
                `Something went wrong while parsing news from ${url}`
            )
        }

        dispatch<NewsSelectSuccessAction>({
            type: NEWS_SELECT_SUCCESS,
            payload: data.paragraphs
        });

    } catch (e) {
        if (typeof e === 'string') {
            dispatch<NewsSelectFailAction>({
                type: NEWS_SELECT_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch<NewsSelectFailAction>({
                type: NEWS_SELECT_FAIL,
                payload: e.message
            });
        } else {
            dispatch<NewsSelectFailAction>({
                type: NEWS_SELECT_FAIL,
                payload: `Something went wrong while parsing news post from ${url} ...`
            });
        }
    }
};