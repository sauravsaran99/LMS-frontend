import PublicHeader from "../../components/public/PublicHeader";
import PublicFooter from "../../components/public/PublicFooter";
import { Link } from "react-router-dom";

const positions = [
    {
        id: 1,
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        location: "Remote / Hybrid",
        type: "Full-time",
    },
    {
        id: 2,
        title: "Product Designer (UX/UI)",
        department: "Design",
        location: "New York, NY",
        type: "Full-time",
    },
    {
        id: 3,
        title: "Customer Success Manager",
        department: "Sales",
        location: "Remote",
        type: "Full-time",
    },
    {
        id: 4,
        title: "DevOps Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
    },
];

export default function Careers() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <PublicHeader />

            <main className="flex-grow">
                {/* Hero */}
                <section className="bg-brand-600 dark:bg-brand-900 py-24 text-center px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Join Our Mission</h1>
                        <p className="text-xl text-brand-100 mb-8">
                            Help us build the future of healthcare technology. We're looking for passionate individuals to join our growing team.
                        </p>
                        <a
                            href="#positions"
                            className="inline-block bg-white text-brand-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            View Open Roles
                        </a>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Why Work With Us?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Flexible Work</h3>
                                <p className="text-gray-600 dark:text-gray-400">Remote-first culture with flexible hours to help you maintain a healthy work-life balance.</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Growth & Learning</h3>
                                <p className="text-gray-600 dark:text-gray-400">Annual learning stipend, conferences, and clear career progression paths.</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Health & Wellness</h3>
                                <p className="text-gray-600 dark:text-gray-400">Comprehensive health insurance, mental health support, and wellness programs.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section id="positions" className="py-20 bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Open Positions</h2>
                        <div className="space-y-4">
                            {positions.map((job) => (
                                <div key={job.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            <span>{job.department}</span>
                                            <span>•</span>
                                            <span>{job.location}</span>
                                            <span>•</span>
                                            <span>{job.type}</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
