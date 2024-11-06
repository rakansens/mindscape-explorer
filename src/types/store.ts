// ストアの型定義を集約
export interface StoreState {
  isDirty: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface StoreActions {
  setDirty: (isDirty: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
} 