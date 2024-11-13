// store.js
import {configureStore} from '@reduxjs/toolkit';
import counterSlice from './slices/counterSlice';
import nameSlice from './slices/nameSlice';
import langSlice from './slices/langSlices';
import adsOpenSlice from './slices/adsOpenSlice';
import adsRemoteSlice from './slices/adsRemoteSlice';
import premiumSlice from './slices/premiumSlice';
import startChatSlice from './slices/startChatSlice';
import chatSlice from './slices/chatDataSlice';
import keyScanSlice from './slices/keyScanSlice';
import categorySlice from './slices/categorySlice';
import plantStorageSlice from './slices/plantStorageSlice';
import routeSlice from './slices/routeSlice';
import reminderStorageSlice from './slices/reminderStorageSlice';
import reminderSlice from './slices/reminderSlice';
import keyAiSlice from './slices/keyAiSlice';
import rewardCountSlice from './slices/rewardCountSlice';
import interCountSlice from './slices/interCount';
import keySearchSlice from './slices/keySearchSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    name: nameSlice,
    lang: langSlice,
    adsOpen: adsOpenSlice,
    adsRemote: adsRemoteSlice,
    premium: premiumSlice,
    startChat: startChatSlice,
    chat: chatSlice,
    keyScan: keyScanSlice,
    category: categorySlice,
    plantStorage: plantStorageSlice,
    route: routeSlice,
    reminderStorage: reminderStorageSlice,
    reminder: reminderSlice,
    keyAi: keyAiSlice,
    rewardCount: rewardCountSlice,
    interCount: interCountSlice,
    keySearch: keySearchSlice,
  },
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];
