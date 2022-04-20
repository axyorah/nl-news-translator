import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL,

    NEWS_SELECT_QUERY,
    NEWS_SELECT_SUCCESS,
    NEWS_SELECT_FAIL,
    
    NEWS_TRANSLATE_QUERY,
    NEWS_TRANSLATE_SUCCESS,
    NEWS_TRANSLATE_FAIL
} from '../constants/newsConstants';

import {
    NewsListAction,
    NewsListInfo,
    NewsSelectAction,
    NewsSelectInfo,
    NewsTranslateAction,
    NewsTranslateInfo
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

const newsSelectedInit = {
    title: '',
    url: '',
    description: '',
    source: { name: '' }
}

export const newsSelectReducers = (
    state: NewsSelectInfo = { newsSelected: newsSelectedInit },
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
                newsSelected: action.payload
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

const newsTranslatedInit = {
    title: '',
    url: '',
    description: '',
    source: { name: '' },
    paragraphs: []
}

export const newsTranslateReducers = (
    state: NewsTranslateInfo = { newsTranslated: newsTranslatedInit },
    action: NewsTranslateAction
) => {
    switch (action.type) {
        case NEWS_TRANSLATE_QUERY:
            return {
                loading: true
            };

        case NEWS_TRANSLATE_SUCCESS:
            return {
                loading: false,
                newsTranslated: action.payload
            };

        case NEWS_TRANSLATE_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        default:
            return state;
    }
};