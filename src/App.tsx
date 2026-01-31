import { ThemeProvider } from '@core/theme/ThemeContext';
import { AuthProvider } from '@core/auth/AuthContext';
import { IntelligenceProvider } from '@core/engine/IntelligenceContext';
import { SessionProvider } from '@core/engine/SessionContext';
import { ProgressionProvider } from '@core/engine/ProgressionContext';
import { MissionProvider } from '@features/progression/context/MissionContext';
import { AppRouter } from './AppRouter';

/**
 * MAIN APP COMPONENT
 * Bootstraps all contextual providers and hands off control to the AppRouter.
 */

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <IntelligenceProvider>
                    <ProgressionProvider>
                        <MissionProvider>
                            <SessionProvider>
                                <AppRouter />
                            </SessionProvider>
                        </MissionProvider>
                    </ProgressionProvider>
                </IntelligenceProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
