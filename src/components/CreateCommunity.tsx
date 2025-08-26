import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
interface CommunityInput {
    name: string;
    description: string;
}
const createCommunity = async (community: CommunityInput) => {
    const { data, error } = await supabase.from("communities").insert(community);
    if (error) throw new Error(error?.message);
    return data
}

const CreateCommunity = () => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const queryClient = useQueryClient();
    const navigate = useNavigate();


    const { mutate, isPending, isError } = useMutation({
        mutationFn: createCommunity,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["communities"],
            })
            navigate("/communities")
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ name, description });
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Create New Community</h2>
                <div>
                    <label className="block mb-2 font-medium" htmlFor="name">Community Name</label>
                    <input className="w-full border border-white/10 bg-transparent p-2 rounded" type="text" name="name" id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label className="block mb-2 font-medium" htmlFor="description">Description</label>
                    <textarea className="w-full border border-white/10 bg-transparent p-2 rounded" rows={3} name="description" id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button className={`${isPending ? "cursor-not-allowed" : "cursor-pointer"} bg-purple-500 text-white px-4 py-2 rounded`} type="submit" disabled={isPending}>{isPending ? "Creating ..." : "Create Community"}</button>
                {isError && (
                    <p className="text-red-500">Error Creating Community.</p>
                )}
            </form>
        </>
    )
}

export default CreateCommunity
