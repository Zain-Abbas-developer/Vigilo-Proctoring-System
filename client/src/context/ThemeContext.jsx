import { createContext, useContext, useEffect, useState } from "react";

const themeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);


    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <themeContext.Provider value={{ darkMode, setDarkMode , toggleDarkMode }}>
            {children}
        </themeContext.Provider>
    );
};

export const useTheme = () => useContext(themeContext);