
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {children}
      </main>
      <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} E-Com Lite. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
