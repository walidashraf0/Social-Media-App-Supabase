import { Link } from "react-router";
import type { Post } from "./PostList"
import { FaHeart } from "react-icons/fa";
import { IoChatbubbleSharp } from "react-icons/io5";

interface Props {
    post: Post;
}
const PostItem = ({ post }: Props) => {

    return (
        <>
            <div className="relative group">
                <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
                <Link to={`/post/${post.id}`} className="block relative z-10">
                    <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
                        {/* Header: Avatar and Title */}
                        <div className="flex items-center space-x-2">
                            {post.avatar_url ? (
                                <img
                                    src={post.avatar_url}
                                    alt="User Avatar"
                                    className="w-[35px] h-[35px] rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
                            )}
                            <div className="flex flex-col flex-1">
                                <div className="text-[20px] leading-[22px] font-semibold mt-2">
                                    {post.title}
                                </div>
                            </div>
                        </div>
                        {/* Image */}
                        <div className="mt-2 flex-1">
                            <img src={post.image_url} alt={post.title} className="w-full rounded-[20px] object-cover max-h-[150px] mx-auto" />
                        </div>
                        <div className="flex items-center justify-around">
                            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg"><FaHeart className="text-red-500" /> <span className="ml-2">{post.like_count ?? 0}</span></span>
                            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg"><IoChatbubbleSharp className="text-blue-500" /><span className="ml-2">{post.comment_count ?? 0}</span></span>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default PostItem
