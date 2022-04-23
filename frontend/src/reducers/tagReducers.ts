import {
    TAG_LIST_QUERY,
    TAG_LIST_SUCCESS,
    TAG_LIST_FAIL
} from '../constants/tagConstants';
import {
    Tag,
    TagListInfo,
    TagListAction
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

