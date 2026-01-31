import React from 'react';
import { Achievement } from '@/types/progression';
import { Trophy, Star, Shield, Zap, Target } from 'lucide-react';

/**
 * BADGE VAULT
 * Displays the collection of earned achievements.
 */

interface Props {
    unlocked: Achievement[];
}

export const BadgeVault: React.FC<Props> = ({ unlocked }) => {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
            {unlocked.length > 0 ? (
                unlocked.map((badge) => (
                    <div
                        key={badge.id}
                        className="flex flex-col items-center gap-2 group cursor-help"
                        title={`${badge.name}: ${badge.description}`}
                    >
                        <div className="w-12 h-12 bg-app-accent/10 text-app-accent border border-app-accent/20 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-app-accent group-hover:text-white transition-all">
                            <AchievementIcon name={badge.icon} />
                        </div>
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter text-center line-clamp-1">{badge.name}</p>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-6 text-center">
                    <p className="text-sm font-bold text-text-muted italic">No badges earned yet... Keep training!</p>
                </div>
            )}
        </div>
    );
};

const AchievementIcon = ({ name }: { name: string }) => {
    switch (name.toLowerCase()) {
        case 'trophy': return <Trophy size={20} />;
        case 'star': return <Star size={20} />;
        case 'shield': return <Shield size={20} />;
        case 'zap': return <Zap size={20} />;
        case 'target': return <Target size={20} />;
        default: return <Star size={20} />;
    }
};
