import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { StoreState } from './types/storeTypes';
import {
    News, NewsListAction, NewsSelectAction, NewsTranslateAction
} from './types/newsTypes';
import { UserLoginAction, UserRegisterAction } from './types/userTypes';
import { 
    Tag, 
    TagListAction, 
    TagSelectAction,
    TagCreateAction,
    TagUpdateAction,
    TagDeleteAction 
} from './types/tagTypes';
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
import { 
    noteListReducers, 
    noteSelectReducers,
    noteCreateReducers,
    noteUpdateReducers,
    noteDeleteReducers 
} from './reducers/noteReducers';
import { 
    tagListReducers, 
    tagSelectReducers,
    tagCreateReducers,
    tagUpdateReducers,
    tagDeleteReducers 
} from './reducers/tagReducers';

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

const initTag: Tag = {
    id: '',
    owner: 0,
    created: '',
    name: ''
};

type Action = 
    NewsListAction | 
    NewsSelectAction | 
    NewsTranslateAction | 
    
    UserLoginAction |
    UserRegisterAction |
    
    NoteListAction | 
    NoteSelectAction |
    NoteCreateAction |
    NoteUpdateAction |
    NoteDeleteAction |
    
    TagListAction | 
    TagSelectAction |
    TagCreateAction |
    TagUpdateAction |
    TagDeleteAction;


const reducer = combineReducers<StoreState>({
    newsListInfo: newsListReducers,
    newsSelectInfo: newsSelectReducers,
    newsTranslateInfo: newsTranslateReducers,
    
    userLoginInfo: userLoginReducers,
    userRegisterInfo: userRegisterReducers,

    noteListInfo: noteListReducers,
    noteSelectInfo: noteSelectReducers,
    noteCreateInfo: noteCreateReducers,
    noteUpdateInfo: noteUpdateReducers,
    noteDeleteInfo: noteDeleteReducers,

    tagListInfo: tagListReducers,
    tagSelectInfo: tagSelectReducers,
    tagCreateInfo: tagCreateReducers,
    tagUpdateInfo: tagUpdateReducers,
    tagDeleteInfo: tagDeleteReducers,
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
    
    noteListInfo: { noteListDetail: { noteList: [], page: 0, numPages: 0 } },
    noteSelectInfo: { noteSelect: initNote },
    noteCreateInfo: {},
    noteUpdateInfo: {},
    noteDeleteInfo: {},

    tagListInfo: { tagList: [] },
    tagSelectInfo: { tagSelect: initTag },
    tagCreateInfo: {},
    tagUpdateInfo: {},
    tagDeleteInfo: {},
};

const middleware = [thunk];

const store = createStore<StoreState, Action, unknown, unknown>(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
