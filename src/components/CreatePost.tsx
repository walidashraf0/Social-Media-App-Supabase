import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react"
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { getCommunities, type Community } from "./CommunityList";
import { MdOutlineCloudUpload } from "react-icons/md";


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
                    <div className="relative mt-2">
                        <select
                            name="community"
                            id="community"
                            onChange={handleCommunityChange}
                            className="block w-full appearance-none bg-[#18181b] border border-white/10 text-gray-200 py-2 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            value={communityId ?? ""}
                            required
                        >
                            <option value={""} disabled>
                                Choose Community
                            </option>
                            {communities?.map((community) => (
                                <option key={community.id} value={community.id}>
                                    {community.name}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                </div>

                <div>
                    <div
                        className="h-[200px] w-[300px] my-8 flex flex-col gap-5 cursor-pointer items-center justify-center border-2 border-dashed border-[#E8E8E8] bg-[#212121] p-6 rounded-xl shadow-[0px_48px_35px_-48px_#E8E8E8] transition hover:border-purple-400 hover:bg-[#292929]"
                        onClick={() => document.getElementById('image-upload-input')?.click()}
                        tabIndex={0}
                        role="button"
                        onKeyPress={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                document.getElementById('image-upload-input')?.click();
                            }
                        }}
                    >
                        <div className="flex items-center justify-center">
                            <MdOutlineCloudUpload size={40} className="h-[80px] fill-[#E8E8E8]" />
                        </div>
                        <div className="text flex items-center justify-center">
                            <span className="font-normal text-[#E8E8E8]">Click to upload image</span>
                        </div>
                        <input
                            type="file"
                            name="image"
                            id="image-upload-input"
                            accept="image/*"
                            required
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            tabIndex={-1}
                        />
                    </div>
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
