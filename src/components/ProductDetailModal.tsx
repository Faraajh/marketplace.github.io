import { X, MapPin, Clock, User, MessageCircle, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  if (!product) return null;

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

  const handleChat = () => {
    const message = `Halo ${product.sellerName}, saya tertarik dengan "${product.title}" yang dijual di TirtaBekas. Apakah masih ada?`;
    // In a real app, this would open WhatsApp or an internal chat
    alert(`Membuka chat dengan ${product.sellerName}...\nPesan: ${message}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <div className="w-full md:w-1/2 bg-gray-100 relative shrink-0">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-64 md:h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/50 hover:bg-white backdrop-blur-md rounded-full text-gray-900 transition-colors md:hidden shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="w-full md:w-1/2 flex flex-col h-full max-h-[60vh] md:max-h-none overflow-y-auto">
          <div className="p-6 md:p-8 flex-grow">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {timeAgo(product.createdAt)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="hidden md:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-3xl font-bold text-orange-600 tracking-tight mb-8">
              {formatPrice(product.price)}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  Deskripsi Barang
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Informasi Penjual
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg flex items-center gap-1">
                      {product.sellerName}
                      <ShieldCheck size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                      <MapPin size={14} />
                      {product.sellerFaculty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-gray-100 bg-white shrink-0">
            <button
              onClick={handleChat}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageCircle size={24} />
              Chat Penjual
            </button>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck size={14} />
              Transaksi aman dengan COD di area kampus Untirta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
