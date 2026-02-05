import React, { useState } from 'react';
import { X, Save, Twitter, Globe, Instagram, MapPin, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    name: string;
    image?: string;
    bio?: string;
    location?: string;
    website?: string;
    social_links?: any;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserData;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState(currentUser.name || '');
    const [bio, setBio] = useState(currentUser.bio || '');
    const [location, setLocation] = useState(currentUser.location || '');
    const [website, setWebsite] = useState(currentUser.website || '');
    // Socials (parsing logic to handle existing data or empty default)
    const initialSocials = typeof currentUser.social_links === 'string'
        ? JSON.parse(currentUser.social_links)
        : (currentUser.social_links || {});

    const [twitter, setTwitter] = useState(initialSocials.twitter || '');
    const [instagram, setInstagram] = useState(initialSocials.instagram || '');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    bio,
                    location,
                    website,
                    social_links: { twitter, instagram }
                })
            });

            if (!res.ok) throw new Error('Failed to update');

            router.refresh(); // Refresh server components
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            placeholder="Your Name"
                            maxLength={50}
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all min-h-[100px] resize-none"
                            placeholder="Tell us about yourself..."
                            maxLength={300}
                        />
                        <div className="text-right text-[10px] text-slate-600 mt-1">{bio.length}/300</div>
                    </div>

                    {/* Location & Website */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Location</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <MapPin size={16} />
                                </div>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">Website</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Globe size={16} />
                                </div>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Socials Divider */}
                    <div className="h-px bg-slate-800" />

                    {/* Social Links */}
                    <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Social Links</label>

                        {/* Twitter */}
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-800 p-2 rounded-lg text-slate-400"><Twitter size={18} /></div>
                            <input
                                type="text"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none"
                                placeholder="@username"
                            />
                        </div>

                        {/* Instagram */}
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-800 p-2 rounded-lg text-slate-400"><Instagram size={18} /></div>
                            <input
                                type="text"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none"
                                placeholder="@username"
                            />
                        </div>
                    </div>

                </form>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
};
