import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import { IoHeartDislikeSharp } from "react-icons/io5";
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Props {
    postId: number;
}

interface Vote {
    id: number;
    post_id: number;
    user_id: string;
    vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
    const { data: existiongVote } = await supabase.from("votes").select().eq("post_id", postId).eq("user_id", userId).maybeSingle();

    if (existiongVote) {
        if (existiongVote.vote === voteValue) {
            const { error } = await supabase.from("votes").delete().eq("id", existiongVote.id);
            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabase.from("votes").update({ vote: voteValue }).eq("id", existiongVote.id);
            if (error) throw new Error(error.message);
        }
    } else {
        const { error } = await supabase.from("votes").insert({ post_id: postId, user_id: userId, vote: voteValue })
        if (error) throw new Error(error.message)
    }
}

const getVotes = async (postId: number): Promise<Vote[]> => {
    const { data, error } = await supabase.from("votes").select().eq("post_id", postId);
    if (error) throw new Error(error.message);


    return data as Vote[];
}


const LikeButton = ({ postId }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { data: votes, isLoading, error } = useQuery<Vote[], Error>({
        queryKey: ["votes", postId],
        queryFn: () => getVotes(postId),
        refetchInterval: 5000,
    })


    const { mutate } = useMutation({
        mutationFn: (voteValue: number) => {
            if (!user) throw new Error("you Must be logged in to be vote")
            return vote(voteValue, postId, user.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["votes", postId],
            })
        }
    })

    if (isLoading) <div>Loading Votes...</div>
    if (error) {
        return <div>Error: {error.message}</div>
    }

    const likes = votes?.filter((vote) => vote.vote === 1).length || 0;
    const dislikes = votes?.filter((vote) => vote.vote === -1).length || 0;
    const userVote = votes?.find((vote) => vote.user_id === user?.id)?.vote;



    return (
        <>
            <div className="flex items-center space-x-4 my-4">
                <button className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${userVote === 1 ? "bg-[#Ad46FF] text-white" : "bg-gray-200 text-black"
                    } flex items-center gap-1`} onClick={() => mutate(1)}><FaHeart className={`${userVote === 1 ? "text-white" : "text-red-500"}`} />{likes}</button>
                <button className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                    } flex items-center gap-1`} onClick={() => mutate(-1)}><IoHeartDislikeSharp className={`${userVote === -1 ? "text-white" : "text-red-500"}`} />{dislikes}</button>
            </div>
        </>
    )
}

export default LikeButton
