import { 
    NewsListInfo, 
    NewsSelectInfo, 
    NewsTranslateInfo 
} from "./newsTypes"
import { UserLoginInfo } from "./userTypes";
import { 
    NoteListInfo, 
    NoteSelectInfo,
    NoteCreateInfo,
    NoteUpdateInfo,
    NoteDeleteInfo 
} from "./noteTypes";
import { 
    TagListInfo, 
    TagSelectInfo,
    TagCreateInfo,
    TagUpdateInfo,
    TagDeleteInfo 
} from "./tagTypes";

export interface StoreState {
    newsListInfo: NewsListInfo,
    newsSelectInfo: NewsSelectInfo,
    newsTranslateInfo: NewsTranslateInfo,

    userLoginInfo: UserLoginInfo,
    userRegisterInfo: UserLoginInfo,

    noteListInfo: NoteListInfo,
    noteSelectInfo: NoteSelectInfo,
    noteCreateInfo: NoteCreateInfo,
    noteUpdateInfo: NoteUpdateInfo,
    noteDeleteInfo: NoteDeleteInfo,

    tagListInfo: TagListInfo,
    tagSelectInfo: TagSelectInfo,
    tagCreateInfo: TagCreateInfo,
    tagUpdateInfo: TagUpdateInfo,
    tagDeleteInfo: TagDeleteInfo,
}