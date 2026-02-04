"use client";
import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Video, Instagram, Linkedin, Twitter, MessageSquare, Send, Hash, Smartphone, UserCircle2, GripHorizontal } from 'lucide-react';


interface ContactPreviewProps {
    previewSrc: string | null;
}

type TabType = 'apple' | 'social' | 'chat';
type SocialApp = 'instagram' | 'twitter' | 'linkedin';
type ChatApp = 'whatsapp' | 'telegram' | 'slack';

export const ContactPreview: React.FC<ContactPreviewProps> = ({ previewSrc }) => {
    const [activeTab, setActiveTab] = useState<TabType>('apple');
    const [socialApp, setSocialApp] = useState<SocialApp>('instagram');
    const [chatApp, setChatApp] = useState<ChatApp>('whatsapp');

    const Avatar = ({ size = "w-16 h-16", className = "" }: { size?: string, className?: string }) => (
        <div className={`${size} rounded-full bg-slate-800 shrink-0 overflow-hidden relative ${className}`}>
            {previewSrc ? (
                <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500 font-bold">
                    JD
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Live Previews
                </h3>
            </div>

            {/* Main Category Tabs */}
            <div className="flex p-1 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm mb-6">
                {(['apple', 'social', 'chat'] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
              flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize flex items-center justify-center gap-2
              ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}
            `}
                    >
                        {tab === 'apple' && <Smartphone size={14} />}
                        {tab === 'social' && <UserCircle2 size={14} />}
                        {tab === 'chat' && <MessageSquare size={14} />}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="relative min-h-[400px]">

                {/* === APPLE TAB === */}
                {activeTab === 'apple' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* iOS Contact Poster */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-6 border border-slate-800 shadow-2xl max-w-sm mx-auto overflow-hidden relative ring-4 ring-slate-900/50">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-8 font-medium px-2">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center">
                                    <div className="w-4 h-2.5 bg-slate-700 rounded-[1px] border border-slate-600"></div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full shadow-2xl mb-4 bg-slate-800 relative ring-1 ring-white/10">
                                    <Avatar size="w-32 h-32" />
                                </div>

                                <h3 className="text-2xl font-semibold text-white mb-1 tracking-tight">Jane Doe</h3>
                                <p className="text-slate-500 text-sm mb-8 font-medium">Ollabs Founder</p>

                                <div className="flex gap-4 w-full justify-center mb-6">
                                    {[
                                        { icon: MessageCircle, label: 'message' },
                                        { icon: Phone, label: 'mobile' },
                                        { icon: Video, label: 'video' },
                                        { icon: Mail, label: 'mail' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1.5 w-16 group cursor-default">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors flex items-center justify-center text-blue-500 relative overflow-hidden">
                                                <item.icon size={20} fill="currentColor" className="opacity-20 absolute scale-150" />
                                                <item.icon size={18} className="relative z-10" />
                                            </div>
                                            <span className="text-[10px] text-blue-500 capitalize font-medium">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* iOS List View */}
                        <div className="bg-white rounded-xl overflow-hidden max-w-sm mx-auto shadow-lg border border-slate-200">
                            <div className="p-3 flex items-center gap-3 border-b border-gray-100">
                                <Avatar size="w-10 h-10" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-black font-semibold text-sm truncate">Jane Doe</h4>
                                </div>
                            </div>
                            <div className="p-3 flex items-center gap-3 bg-gray-50/50">
                                <div className="w-10 h-10 rounded-full bg-slate-300 shrink-0 flex items-center justify-center text-slate-500 font-bold text-xs">
                                    AB
                                </div>
                                <div className="flex-1 min-w-0 border-b border-gray-200 pb-3 mb-[-12px]">
                                    <h4 className="text-black font-bold text-sm truncate opacity-40">Alex Brown</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* === SOCIAL TAB === */}
                {activeTab === 'social' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-sm mx-auto">

                        {/* Social Sub-Tabs */}
                        <div className="flex justify-center gap-2 mb-6">
                            {(['instagram', 'twitter', 'linkedin'] as SocialApp[]).map((app) => (
                                <button
                                    key={app}
                                    onClick={() => setSocialApp(app)}
                                    className={`
                            px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all
                            ${socialApp === app
                                            ? 'bg-slate-700 border-slate-600 text-white'
                                            : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-700'}
                        `}
                                >
                                    {app}
                                </button>
                            ))}
                        </div>

                        {/* Instagram Style */}
                        {socialApp === 'instagram' && (
                            <div className="bg-black rounded-xl border border-slate-800 p-4 text-white shadow-xl">
                                <div className="flex items-center justify-between mb-4 opacity-50">
                                    <span className="text-xs font-bold">jane_doe</span>
                                    <GripHorizontal size={16} />
                                </div>
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full p-[2px]"></div>
                                        <Avatar size="w-20 h-20" className="border-4 border-black relative z-10" />
                                    </div>
                                    <div className="flex gap-4 text-center">
                                        <div><div className="font-bold text-sm">1.2k</div><div className="text-[10px] opacity-70">Posts</div></div>
                                        <div><div className="font-bold text-sm">8.5k</div><div className="text-[10px] opacity-70">Followers</div></div>
                                        <div><div className="font-bold text-sm">450</div><div className="text-[10px] opacity-70">Following</div></div>
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <div className="font-bold">Jane Doe</div>
                                    <div className="opacity-80 text-xs">Digital Creator • Ollabs</div>
                                </div>
                            </div>
                        )}

                        {/* X / Twitter Style */}
                        {socialApp === 'twitter' && (
                            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-white shadow-xl">
                                <div className="h-20 bg-slate-800 relative">
                                    <div className="absolute bottom-[-24px] left-4 rounded-full p-1 bg-slate-950">
                                        <Avatar size="w-16 h-16" />
                                    </div>
                                </div>
                                <div className="pt-8 px-4 pb-4">
                                    <div className="flex justify-end mb-2">
                                        <div className="px-4 py-1.5 rounded-full border border-slate-600 text-xs font-bold">Edit profile</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base flex items-center gap-1">
                                            Jane Doe
                                            <span className="text-blue-400 fill-blue-400"><Twitter size={12} fill="currentColor" /></span>
                                        </h4>
                                        <p className="text-slate-500 text-xs mb-3">@janedoe</p>
                                        <p className="text-sm text-slate-300">Building circular frames for the metaverse. 🪐</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LinkedIn Style */}
                        {socialApp === 'linkedin' && (
                            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden text-slate-100 shadow-xl">
                                <div className="h-16 bg-gradient-to-r from-blue-700 to-indigo-800 relative">
                                    <div className="absolute bottom-[-32px] left-4 p-1 bg-slate-900 rounded-full">
                                        <Avatar size="w-20 h-20" />
                                    </div>
                                </div>
                                <div className="pt-10 px-4 pb-4">
                                    <h4 className="font-semibold text-base">Jane Doe</h4>
                                    <p className="text-xs text-slate-400 mb-2">Product Designer at Ollabs</p>
                                    <div className="flex gap-2 text-[10px] text-slate-500 mb-3">
                                        <span>500+ connections</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded-full text-center">Connect</div>
                                        <div className="flex-1 border border-slate-600 text-slate-300 text-xs font-bold py-1.5 rounded-full text-center">Message</div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* === CHAT TAB === */}
                {activeTab === 'chat' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-sm mx-auto">

                        {/* Chat Sub-Tabs */}
                        <div className="flex justify-center gap-2 mb-6">
                            {(['whatsapp', 'telegram', 'slack'] as ChatApp[]).map((app) => (
                                <button
                                    key={app}
                                    onClick={() => setChatApp(app)}
                                    className={`
                            px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all
                            ${chatApp === app
                                            ? 'bg-slate-700 border-slate-600 text-white'
                                            : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-700'}
                        `}
                                >
                                    {app}
                                </button>
                            ))}
                        </div>

                        {/* WhatsApp Style */}
                        {chatApp === 'whatsapp' && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <div className="bg-slate-800 p-3 flex items-center gap-3">
                                    <div className="text-green-500"><Phone size={18} /></div>
                                    <span className="text-slate-300 text-sm font-medium flex-1 text-center pr-6">WhatsApp</span>
                                </div>
                                <div className="p-2">
                                    <div className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-default">
                                        <Avatar size="w-12 h-12" />
                                        <div className="flex-1 border-b border-slate-800 pb-3 mb-[-12px]">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="font-semibold text-white text-sm">Jane Doe</h4>
                                                <span className="text-[10px] text-green-500 font-medium">10:42 AM</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-slate-400 truncate">Check out this new frame!</p>
                                                <div className="w-4 h-4 rounded-full bg-green-600 text-[9px] flex items-center justify-center text-black font-bold">2</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mock other chats */}
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-center gap-3 p-2 opacity-40">
                                            <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                                            <div className="flex-1">
                                                <div className="w-20 h-3 bg-slate-700 rounded mb-2"></div>
                                                <div className="w-32 h-2 bg-slate-800 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Telegram Style */}
                        {chatApp === 'telegram' && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <div className="bg-blue-600/20 p-3 flex items-center gap-3 border-b border-blue-900/30">
                                    <div className="text-blue-400"><Send size={18} /></div>
                                    <span className="text-blue-100 text-sm font-medium flex-1 text-center pr-6">Telegram</span>
                                </div>
                                <div className="p-2">
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/10">
                                        <Avatar size="w-12 h-12" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="font-semibold text-white text-sm">Jane Doe</h4>
                                                <span className="text-[10px] text-slate-500">Just now</span>
                                            </div>
                                            <p className="text-xs text-blue-200">Sent you a photo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slack Style */}
                        {chatApp === 'slack' && (
                            <div className="bg-[#1a1d21] border border-slate-700 rounded-xl overflow-hidden p-3">
                                <div className="flex items-center gap-2 mb-3 text-slate-400">
                                    <Hash size={14} />
                                    <span className="text-xs font-bold uppercase tracking-wide">design-team</span>
                                </div>
                                <div className="flex gap-3">
                                    <Avatar size="w-9 h-9" className="rounded-md" />
                                    <div>
                                        <div className="flex items-baseline gap-2 mb-0.5">
                                            <span className="text-white font-bold text-sm">Jane Doe</span>
                                            <span className="text-[10px] text-slate-500">12:30 PM</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            Uploaded the new avatar assets! 🎨
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>
            <p className="text-center text-[10px] text-slate-600 pt-4 border-t border-slate-800/50">
                Previews are simulated. Actual appearance varies by device and app version.
            </p>
        </div>
    );
};
