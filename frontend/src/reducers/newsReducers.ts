import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL
} from '../constants/newsConstants';

import {
    NewsListAction,
    NewsListInfo
} from '../types/newsTypes';


const initialState: NewsListInfo = {
    newsList: []
};

export const newsListReducers = (
    state: NewsListInfo = initialState,
    action: NewsListAction
) => {
    switch (action.type) {
        case NEWS_LIST_QUERY:
            return {
                ...state,
                loading: true,
                errors: null,
                newsList: []
            };

        case NEWS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                errors: null,
                newsList: action.payload
            };

        case NEWS_LIST_FAIL:
            return {
                ...state,
                loading: false,
                errors: action.payload,
                newsList: []
            };
            
        default:
            return state;
    }
};