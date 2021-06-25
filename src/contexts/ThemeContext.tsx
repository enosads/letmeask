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
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const storagedTheme = localStorage.getItem('theme');
        return (storagedTheme ?? 'light') as Theme;
    });

    function toggleTheme() {
        const theme = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(theme);
        localStorage.setItem('theme', theme);
    }

    return (
        <ThemeContext.Provider value={{theme: currentTheme, toggleTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}