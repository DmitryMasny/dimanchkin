import { FC, PropsWithChildren } from 'react';

import StoreContext from './storeContext';

const StoreProvider: FC<PropsWithChildren<{}>> = ({ children }) => {

    const store = {

    }

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
