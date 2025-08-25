import supabase from "../supabase-client";
import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";

export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    image_url: string;
    avatar_url?: string;
    like_count?: number;
    comment_count?: number;
}

const getPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase.rpc("get_posts_with_counts")
    if (error) throw new Error(error.message);
    return data as Post[];
}

const PostList = () => {
    const { data, error, isLoading } = useQuery<Post[], Error>({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    if (isLoading) <div>Loading Posts...</div>
    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <>
            <div className="flex flex-wrap gap-6 justify-center">
                {data?.map((post, index) => (
                    <PostItem post={post} key={index} />
                ))}
            </div>
        </>
    )
}

export default PostList
