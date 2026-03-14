import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';

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
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; image: Image | null }>({
    open: false,
    image: null,
  });
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
      setSelectedImage(null);
      setSearchQuery('');
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
  const handleDelete = async () => {
    const image = deleteConfirm.image;
    if (!image) return;

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
    } finally {
      setDeleteConfirm({ open: false, image: null });
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        showCloseButton={false}
        className="p-0"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            图片库
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              {isUploading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  上传中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  上传图片
                </>
              )}
            </button>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索图片..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* 图片数量 */}
          <span className="text-sm text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            共 {filteredImages.length} 张
          </span>
        </div>

        {/* 图片列表 */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-500 dark:text-slate-400">加载中...</p>
              </div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.key}
                  onClick={() => setSelectedImage(image)}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage?.key === image.key
                      ? 'border-amber-500 ring-4 ring-amber-500/20 scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'
                  }`}
                >
                  {/* 图片预览 */}
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* 图片名称 */}
                  <div className="px-2 py-2 bg-white dark:bg-slate-900">
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{image.name}</p>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm({ open: true, image });
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center hover:bg-red-600 hover:scale-110 shadow-lg"
                    title="删除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* 选中标记 */}
                  {selectedImage?.key === image.key && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="mb-2 font-medium">暂无图片</p>
              <p className="text-sm text-slate-400">点击上方"上传图片"按钮添加图片</p>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {selectedImage ? (
              <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已选择: <span className="font-medium">{selectedImage.name}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                点击图片选择
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedImage}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              插入图片
            </button>
          </div>
        </div>
      </Modal>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, image: null })}
        onConfirm={handleDelete}
        title="删除图片"
        message={`确定要删除 "${deleteConfirm.image?.name}" 吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        variant="danger"
      />
    </>
  );
};

export default ImageLibrary;
