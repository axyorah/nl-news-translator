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
                loading: true,
                newsList: []
            };

        case NEWS_LIST_SUCCESS:
            return {
                loading: false,
                newsList: action.payload
            };

        case NEWS_LIST_FAIL:
            return {
                loading: false,
                errors: action.payload,
                newsList: []
            };
        
        case NEWS_LIST_RESET:
            return {
                newsList: []
            }
            
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
                loading: true,
                newsSelected: newsSelectedInit
            };

        case NEWS_SELECT_SUCCESS:
            return {
                loading: false,
                newsSelected: action.payload
            };

        case NEWS_SELECT_FAIL:
            return {
                loading: false,
                errors: action.payload,
                newsSelected: newsSelectedInit
            };

        case NEWS_SELECT_RESET:
            return {
                newsSelected: newsSelectedInit
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
    sentences: [],
    translations: []
}

export const newsTranslateReducers = (
    state: NewsTranslateInfo = { newsTranslated: newsTranslatedInit },
    action: NewsTranslateAction
) => {
    switch (action.type) {
        case NEWS_TRANSLATE_QUERY:
            return {
                loading: true,
                newsTranslated: newsTranslatedInit
            };

        case NEWS_TRANSLATE_SUCCESS:
            return {
                loading: false,
                newsTranslated: action.payload
            };

        case NEWS_TRANSLATE_FAIL:
            return {
                loading: false,
                errors: action.payload,
                newsTranslated: newsTranslatedInit
            };

        case NEWS_TRANSLATE_RESET:
            return {
                newsTranslated: newsTranslatedInit
            }

        default:
            return state;
    }
};