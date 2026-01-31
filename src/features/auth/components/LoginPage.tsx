import React from 'react';
import { useAuth } from '@core/auth/AuthContext';
import { useTheme } from '@core/theme/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { signInWithGoogle } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed:", error);
            alert("Firebase Sign-in failed. Please check your .env configuration.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="p-12 bg-app-bg min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
            <div className="absolute top-8 right-8">
                <button
                    onClick={toggleTheme}
                    className="p-3 bg-app-surface border border-app-border rounded-2xl shadow-lg hover:scale-110 transition-transform active:scale-95"
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                </button>
            </div>
            <div className="bg-app-surface p-12 rounded-[48px] border border-app-border shadow-2xl text-center max-w-sm w-full animate-in zoom-in duration-500">
                <div className="text-5xl mb-8 text-app-primary font-black tracking-tighter italic">MY-SHINOBI</div>
                <div className="aspect-square bg-app-bg flex items-center justify-center rounded-[32px] mb-8 text-7xl shadow-inner border border-app-border">
                    🥷
                </div>
                <h2 className="text-2xl font-bold mb-2 text-text-main">Gate of Entry</h2>
                <p className="text-text-muted mb-8 text-sm">Sign in to resume your training.</p>
                <button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    data-testid="login-button"
                    className={`w-full py-5 bg-app-primary text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-app-primary/30 transition-all active:scale-95 ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-app-primary/40 hover:-translate-y-1'}`}
                >
                    {isLoggingIn ? 'Connecting...' : 'Unlock with Google'}
                </button>
            </div>
        </div>
    );
};
