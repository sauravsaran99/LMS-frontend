import PublicHeader from "../../components/public/PublicHeader";
import PublicFooter from "../../components/public/PublicFooter";

export default function About() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <PublicHeader />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 bg-gray-50 dark:bg-gray-800 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-50 dark:bg-brand-900/10 -skew-x-12 transform origin-top-right" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Revolutionizing Laboratory Management
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                We are on a mission to simplify healthcare operations through innovative technology, making laboratory management seamless, efficient, and reliable for everyone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-16 sm:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <img
                                    src="/images/homepage/header_img.png"
                                    alt="Our Story"
                                    className="rounded-2xl shadow-xl w-full object-cover dark:opacity-90"
                                />
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Story</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Founded in 2024, our LMS was born from a simple observation: laboratory professionals were spending too much time on paperwork and not enough on what matters most—patient care.
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    We built a platform that combines powerful automation with an intuitive interface, designed specifically for the unique needs of modern diagnostic centers and pathology labs.
                                </p>
                                <div className="pt-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">50K+</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">100+</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Cities Covered</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-16 bg-gray-50 dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    To empower laboratories with state-of-the-art technology that enhances accuracy, speed, and patient satisfaction, ultimately contributing to better healthcare outcomes.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    To be the global standard for laboratory management systems, creating a connected ecosystem where diagnostic data flows seamlessly and securely.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <PublicFooter />
        </div>
    );
}
