import {
    TAG_LIST_QUERY,
    TAG_LIST_SUCCESS,
    TAG_LIST_FAIL,

    TAG_SELECT_QUERY,
    TAG_SELECT_SUCCESS,
    TAG_SELECT_FAIL,
    TAG_SELECT_RESET,

    TAG_CREATE_QUERY,
    TAG_CREATE_SUCCESS,
    TAG_CREATE_FAIL,
    TAG_CREATE_RESET,

    TAG_UPDATE_QUERY,
    TAG_UPDATE_SUCCESS,
    TAG_UPDATE_FAIL,
    TAG_UPDATE_RESET,

    TAG_DELETE_QUERY,
    TAG_DELETE_SUCCESS,
    TAG_DELETE_FAIL,
    TAG_DELETE_RESET
} from '../constants/tagConstants';
import {
    Tag,
    TagMinimal,
    TagListInfo,
    TagListAction,
    TagSelectInfo,
    TagSelectAction,
    TagCreateInfo,
    TagCreateAction,
    TagUpdateInfo,
    TagUpdateAction,
    TagDeleteInfo,
    TagDeleteAction
} from '../types/tagTypes';


const initTag: Tag = {
    id: '',
    created: '',
    owner: 0,
    name: ''
};


export const tagListReducers = (
    state: TagListInfo = { tagList: []}, action: TagListAction
) => {
    switch (action.type) {
        case TAG_LIST_QUERY:
            return {
                loading: true,
                tagList: []
            };

        case TAG_LIST_SUCCESS:
            return {
                loading: false,
                tagList: action.payload
            };

        case TAG_LIST_FAIL:
            return {
                loading: false,
                errors: action.payload,
                tagList: []
            };

        default:
            return state;
    }
}


export const tagSelectReducers = (
    state: TagSelectInfo = { tagSelect: initTag}, action: TagSelectAction
) => {
    switch (action.type) {
        case TAG_SELECT_QUERY:
            return {
                loading: true,
                tagSelect: initTag
            };

        case TAG_SELECT_SUCCESS:
            return {
                loading: false,
                tagSelect: action.payload
            };

        case TAG_SELECT_FAIL:
            return {
                loading: false,
                errors: action.payload,
                tagSelect: initTag
            };

        case TAG_SELECT_RESET:
            return {
                tagSelect: initTag
            };

        default:
            return state;
    }
}


export const tagCreateReducers = (
    state: TagCreateInfo = {}, action: TagCreateAction
) => {
    switch (action.type) {
        case TAG_CREATE_QUERY:
            return {
                loading: true,
            };

        case TAG_CREATE_SUCCESS:
            return {
                loading: false,
                tagCreate: action.payload
            };

        case TAG_CREATE_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        case TAG_CREATE_RESET:
            return {};

        default:
            return state;
    }
}


export const tagUpdateReducers = (
    state: TagUpdateInfo = {}, action: TagUpdateAction
) => {
    switch (action.type) {
        case TAG_UPDATE_QUERY:
            return {
                loading: true,
            };

        case TAG_UPDATE_SUCCESS:
            return {
                loading: false,
                tagCreate: action.payload
            };

        case TAG_UPDATE_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        case TAG_UPDATE_RESET:
            return {};

        default:
            return state;
    }
}


export const tagDeleteReducers = (
    state: TagDeleteInfo = {}, action: TagDeleteAction
) => {
    switch (action.type) {
        case TAG_DELETE_QUERY:
            return {
                loading: true,
            };

        case TAG_DELETE_SUCCESS:
            return {
                loading: false,
                tagDelete: action.payload
            };

        case TAG_DELETE_FAIL:
            return {
                loading: false,
                errors: action.payload
            };

        case TAG_DELETE_RESET:
            return {};

        default:
            return state;
    }
}