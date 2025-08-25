import { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase-client";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface Props {
    comment: Comment & {
        children?: Comment[];
    };
    postId: number;
}
const CommentItem = ({ comment, postId }: Props) => {
    const [showReply, setShowReply] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [newReplyText, setNewReplyText] = useState<string>("");
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const createReply = async (replyContent: string, postId: number, parentCommentId: number, userId?: string, author?: string) => {
        if (!userId || !author) throw new Error("You Must be Logged in to Reply");
        const { error } = await supabase.from("comments").insert({
            post_id: postId,
            content: replyContent,
            parent_comment_id: parentCommentId,
            user_id: userId,
            author: author,
        });
        if (error) throw new Error(error?.message);
    }

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (replyContent: string) => createReply(replyContent, postId, comment.id, user?.id, user?.user_metadata.user_name || "Anonymous"),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", postId],
            });
            setNewReplyText("");
            setShowReply(false);
        }
    })

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReplyText) return;
        mutate(newReplyText);
    }


    return (
        <>
            <div className="pl-4 border-l border-white/10">
                <div className="mb-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-blue-400">{comment.author}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                    <button className="text-blue-500 text-sm mt-1 cursor-pointer" onClick={() => setShowReply((prev) => !prev)}>{showReply ? "Cancel" : "Reply"}</button>
                </div>
                {showReply && user && (
                    <form onSubmit={handleReplySubmit} className="mb-2">
                        <textarea className="w-full border border-white/10 bg-transparent p-2 rounded" name="reply" value={newReplyText} onChange={(e) => setNewReplyText(e.target.value)} rows={2} placeholder="Write a reply" id=""></textarea>
                        <button className={`mt-1 bg-blue-500 text-white px-3 py-1 rounded ${isPending ? "cursor-not-allowed" : "cursor-pointer"}`} type="submit" disabled={!newReplyText || isPending}>
                            {isPending ? "Posting..." : "Post Reply"}
                        </button>
                        {isError && (
                            <p className="text-red-500">Error Posting Reply</p>
                        )}
                    </form>
                )}
                {comment.children && comment.children.length > 0 && (
                    <div>
                        <button onClick={() => setIsCollapsed((prev) => !prev)} title={isCollapsed ? "Hide  Replies" : "Show Replies"}>
                            {isCollapsed ? (
                                <div className="flex items-center gap-2">
                                    <IoIosArrowUp />
                                    <span>{comment.children.length}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <IoIosArrowDown />
                                        <span>{comment.children.length}</span>
                                    </div>
                                </>
                            )}
                        </button>
                        {!isCollapsed && (
                            <div className="space-y-2">
                                {comment.children.map((child, key) => (
                                    <CommentItem key={key} comment={child} postId={postId} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default CommentItem
