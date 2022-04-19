import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL,
    NEWS_SELECT_QUERY,
    NEWS_SELECT_SUCCESS,
    NEWS_SELECT_FAIL
} from '../constants/newsConstants';

import {
    NewsListAction,
    NewsListInfo,
    NewsSelectAction,
    NewsSelectInfo
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

export const newsSelectReducers = (
    state: NewsSelectInfo = { paragraphs: [] },
    action: NewsSelectAction
) => {
    switch (action.type) {
        case NEWS_SELECT_QUERY:
            return {
                loading: true
            };

        case NEWS_SELECT_SUCCESS:
            return {
                loading: false,
                paragraphs: action.payload
            };

        case NEWS_SELECT_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        default:
            return state;
    }
};