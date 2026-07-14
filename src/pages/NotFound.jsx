
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 text-center">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <h1 className="text-8xl font-black bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold text-zinc-100 mt-4">Page Not Found</h2>
        <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-500 transition-smooth shadow-lg hover:shadow-purple-500/20 active:scale-95"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
