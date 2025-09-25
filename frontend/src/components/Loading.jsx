import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background */}
      <div className="min-h-screen w-full bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
        <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

        {/* Modal Content */}
        <div className="relative z-10 bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
