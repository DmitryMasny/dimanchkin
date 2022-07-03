import { Context, createContext } from 'react';


export type StoreContextType = {
    heroes?: null
};

const StoreContext: Context<StoreContextType | null> = createContext<StoreContextType | null>(null);

export default StoreContext;
