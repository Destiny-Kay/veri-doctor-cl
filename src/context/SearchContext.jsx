import { createContext, useContext, useState } from "react";

const SearchContext = createContext()


export const SearchProvider = ({children}) => {
    const [searchResults, setSearchResults] = useState(null)

    return (
        <SearchContext.Provider value={{searchResults, setSearchResults}}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch = () => useContext(SearchContext)
