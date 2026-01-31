import React, { useState, useEffect } from 'react';
import { Send, UserCircle2 } from 'lucide-react';
import { getFrameComments, addFrameComment } from '../../lib/api';
import { authClient } from '../../lib/auth-client';

interface Comment {
    id: string;
    content: string;
    user_name: string;
    user_image?: string;
    created_at: string;
}

interface CommentSectionProps {
    frameId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ frameId }) => {
    const { data: session } = authClient.useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const result = await getFrameComments(frameId);
                setComments(result);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [frameId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !session?.user?.id || submitting) return;

        setSubmitting(true);
        try {
            await addFrameComment(frameId, session.user.id, newComment);
            // Optimistic update
            const comment: Comment = {
                id: Date.now().toString(), // Temp ID
                content: newComment,
                user_name: session.user.name || 'You',
                user_image: session.user.image || undefined,
                created_at: new Date().toISOString()
            };
            setComments([...comments, comment]);
            setNewComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-4 space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Comments ({comments.length})</h4>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden">
                            {comment.user_image ? (
                                <img src={comment.user_image} alt={comment.user_name} className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle2 className="w-full h-full text-slate-500 p-1" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-white">{comment.user_name || 'Anonymous'}</span>
                                <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-300 mt-0.5">{comment.content}</p>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-slate-500 text-sm italic">No comments yet.</p>
                )}
            </div>

            {session ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-slate-800 border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                    </button>
                </form>
            ) : (
                <p className="text-xs text-slate-500 text-center py-2 bg-slate-800/30 rounded-lg">Sign in to comment</p>
            )}
        </div>
    );
};
