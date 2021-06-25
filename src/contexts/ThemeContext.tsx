import {createContext, ReactNode, useState} from "react";

type Theme = 'light' | 'dark';

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
}

interface ThemeContextProviderProps {
    children: ReactNode;
}

export function ThemeProvider(props: ThemeContextProviderProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

    function toggleTheme() {
        setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{theme: currentTheme, toggleTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}