import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { StoreState } from './types/storeTypes';
import {
    News, NewsListAction, NewsSelectAction, NewsTranslateAction
} from './types/newsTypes';
import { UserLoginAction, UserRegisterAction } from './types/userTypes';
import { TagListAction } from './types/tagTypes';
import { 
    Note, 
    NoteListAction, 
    NoteSelectAction,
    NoteCreateAction,
    NoteUpdateAction,
    NoteDeleteAction
} from './types/noteTypes';

import { 
    newsListReducers, 
    newsSelectReducers,
    newsTranslateReducers 
} from './reducers/newsReducers';
import { 
    userLoginReducers,
    userRegisterReducers 
} from './reducers/userReducers';
import { tagListReducers } from './reducers/tagReducers';
import { 
    noteListReducers, 
    noteSelectReducers,
    noteCreateReducers,
    noteUpdateReducers,
    noteDeleteReducers 
} from './reducers/noteReducers';

const initNews: News = {
    title: '',
    url: '',
    source: { name: '' },
    description: ''
};

const initNote: Note = {
    id: '',
    owner: 0,
    created: '' ,
    side_a: '',
    side_b: '',
    tags: []
}

type Action = 
    NewsListAction | 
    NewsSelectAction | 
    NewsTranslateAction | 
    UserLoginAction |
    UserRegisterAction |
    TagListAction |
    NoteListAction | 
    NoteSelectAction |
    NoteUpdateAction |
    NoteDeleteAction;


const reducer = combineReducers<StoreState>({
    newsListInfo: newsListReducers,
    newsSelectInfo: newsSelectReducers,
    newsTranslateInfo: newsTranslateReducers,
    userLoginInfo: userLoginReducers,
    userRegisterInfo: userRegisterReducers,
    tagListInfo: tagListReducers,
    noteListInfo: noteListReducers,
    noteSelectInfo: noteSelectReducers,
    noteCreateInfo: noteCreateReducers,
    noteUpdateInfo: noteUpdateReducers,
    noteDeleteInfo: noteDeleteReducers
});

const userDetailFromStorage = localStorage.getItem('userDetail')
    ? JSON.parse(localStorage.getItem('userDetail') || '')
    : null;

const initialState: StoreState = {
    newsListInfo: { newsList: [] },
    newsSelectInfo: { newsSelected: initNews },
    newsTranslateInfo: { newsTranslated: initNews },
    userLoginInfo: { userDetail: userDetailFromStorage },
    userRegisterInfo: {},
    tagListInfo: { tagList: [] },
    noteListInfo: { noteListDetail: { noteList: [], page: 0, numPages: 0 } },
    noteSelectInfo: { noteSelect: initNote },
    noteCreateInfo: {},
    noteUpdateInfo: {},
    noteDeleteInfo: {}
};

const middleware = [thunk];

const store = createStore<StoreState, Action, unknown, unknown>(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
