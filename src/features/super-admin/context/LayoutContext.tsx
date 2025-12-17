'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
    isFullscreen: boolean;
    setFullscreen: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
    isFullscreen: false,
    setFullscreen: () => {},
});

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [isFullscreen, setFullscreen] = useState(false);

    return (
        <LayoutContext.Provider value={{ isFullscreen, setFullscreen }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    return useContext(LayoutContext);
}
