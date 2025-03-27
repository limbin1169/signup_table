import React, { createContext, useContext } from "react";
import { CoreStore, coreStore } from "./CoreStore";

interface CoreProviderProps {
  children: React.ReactNode;
}

const CoreStoreContext = createContext<CoreStore>(coreStore);

export const CoreProvider: React.FC<CoreProviderProps> = ({ children }) => {
  return (
    <CoreStoreContext.Provider value={coreStore}>
      {children}
    </CoreStoreContext.Provider>
  );
};

export const useCoreStore = (): CoreStore => useContext(CoreStoreContext);
