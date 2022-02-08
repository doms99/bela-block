import { TypedUseSelectorHook, useDispatch as providedDispatch, useSelector as providedSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => providedDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = providedSelector;