import { Sparkles } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 mb-4">
          <Sparkles className="w-10 h-10 text-cyan-400" />
        </div>
        
        <h1 className="text-5xl font-bold text-white">
          Welcome to Your New App
        </h1>
        
        <p className="text-xl text-neutral-300 leading-relaxed">
          Your React + TypeScript + Tailwind CSS app is ready to go.
          Start building amazing things!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-2">⚡ Fast</h3>
            <p className="text-sm text-neutral-400">Built with Vite for instant hot reload</p>
          </div>
          
          <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-2">🎨 Beautiful</h3>
            <p className="text-sm text-neutral-400">Tailwind CSS for stunning designs</p>
          </div>
          
          <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-2">🔒 Secure</h3>
            <p className="text-sm text-neutral-400">Supabase backend with authentication</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-700">
          <p className="text-sm text-neutral-400">
            Edit <code className="px-2 py-1 rounded bg-neutral-800 text-cyan-400">src/App.tsx</code> to get started
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;