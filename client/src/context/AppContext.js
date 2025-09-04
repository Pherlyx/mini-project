import { useContext } from "react";


const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {
    const BASE_URL = 'http://localhost:5000';
    return (
        <AppContext.Provider value={{ BASE_URL }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    return useContext(AppContext);
}