/**
 * AVATAR REGISTRY
 * A collection of available hero icons for identity customization.
 * Future expansions could link these to specific achievements or shop unlocks.
 */

export interface Avatar {
    id: string;
    url: string;
    label: string;
    minLevel: number;
}

export const AVATARS: Avatar[] = [
    { id: 'ninja-1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', label: 'Swift Shadow', minLevel: 1 },
    { id: 'ninja-2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden', label: 'Crimson Blade', minLevel: 1 },
    { id: 'ninja-3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', label: 'Elder Sage', minLevel: 5 },
    { id: 'ninja-4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha', label: 'Dragon Spirit', minLevel: 10 },
    { id: 'ninja-5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight', label: 'Night Stalker', minLevel: 15 },
    { id: 'ninja-6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Snow', label: 'Frost Blade', minLevel: 20 },
];
