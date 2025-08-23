import { useState } from "react"
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router"

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);

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
