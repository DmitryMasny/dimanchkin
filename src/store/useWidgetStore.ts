import { useContext } from 'react';

import StoreContext, { StoreContextType } from './storeContext';

const useStore = (): StoreContextType => {
    const store = useContext(StoreContext);

    if (!store) throw new Error('useStore must be used within StoreProvider');

    return store;
};

export default useStore;
