import React, { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ImageLibrary from './ImageLibrary';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// 自定义样式
const editorStyle = `
  .ql-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.8;
    min-height: 400px;
    border: none !important;
  }
  
  .ql-toolbar {
    border: none !important;
    border-bottom: 1px solid #e5e7eb !important;
    background: #fafafa;
    border-radius: 8px 8px 0 0;
    padding: 12px !important;
  }
  
  .ql-editor {
    padding: 24px !important;
    min-height: 400px;
  }
  
  .ql-editor.ql-blank::before {
    color: #9ca3af;
    font-style: normal;
    font-size: 16px;
  }
  
  .ql-editor h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 24px 0 16px;
    color: #1a1a1a;
  }
  
  .ql-editor h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 20px 0 12px;
    color: #1a1a1a;
  }
  
  .ql-editor h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 16px 0 10px;
    color: #1a1a1a;
  }
  
  .ql-editor p {
    margin: 12px 0;
    color: #333;
  }
  
  .ql-editor img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
  }
  
  .ql-editor a {
    color: #D4AF37;
    text-decoration: underline;
  }
  
  .ql-editor blockquote {
    border-left: 4px solid #D4AF37;
    padding-left: 16px;
    margin: 16px 0;
    color: #666;
    background: #f9f9f9;
    padding: 12px 16px;
    border-radius: 0 8px 8px 0;
  }
  
  .ql-editor ul, .ql-editor ol {
    padding-left: 24px;
    margin: 12px 0;
  }
  
  .ql-editor li {
    margin: 6px 0;
  }
  
  .ql-snow .ql-stroke {
    stroke: #666;
  }
  
  .ql-snow .ql-fill {
    fill: #666;
  }
  
  .ql-snow .ql-picker-label {
    color: #333;
  }
  
  .ql-snow .ql-picker-options {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .ql-snow.ql-toolbar button:hover,
  .ql-snow.ql-toolbar button.ql-active {
    background: #f0f0f0;
    border-radius: 4px;
  }
  
  .ql-snow.ql-toolbar button:hover .ql-stroke,
  .ql-snow.ql-toolbar button.ql-active .ql-stroke {
    stroke: #D4AF37;
  }
  
  .ql-snow.ql-toolbar button:hover .ql-fill,
  .ql-snow.ql-toolbar button.ql-active .ql-fill {
    fill: #D4AF37;
  }
`;

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const quillRef = useRef<ReactQuill>(null);
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  // 处理图片插入
  const handleImageSelect = useCallback((imageUrl: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', imageUrl);
      quill.setSelection(range.index + 1);
    }
  }, []);

  // 处理图片按钮点击
  const handleImageButton = useCallback(() => {
    setShowImageLibrary(true);
  }, []);

  // 动态创建 modules（避免 React 严格模式下的重复注册问题）
  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: handleImageButton
      }
    }
  }), [handleImageButton]);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image',
    'blockquote', 'code-block'
  ];

  const handleChange = useCallback((content: string) => {
    onChange(content);
  }, [onChange]);

  return (
    <>
      <div className="rich-text-editor bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <style>{editorStyle}</style>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || '开始撰写您的文章...'}
        />
      </div>

      {/* 图片库弹窗 */}
      <ImageLibrary
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
};

export default RichTextEditor;
