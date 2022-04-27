import { 
    NewsListInfo, 
    NewsSelectInfo, 
    NewsTranslateInfo 
} from "./newsTypes"
import { UserLoginInfo } from "./userTypes";
import { TagListInfo } from "./tagTypes";
import { 
    NoteListInfo, 
    NoteSelectInfo,
    NoteCreateInfo,
    NoteUpdateInfo,
    NoteDeleteInfo 
} from "./noteTypes";

export interface StoreState {
    newsListInfo: NewsListInfo,
    newsSelectInfo: NewsSelectInfo,
    newsTranslateInfo: NewsTranslateInfo,
    userLoginInfo: UserLoginInfo,
    userRegisterInfo: UserLoginInfo,
    tagListInfo: TagListInfo,
    noteListInfo: NoteListInfo,
    noteSelectInfo: NoteSelectInfo,
    noteCreateInfo: NoteCreateInfo,
    noteUpdateInfo: NoteUpdateInfo,
    noteDeleteInfo: NoteDeleteInfo
}