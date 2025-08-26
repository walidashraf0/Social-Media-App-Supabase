import { useState } from "react"
import { FaBars, FaGithub } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router"
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const { signInWithGithub, signInWithGoogle, signOut, user } = useAuth();

    const displayName = user?.user_metadata.full_name || user?.email;

    return (
        <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link className="font-mono text-xl font-bold text-white" to={"/"}>
                        WE<span className="text-purple-500">GO</span>
                    </Link>
                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link className="text-gray-300 hover:text-white transition-colors" to={"/"}>Home</Link>
                        <Link className="text-gray-300 hover:text-white transition-colors" to={"/create"}>Create Post</Link>
                        <Link className="text-gray-300 hover:text-white transition-colors" to={"/communities"}>Communities</Link>
                        <Link className="text-gray-300 hover:text-white transition-colors" to={"/community/create"}>Create Community</Link>
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {user.user_metadata.avatar_url && (
                                    <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                                )}
                                <span className="text-gray-300">{displayName}</span>
                                <button className="bg-red-500 px-3 py-1 rounded cursor-pointer" onClick={signOut}>Sign Out</button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-4">
                                    <button onClick={signInWithGithub} className="cursor-pointer bg-[#1E2939] px-3 py-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white">Sign in With Github</span>
                                            <FaGithub />
                                        </div>
                                    </button>
                                    <button onClick={signInWithGoogle} className="cursor-pointer bg-white px-3 py-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <span className="text-black">Sign in With Google</span>
                                            <FcGoogle />
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-gray-300 focus:outline-none" onClick={() => setMenuOpen(prev => !prev)}>{menuOpen ? <IoClose /> : <FaBars />
                        }</button>
                    </div>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700" to={"/"}>Home</Link>
                                <Link className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700" to={"/create"}>Create Post</Link>
                                <Link className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700" to={"/communities"}>Communities</Link>
                                <Link className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700" to={"/community/create"}>Create Community</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
