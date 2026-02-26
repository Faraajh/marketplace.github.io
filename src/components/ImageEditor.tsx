import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Image as ImageIcon, Loader2, Upload, RefreshCw, Check } from 'lucide-react';

interface ImageEditorProps {
  onImageEdited: (imageUrl: string) => void;
  onCancel: () => void;
}

export function ImageEditor({ onImageEdited, onCancel }: ImageEditorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setSelectedImage(result);
      
      // Extract base64 and mime type
      const match = result.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (match) {
        setMimeType(match[1]);
        setBase64Image(match[2]);
      }
    };
    reader.readAsDataURL(file);
    setEditedImage(null);
    setError(null);
  };

  const handleEdit = async () => {
    if (!base64Image || !mimeType || !prompt.trim()) return;

    setIsEditing(true);
    setError(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API Key tidak ditemukan');
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const newImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          setEditedImage(newImageUrl);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error('Gagal menghasilkan gambar. Coba prompt lain.');
      }
    } catch (err: any) {
      console.error('Error editing image:', err);
      setError(err.message || 'Terjadi kesalahan saat mengedit gambar');
    } finally {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    if (editedImage) {
      onImageEdited(editedImage);
    } else if (selectedImage) {
      onImageEdited(selectedImage);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Image Editor</h2>
          <p className="text-sm text-gray-500">Percantik foto produkmu dengan AI (Powered by Gemini)</p>
        </div>
      </div>

      {!selectedImage ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group"
        >
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="text-gray-400 group-hover:text-orange-500" size={32} />
          </div>
          <p className="text-gray-600 font-medium">Klik untuk upload foto produk</p>
          <p className="text-sm text-gray-400 mt-2">Format: JPG, PNG (Max 5MB)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>Foto Asli</span>
                <button 
                  onClick={() => {
                    setSelectedImage(null);
                    setEditedImage(null);
                    setPrompt('');
                  }}
                  className="text-orange-600 hover:text-orange-700 text-xs font-semibold"
                >
                  Ganti Foto
                </button>
              </label>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                <img src={selectedImage} alt="Original" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hasil Edit AI</label>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 relative flex items-center justify-center">
                {isEditing ? (
                  <div className="flex flex-col items-center text-orange-500">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <span className="text-sm font-medium">Memproses gambar...</span>
                  </div>
                ) : editedImage ? (
                  <img src={editedImage} alt="Edited" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm">Belum ada hasil edit</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles size={16} className="text-orange-500" />
              Perintah Edit (Prompt)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Hapus background, buat jadi putih bersih"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                disabled={isEditing}
              />
              <button
                onClick={handleEdit}
                disabled={isEditing || !prompt.trim()}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isEditing ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                Generate
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-gray-500 font-medium">Saran prompt:</span>
              {['Hapus background', 'Tingkatkan pencahayaan', 'Tambahkan efek retro', 'Buat lebih tajam'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-orange-500 hover:text-orange-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 flex items-center gap-2 transition-colors"
            >
              <Check size={20} />
              Gunakan Foto Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
