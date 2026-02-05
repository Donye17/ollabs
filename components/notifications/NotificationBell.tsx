"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Heart, MessageSquare, Repeat, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'remix';
    actor_id: string;
    entity_id: string;
    read: boolean;
    created_at: string;
    metadata: string; // JSON string
}

export const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    // Poll every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id?: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                body: JSON.stringify({ id }), // if id is null, marks all
                headers: { 'Content-Type': 'application/json' }
            });
            // Optimistic update
            if (id) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Failed to mark notifications read", error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
        // Navigate to the frame
        router.push(`/create?id=${notification.entity_id}`);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart size={16} className="text-pink-500 fill-pink-500" />;
            case 'comment': return <MessageSquare size={16} className="text-blue-500 fill-blue-500" />;
            case 'remix': return <Repeat size={16} className="text-green-500" />;
            default: return <Bell size={16} />;
        }
    };

    const getMessage = (n: Notification) => {
        try {
            const meta = JSON.parse(n.metadata);
            const actorName = meta.actor_name || 'Someone';
            const frameName = meta.frame_name || 'your frame';

            if (n.type === 'like') return <span className="text-sm"><span className="font-bold text-zinc-200">{actorName}</span> liked <span className="font-medium text-blue-400">{frameName}</span></span>;
            if (n.type === 'comment') return <span className="text-sm"><span className="font-bold text-zinc-200">{actorName}</span> commented on <span className="font-medium text-blue-400">{frameName}</span></span>;
            return <span className="text-sm">New interaction on your frame</span>;
        } catch (e) {
            return <span className="text-sm">New notification</span>;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-zinc-950 animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-950">
                        <h3 className="font-bold text-sm text-zinc-300">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); markAsRead(); }}
                                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-3 flex gap-3 hover:bg-zinc-800/50 cursor-pointer transition-colors border-b border-zinc-800/50 ${!n.read ? 'bg-zinc-800/30' : ''}`}
                                >
                                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1">
                                        {getMessage(n)}
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {new Date(n.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
