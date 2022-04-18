import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL
} from '../constants/newsConstants';
import backend from '../api/backend';

import { NewsListQueryParams } from '../types/newsTypes';


export const getNewsList = (params: NewsListQueryParams) => async (dispatch: any) => {
    const { q } = params;

    try {
        dispatch({
            type: NEWS_LIST_QUERY
        });
    
        const { data: { data } } = await backend.get('/news/', {
            params: { q: q }
        });

        dispatch({
            type: NEWS_LIST_SUCCESS,
            payload: data.articles
        });
    } catch (e) {
        if (typeof e === 'string') {
            dispatch({
                type: NEWS_LIST_FAIL,
                payload: e
            });
        } else if ( e instanceof Error ) {
            dispatch({
                type: NEWS_LIST_FAIL,
                payload: e.message
            });
        } else {
            dispatch({
                type: NEWS_LIST_FAIL,
                payload: 'Something went wrong while fetching news list...'
            });
        }
    }
};