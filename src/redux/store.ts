import { configureStore } from '@reduxjs/toolkit';
import gameReducers from './slices/gameSlice';

const readState = localStorage.getItem('game');
let parsedState;

if(!!readState) {
  parsedState = JSON.parse(readState);
}

const store = configureStore({
  reducer: {
    game: gameReducers
  },
  preloadedState: parsedState
});

store.subscribe(() => {
  localStorage.setItem('game', JSON.stringify(store.getState()));
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => console.log(store.getState()));