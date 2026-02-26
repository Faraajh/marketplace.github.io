import React, { useState } from 'react';
import { X, Image as ImageIcon, Upload } from 'lucide-react';
import { Category, Product } from '../types';
import { CATEGORIES } from '../data';
import { ImageEditor } from './ImageEditor';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt'>) => void;
}

export function SellModal({ isOpen, onClose, onSubmit }: SellModalProps) {
  const [step, setStep] = useState<'details' | 'image'>('details');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: CATEGORIES[0].id,
    sellerName: '',
    sellerFaculty: '',
    imageUrl: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Silakan upload foto produk terlebih dahulu');
      return;
    }
    
    onSubmit({
      ...formData,
      price: parseInt(formData.price.replace(/\D/g, '') || '0'),
    });
    onClose();
  };

  const handleImageEdited = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
    setStep('details');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {step === 'details' ? 'Jual Barang Bekas' : 'Upload & Edit Foto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {step === 'image' ? (
            <ImageEditor 
              onImageEdited={handleImageEdited} 
              onCancel={() => setStep('details')} 
            />
          ) : (
            <form id="sell-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Foto Produk</label>
                {formData.imageUrl ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setStep('image')}
                        className="px-4 py-2 bg-white text-gray-900 rounded-xl font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <ImageIcon size={18} />
                        Ganti Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep('image')}
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition-all group flex flex-col items-center justify-center gap-3"
                  >
                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="text-gray-400 group-hover:text-orange-500" size={24} />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Upload Foto Produk</p>
                      <p className="text-sm text-gray-400 mt-1">Bisa diedit pakai AI lho!</p>
                    </div>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Nama Barang</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Contoh: Buku Kalkulus Edisi 9"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Harga (Rp)</label>
                  <input
                    required
                    type="text"
                    value={formData.price}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData(prev => ({ ...prev, price: val ? new Intl.NumberFormat('id-ID').format(parseInt(val)) : '' }));
                    }}
                    placeholder="Contoh: 85.000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Kategori</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Deskripsi Barang</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Jelaskan kondisi barang, minus, alasan dijual..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Nama Penjual</label>
                  <input
                    required
                    type="text"
                    value={formData.sellerName}
                    onChange={e => setFormData(prev => ({ ...prev, sellerName: e.target.value }))}
                    placeholder="Nama kamu"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Fakultas</label>
                  <select
                    required
                    value={formData.sellerFaculty}
                    onChange={e => setFormData(prev => ({ ...prev, sellerFaculty: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                  >
                    <option value="">Pilih Fakultas</option>
                    <option value="Fakultas Teknik">Fakultas Teknik</option>
                    <option value="Fakultas Ekonomi dan Bisnis">Fakultas Ekonomi dan Bisnis</option>
                    <option value="Fakultas Keguruan dan Ilmu Pendidikan">Fakultas Keguruan dan Ilmu Pendidikan</option>
                    <option value="Fakultas Pertanian">Fakultas Pertanian</option>
                    <option value="Fakultas Ilmu Sosial dan Ilmu Politik">Fakultas Ilmu Sosial dan Ilmu Politik</option>
                    <option value="Fakultas Hukum">Fakultas Hukum</option>
                    <option value="Fakultas Kedokteran">Fakultas Kedokteran</option>
                  </select>
                </div>
              </div>
            </form>
          )}
        </div>

        {step === 'details' && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              form="sell-form"
              className="px-8 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 shadow-sm transition-colors"
            >
              Pasang Iklan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
