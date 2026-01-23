import PublicHeader from "../../components/public/PublicHeader";
import PublicFooter from "../../components/public/PublicFooter";

export default function Terms() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <PublicHeader />

            <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto prose dark:prose-invert">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Last updated: January 23, 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Agreement to Terms</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            By accessing our website and using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Use License</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Permission is granted to temporarily download one copy of the materials (information or software) on LMS's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>attempt to decompile or reverse engineer any software contained on LMS's website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Disclaimer</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            The materials on LMS's website are provided on an 'as is' basis. LMS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Limitations</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            In no event shall LMS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LMS's website, even if LMS or a LMS authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </section>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
