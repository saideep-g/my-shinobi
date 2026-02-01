import React from 'react';
import { Users, BookOpen, ClipboardList, ShieldAlert, Zap } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const stats = [
        { label: 'Total Students', value: '42', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Active Sessions', value: '12', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Content Health', value: '94%', icon: ShieldAlert, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Reviews', value: '5', icon: ClipboardList, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header>
                <h2 className="text-4xl font-black tracking-tighter">Command Dashboard</h2>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mt-2">Real-time educational oversight</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-app-surface border border-app-border p-8 rounded-[40px] shadow-sm flex items-center gap-6">
                        <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-[24px] flex items-center justify-center shadow-inner`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-text-main leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-app-surface border border-app-border p-10 rounded-[48px] shadow-sm">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                        <Zap className="text-indigo-500" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-app-bg/50 rounded-2xl border border-app-border">
                                <div className="w-2 h-2 rounded-full bg-app-primary" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Student #A{i} completed multiplication-tables</p>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-wider mt-0.5">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-app-surface border border-app-border p-10 rounded-[48px] shadow-sm">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                        <BookOpen className="text-emerald-500" /> Curriculum Pulse
                    </h3>
                    <div className="h-48 flex items-end gap-3 px-4">
                        {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-xl relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-xl transition-all duration-1000"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-app-surface border border-app-border px-2 py-1 rounded-lg text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-4 text-[8px] font-black text-text-muted uppercase tracking-widest">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </section>
            </div>
        </div>
    );
};
