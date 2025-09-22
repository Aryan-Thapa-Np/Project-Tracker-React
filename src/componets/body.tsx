import { Link } from 'react-router-dom';

function Hero() {
    return (
        <>
            <section className="text-center py-20 bg-gray-50">
                <h2 className="text-4xl font-bold mb-4">Welcome to MyLanding 🚀</h2>
                <p className="text-lg text-gray-600 mb-6">
                    A modern landing page built with React & TailwindCSS.
                </p>
                <Link
                    to="/features"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700"
                >
                    Get Started
                </Link>
            </section>
            <section className="py-20 px-6 bg-white">
                <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">⚡ Fast</h3>
                        <p>Lightning-fast performance with React and Tailwind.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">🎨 Beautiful</h3>
                        <p>Clean, modern, and responsive design out of the box.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">🔒 Secure</h3>
                        <p>Best practices for security and reliability included.</p>
                    </div>
                </div>
            </section>
            <section className="py-20 text-center bg-gray-50">
                <h2 className="text-3xl font-bold mb-4">About Us</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    This landing page is a starting point for your next amazing project.
                </p>
            </section>

            <footer className="bg-gray-800 text-white py-6 text-center">
                <p>© {new Date().getFullYear()} MyLanding. All rights reserved.</p>
            </footer>
        </>
    );
}

export default Hero