import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@core/theme/ThemeContext';
import { useTheme } from '@core/theme/ThemeContext';

/**
 * MAIN APP COMPONENT
 * Wraps the application in core providers for Theme, Auth, and Progression.
 */

function ThemeDebug() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="p-8 bg-app-bg min-h-screen text-text-main transition-colors duration-300">
            <div className="max-w-md mx-auto bg-app-surface p-6 rounded-2xl border border-app-border shadow-lg">
                <h1 className="text-2xl font-bold mb-4">My-Shinobi Project</h1>
                <p className="text-text-muted mb-6">
                    Theme Engine Active. Current Mode: <span className="font-bold text-app-primary uppercase">{theme}</span>
                </p>
                <button
                    onClick={toggleTheme}
                    className="px-6 py-2 bg-app-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
                >
                    Toggle Light/Dark
                </button>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ThemeDebug />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}
