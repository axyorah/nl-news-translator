import { Dispatch } from 'redux';

import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL
} from '../constants/newsConstants';
import backend from '../api/backend';

import { 
    News, 
    NewsListQueryParams ,
    NewsListQueryAction,
    NewsListSuccessAction,
    NewsListFailAction
} from '../types/newsTypes';

interface NewsApiResponse {
    data: {
        totalResults: Number,
        articles: News[],
        message?: string
    },
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
    
        const res = await backend.get<NewsApiResponse>('/news/', {
            params: { q: q }
        });

        const { data } = res;

        if (res.status >= 400 || data.errors) {
            throw new Error( data.errors || (data.data && data.data.message) || 'Something went wrong while fetching news')
        }

        dispatch<NewsListSuccessAction>({
            type: NEWS_LIST_SUCCESS,
            payload: data.data.articles
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