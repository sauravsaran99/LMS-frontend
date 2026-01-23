import { useState, useEffect } from "react";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { createBlog, updateBlog } from "../../../api/admin";
import toast from "react-hot-toast";

interface BlogFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    blogToEdit?: any;
}

export default function BlogFormModal({ isOpen, onClose, onSuccess, blogToEdit }: BlogFormModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        image: "",
        content: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (blogToEdit) {
            setFormData({
                title: blogToEdit.title,
                author: blogToEdit.author,
                category: blogToEdit.category || "",
                image: blogToEdit.image || "",
                content: blogToEdit.content,
            });
        } else {
            setFormData({
                title: "",
                author: "",
                category: "",
                image: "",
                content: "",
            });
        }
    }, [blogToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let response;
        if (blogToEdit) {
            response = await updateBlog(blogToEdit.id, formData);
        } else {
            response = await createBlog(formData);
        }

        setLoading(false);

        if (response && response.success) {
            toast.success(blogToEdit ? "Blog updated successfully" : "Blog created successfully");
            onSuccess();
            onClose();
        } else {
            toast.error("Operation failed");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {blogToEdit ? "Edit Blog Post" : "Create New Blog Post"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <Label>Title</Label>
                        <Input name="title" value={formData.title} onChange={handleChange} required placeholder="Blog Title" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label>Author</Label>
                            <Input name="author" value={formData.author} onChange={handleChange} required placeholder="Author Name" />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Technology" />
                        </div>
                    </div>

                    <div>
                        <Label>Image URL</Label>
                        <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                    </div>

                    <div>
                        <Label>Content</Label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={8}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-y"
                            placeholder="Write your blog content here..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Blog Post"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
