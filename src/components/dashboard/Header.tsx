import { Search, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-header">
      {/* Top bar */}
      <div className="h-[56px] px-8 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-header font-bold text-sm">U.</span>
          </div>
          <span className="text-white font-semibold">Usearly</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Bell className="w-4 h-4 text-white/70" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Search className="w-4 h-4 text-white/70" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 ring-2 ring-white/20" />
        </div>
      </div>
    </header>
  );
};

export default Header;
