import { createContext, useContext, useState, ReactNode } from 'react';

interface CategoryContextType {
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categoryId, setCategoryId] = useState<string | null>(null);

  return (
    <CategoryContext.Provider value={{ categoryId, setCategoryId }}>
      {children}
    </CategoryContext.Provider>
  );
};
