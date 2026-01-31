// Example Interface Structure
export interface Atom {
    id: string;
    title: string;
    type: 'conceptual' | 'procedural' | 'transfer';
    prerequisites: string[]; // IDs of other atoms
    status: 'DRAFT' | 'LIVE';
}

export interface Chapter {
    id: string;
    title: string;
    atoms: Atom[];
}

export interface Subject {
    id: string;
    name: string;
    grade: number;
    chapters: Chapter[];
}