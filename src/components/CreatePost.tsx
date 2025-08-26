import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react"
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { getCommunities, type Community } from "./CommunityList";


interface PostInput {
    title: string;
    content: string;
    avatar_url: string | null;
    community_id: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from("post-images").upload(filePath, imageFile);
    if (uploadError) {
        throw new Error(uploadError.message);
    }
    const { data: publicUrlData } = await supabase.storage.from("post-images").getPublicUrl(filePath);
    const { data, error } = await supabase.from('posts').insert({ ...post, image_url: publicUrlData.publicUrl });
    if (error) {
        throw new Error(error.message);
    }
    return data
}

const CreatePost = () => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [communityId, setCommunityId] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { user } = useAuth();
    const { data: communities } = useQuery<Community[], Error>({
        queryKey: ["communities"],
        queryFn: getCommunities,
    });

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (data: { post: PostInput; imageFile: File }) => {
            return createPost(data.post, data.imageFile);
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        mutate({ post: { title, content, avatar_url: user?.user_metadata.avatar_url || null, community_id: communityId }, imageFile: selectedFile });
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCommunityId(value ? Number(value) : null);
    }


    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                <div>
                    <label htmlFor="title" className="block mb-2 font-medium">Title</label>
                    <input className="w-full border border-white/10 bg-transparent p-2 rounded" value={title} type="text" name="title" id="title" required onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="content" className="block mb-2 font-medium">Content</label>
                    <textarea className="w-full border border-white/10 bg-transparent p-2 rounded" value={content} rows={5} name="content" id="content" required onChange={(e) => setContent(e.target.value)} />
                </div>

                <div>
                    <label htmlFor="community">Select Community</label>
                    <select name="community" id="community" onChange={handleCommunityChange}>
                        <option value={""}>-- Choose Community -- </option>
                        {communities?.map((community, key) => (
                            <option key={key} value={community.id}>{community.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="image" className="block mb-2 font-medium">Upload Image</label>
                    <input
                        className="w-full text-gray-200"
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                    />
                </div>
                <button
                    className={`bg-purple-500 text-white px-4 py-2 rounded ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? "Creating Post..." : "Create Post"}
                </button>
                {isError && <p className="text-red-500">Error Creating Post</p>}
            </form>
        </>
    )
}

export default CreatePost
