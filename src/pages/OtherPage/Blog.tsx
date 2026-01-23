import { useEffect, useState } from "react";
import PublicHeader from "../../components/public/PublicHeader";
import PublicFooter from "../../components/public/PublicFooter";
import { getBlogs } from "../../api/public";
import Loader from "../../components/common/Loader";

export default function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const response = await getBlogs();
        if (response && response.success) {
            setBlogPosts(response.data);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <PublicHeader />

            <main className="flex-grow">
                <section className="bg-gray-50 dark:bg-gray-800 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest Insights</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            News, trends, and expert opinions from the world of laboratory medicine and technology.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader className="w-10 h-10 text-brand-600" />
                            </div>
                        ) : blogPosts.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                No blog posts available.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogPosts.map((post: any) => (
                                    <article
                                        key={post.id}
                                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                                            {/* Use image from post if available, else placeholder */}
                                            {post.image ? (
                                                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 font-medium">
                                                    {post.category || "General"} Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                                                    {post.category || "General"}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                                    {post.title}
                                                </a>
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{post.content}</p>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span>By {post.author}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
