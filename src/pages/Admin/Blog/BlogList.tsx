import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/ui/button/Button";
import BlogFormModal from "./BlogFormModal";
import { getAllBlogsAdmin, deleteBlog } from "../../../api/admin";
import toast from "react-hot-toast";

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const response = await getAllBlogsAdmin();
        if (response && response.success) {
            setBlogs(response.data);
        }
        setLoading(false);
    };

    const handleEdit = (blog: any) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this post?")) {
            const response = await deleteBlog(id);
            if (response && response.success) {
                toast.success("Blog deleted successfully");
                fetchBlogs();
            } else {
                toast.error("Failed to delete blog");
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBlog(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Blog Management" subtitle="Manage your blog posts" />
                <Button onClick={() => setIsModalOpen(true)}>Add New Post</Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                                </tr>
                            ) : blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No blog posts found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog: any) => (
                                    <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{blog.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{blog.author}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium">
                                                {blog.category || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(blog)}
                                                    className="p-1 text-gray-400 hover:text-brand-500 transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BlogFormModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={fetchBlogs}
                blogToEdit={selectedBlog}
            />
        </div>
    );
}
