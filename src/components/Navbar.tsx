import { Search, PlusCircle, User, Store } from 'lucide-react';

interface NavbarProps {
  onSellClick: () => void;
  onSearch: (query: string) => void;
}

export function Navbar({ onSellClick, onSearch }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Store size={24} />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight hidden sm:block">
              Tirta<span className="text-orange-500">Bekas</span>
            </span>
          </div>

          <div className="flex-1 max-w-2xl px-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 sm:text-sm"
                placeholder="Cari buku, kipas angin, jas lab..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onSellClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-2xl shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 active:scale-95"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="hidden sm:block">Jual Barang</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
