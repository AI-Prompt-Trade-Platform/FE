import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptCard from '../../components/PromptCard/PromptCard';
import './PromptRegisterPage.css';
import { useAuthApi } from '../../hooks/useAuthApi';
import { useDropzone } from 'react-dropzone';

// 예시 카테고리
const MODEL_CATEGORIES = [
  { id: 1, name: 'gpt-4o' },
  { id: 2, name: 'Midjourney' },
  { id: 3, name: 'gemini 2.5 Pro' },
];
const TYPE_CATEGORIES = [
  { id: 1, name: '텍스트' },
  { id: 2, name: '이미지 생성' },
  { id: 3, name: '영상 생성' },
];

const initialForm = {
  promptName: '',
  promptContent: '',
  promptDescription: '',
  price: '',
  exampleFile: null,
  exampleType: 'IMAGE',
  modelCategoryId: MODEL_CATEGORIES[0].id.toString(),
  typeCategoryId: TYPE_CATEGORIES[0].id.toString(),
};

const PromptRegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { authFetch } = useAuthApi();

  // Dropzone 설정
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      let type = 'TEXT';
      if (file.type.startsWith('image/')) type = 'IMAGE';
      else if (file.type.startsWith('video/')) type = 'VIDEO';
      else if (file.type.startsWith('text/')) type = 'TEXT';
      setForm({ ...form, exampleFile: file, exampleType: type });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': [],
      'video/*': [],
      'text/*': [],
      'application/pdf': []
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('promptName', form.promptName);
      formData.append('promptContent', form.promptContent);
      formData.append('promptDescription', form.promptDescription);
      formData.append('price', form.price);
      if (form.exampleFile) {
        formData.append('exampleFile', form.exampleFile);
      }
      formData.append('exampleType', form.exampleType);
      formData.append('modelCategoryIds', form.modelCategoryId);
      formData.append('typeCategoryIds', form.typeCategoryId);

      const token = await authFetch('/api/prompts', { method: 'POST' }).catch(()=>null);
      const realToken = token?.token || localStorage.getItem('access_token');
      await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${realToken}` 
        },
        body: formData
      });
      alert('프롬프트가 성공적으로 등록되었습니다!');
      setForm(initialForm);
    } catch (err) {
      setError(err.message || '등록 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // PromptCard 미리보기용 데이터
  const previewPrompt = {
    id: 'preview',
    title: form.promptName || '프롬프트 제목을 입력하세요',
    description: form.promptDescription || '프롬프트 설명을 입력하세요.',
    category: TYPE_CATEGORIES.find(cat => cat.id.toString() === form.typeCategoryId)?.name || '카테고리',
    rating: 0.0,
    price: parseInt(form.price) || 0,
    author: '작성자',
    downloads: 0,
    tags: ['미리보기']
  };

  return (
    <div className="prompt-register-container">
      {/* 네비게이션 바 */}
      <nav className="register-navbar">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="navbar-title">Prumpt2.0</h1>
        <div></div> {/* 균형을 위한 빈 div */}
      </nav>

      {/* 메인 컨텐츠 */}
      <div className="register-content">
        {/* 왼쪽: PromptCard 미리보기 */}
        <div className="preview-section">
          <h2 className="section-title">미리보기</h2>
          <div className="card-preview">
            <PromptCard prompt={previewPrompt} />
          </div>
        </div>

        {/* 오른쪽: 입력 폼 */}
        <div className="form-section">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="register-form">
              {/* 프롬프트 이름 */}
              <div className="input-group">
                <label htmlFor="promptName">프롬프트 이름</label>
                <input
                  id="promptName"
                  type="text"
                  name="promptName"
                  value={form.promptName}
                  onChange={handleChange}
                  placeholder="프롬프트 이름을 입력하세요"
                  required
                />
              </div>

              {/* 프롬프트 설명 */}
              <div className="input-group">
                <label htmlFor="promptDescription">프롬프트 설명</label>
                <textarea
                  id="promptDescription"
                  name="promptDescription"
                  value={form.promptDescription}
                  onChange={handleChange}
                  placeholder="프롬프트에 대한 설명을 입력하세요."
                  rows={4}
                  required
                />
              </div>

              {/* 프롬프트 내용 */}
              <div className="input-group">
                <label htmlFor="promptContent">프롬프트 내용</label>
                <textarea
                  id="promptContent"
                  name="promptContent"
                  value={form.promptContent}
                  onChange={handleChange}
                  placeholder="프롬프트 내용을 입력하세요. 사용자가 변경할 부분은 [변경할 내용]으로 표시해주세요."
                  rows={6}
                  required
                />
              </div>

              {/* 가격 */}
              <div className="input-group">
                <label htmlFor="price">가격 (원)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  min={0}
                  required
                />
              </div>

              {/* 예시 파일 업로드 */}
              <div className="input-group">
                <label>예시 파일</label>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  {form.exampleFile ? (
                    <div className="file-selected">
                      <span>{form.exampleFile.name}</span>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({ ...form, exampleFile: null });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="dropzone-content">
                      {isDragActive ? (
                        <p>파일을 드롭하세요...</p>
                      ) : (
                        <p>파일을 드래그하거나 클릭하여 업로드</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 모델 카테고리 */}
              <div className="input-group">
                <label htmlFor="modelCategory">모델 카테고리</label>
                <select
                  id="modelCategory"
                  name="modelCategoryId"
                  value={form.modelCategoryId}
                  onChange={handleChange}
                  required
                >
                  {MODEL_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* 타입 카테고리 */}
              <div className="input-group">
                <label htmlFor="typeCategory">타입 카테고리</label>
                <select
                  id="typeCategory"
                  name="typeCategoryId"
                  value={form.typeCategoryId}
                  onChange={handleChange}
                  required
                >
                  {TYPE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {error && <div className="error-message">{error}</div>}
            </form>
          </div>

          {/* 등록 버튼 */}
          <button 
            type="submit" 
            className="register-button"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptRegisterPage;
