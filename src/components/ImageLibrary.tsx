import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface Image {
  key: string;
  url: string;
  name: string;
}

interface ImageLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ isOpen, onClose, onSelect }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载图片列表
  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      
      if (data.success) {
        setImages(data.images || []);
      } else {
        toast.error('加载图片失败');
      }
    } catch (error) {
      console.error('Load images error:', error);
      toast.error('加载图片失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, loadImages]);

  // 上传图片
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小
    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过10MB');
      return;
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('只能上传图片文件');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('上传成功');
        // 添加到列表
        setImages(prev => [{
          key: data.key,
          url: data.url,
          name: data.filename,
        }, ...prev]);
      } else {
        toast.error(data.error || '上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('上传失败');
    } finally {
      setIsUploading(false);
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 删除图片
  const handleDelete = async (image: Image, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm(`确定要删除这张图片吗？\n${image.name}`)) {
      return;
    }

    try {
      const response = await fetch(`/api/images/${encodeURIComponent(image.key)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('删除成功');
        setImages(prev => prev.filter(img => img.key !== image.key));
        if (selectedImage?.key === image.key) {
          setSelectedImage(null);
        }
      } else {
        toast.error(data.error || '删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('删除失败');
    }
  };

  // 确认选择
  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage.url);
      onClose();
    }
  };

  // 过滤图片
  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">图片库</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-times text-lg"></i>
          </button>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-100">
          {/* 上传按钮 */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  上传中...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-upload"></i>
                  上传图片
                </>
              )}
            </button>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="搜索图片..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* 图片数量 */}
          <span className="text-sm text-gray-500">
            共 {filteredImages.length} 张图片
          </span>
        </div>

        {/* 图片列表 */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500">加载中...</p>
              </div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.key}
                  onClick={() => setSelectedImage(image)}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage?.key === image.key
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* 图片预览 */}
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* 图片名称 */}
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">{image.name}</p>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => handleDelete(image, e)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                    title="删除"
                  >
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>

                  {/* 选中标记 */}
                  {selectedImage?.key === image.key && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-check text-white text-sm"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <i className="fa-solid fa-images text-5xl mb-4"></i>
              <p className="mb-2">暂无图片</p>
              <p className="text-sm">点击上方"上传图片"按钮添加图片</p>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {selectedImage ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-image text-[#D4AF37]"></i>
                已选择: {selectedImage.name}
              </span>
            ) : (
              '点击图片选择'
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedImage}
              className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C9A227] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              插入图片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLibrary;
