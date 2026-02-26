import { MapPin, Clock, ShieldCheck, User } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm flex items-center gap-1">
          <Clock size={12} className="text-orange-500" />
          {timeAgo(product.createdAt)}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="text-xl font-bold text-orange-600 tracking-tight mb-4">
          {formatPrice(product.price)}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <User size={12} />
            </div>
            <span className="truncate font-medium">{product.sellerName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 pl-1">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{product.sellerFaculty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
