"use client";

import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';

export const EditProfileModalWrapper: React.FC<{ user: any }> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-slate-900/20 border border-slate-700"
            >
                <Pencil size={14} />
                Edit Profile
            </button>
            <EditProfileModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                currentUser={user}
            />
        </>
    );
}
