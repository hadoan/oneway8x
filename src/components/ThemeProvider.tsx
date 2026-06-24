import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ 
  children, 
  defaultTheme = "dark", 
  storageKey = "vite-ui-theme" 
}: { 
  children: ReactNode; 
  defaultTheme?: string; 
  storageKey?: string; 
}) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme={defaultTheme} 
      enableSystem 
      disableTransitionOnChange 
      storageKey={storageKey}
    >
      {children}
    </NextThemesProvider>
  );
}
