import React from 'react';
import { clsx } from 'clsx';

/**
 * MASTERY GAUGE
 * Visualizes the Bayesian probability (0.0 - 1.0) as a "Signal Strength" meter.
 * Part of the Intelligence Radar - transforms complex math into a readable UI.
 */

interface MasteryGaugeProps {
    probability: number;
    label?: string;
}

export const MasteryGauge: React.FC<MasteryGaugeProps> = ({ probability, label }) => {
    // Convert 0.0-1.0 to a percentage for CSS
    const percent = Math.round(probability * 100);

    // Determine color based on threshold
    // Amber (Initial) -> Blue (Consolidating) -> Acccent/Green (Mastered)
    const getStatusColor = () => {
        if (probability >= 0.85) return 'bg-app-accent'; // Mastered
        if (probability >= 0.50) return 'bg-app-primary'; // Consolidating
        return 'bg-amber-500'; // Initial/Weak (Warning: don't use raw hex, but amber is a standard TW color available)
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-text-main">{label}</span>
                <span className={clsx("text-[10px] font-black tracking-widest uppercase", probability >= 0.85 ? "text-app-accent" : "text-text-muted")}>
                    {percent}% SIGNAL
                </span>
            </div>
            <div className="h-3 w-full bg-app-border rounded-full overflow-hidden flex gap-0.5 p-0.5 shadow-inner">
                {/* We divide the bar into segments to look like a digital radar/meter */}
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "h-full flex-1 rounded-sm transition-all duration-700",
                            (percent / 10) > i ? getStatusColor() : "bg-app-bg"
                        )}
                        style={{ transitionDelay: `${i * 50}ms` }}
                    />
                ))}
            </div>
        </div>
    );
};
