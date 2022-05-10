import { Dispatch } from 'redux';
import { dispatchErrorForAction } from '../utils/errorUtils';

import {
    NEWS_LIST_QUERY,
    NEWS_LIST_SUCCESS,
    NEWS_LIST_FAIL,

    NEWS_SELECT_QUERY,
    NEWS_SELECT_SUCCESS,
    NEWS_SELECT_FAIL,
    NEWS_SELECT_RESET,

    NEWS_TRANSLATE_QUERY,
    NEWS_TRANSLATE_SUCCESS,
    NEWS_TRANSLATE_FAIL,
    NEWS_TRANSLATE_RESET,
} from '../constants/newsConstants';
import backend from '../api/backend';

import { 
    News, 
    NewsListQueryParams,

    NewsListQueryAction,
    NewsListSuccessAction,
    NewsListFailAction,

    NewsSelectQueryAction,
    NewsSelectSuccessAction,
    NewsSelectFailAction,

    NewsTranslateQueryAction,
    NewsTranslateSuccessAction,
    NewsTranslateFailAction,
    NewsTranslateResetAction,
    NewsSelectResetAction
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
    const { q, category_list } = params;

    try {
        // clear old selected news item and translations
        dispatch<NewsSelectResetAction>({
            type: NEWS_SELECT_RESET
        });

        dispatch<NewsTranslateResetAction>({
            type: NEWS_TRANSLATE_RESET
        });

        // fetch a new list of news items
        dispatch<NewsListQueryAction>({
            type: NEWS_LIST_QUERY
        });
    
        const { data } = await backend.get<NewsListApiResponse>(
            '/news/', 
            { params: { q: q, category_list: category_list?.join(',') } }
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
        dispatchErrorForAction<NewsListFailAction, typeof NEWS_LIST_FAIL>(
            dispatch, e, NEWS_LIST_FAIL
        );
    }
};

interface NewsSelectedApiResponse {
    paragraphs: string[]
    message?: string
    errors?: string
}

export const selectNewsItem = (item: News) => async (dispatch: Dispatch) => {
    
    const { source, url } = item;

    try {
        // clear old new item translations
        dispatch<NewsTranslateResetAction>({
            type: NEWS_TRANSLATE_RESET
        });

        // fetch new new item
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

        const sentences: string[] = [];
        data.paragraphs.forEach((paragraph: string) => {
            paragraph.split('. ').forEach((sentence: string) =>{
                if (sentence && sentence.length) {
                    sentences.push(sentence);
                }
            });
        });

        dispatch<NewsSelectSuccessAction>({
            type: NEWS_SELECT_SUCCESS,
            payload: {
                ...item,
                sentences: sentences
            }
        });

    } catch (e) {
        dispatchErrorForAction<NewsSelectFailAction, typeof NEWS_SELECT_FAIL>(
            dispatch, e, NEWS_SELECT_FAIL
        );        
    }
};

interface NewsTranslatedApiResponse {
    translations: string[],
    message?: string
    errors?: string
}

export const translateNewsItem = (item: News) => async (dispatch: Dispatch) => {
    const { url, sentences } = item;

    try {
        dispatch<NewsTranslateQueryAction>({
            type: NEWS_TRANSLATE_QUERY
        });

        const { data } = await backend.post<NewsTranslatedApiResponse>(
            'news/translate/',
            { 'sentences': sentences }
        );

        if (data.errors) {
            throw new Error( 
                data.errors || 
                `Something went wrong while translating news from ${url}`
            )
        }

        dispatch<NewsTranslateSuccessAction>({
            type: NEWS_TRANSLATE_SUCCESS,
            payload: { 
                ...item, 
                translations: data.translations
            }
        });

    } catch (e) {
        dispatchErrorForAction<NewsTranslateFailAction, typeof NEWS_TRANSLATE_FAIL>(
            dispatch, e, NEWS_TRANSLATE_FAIL
        );        
    }
};