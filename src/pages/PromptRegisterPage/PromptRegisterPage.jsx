import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';
import PromptCard from '../../components/PromptCard/PromptCard';
import './PromptRegisterPage.css';
import { useAuthApi } from '../../hooks/useAuthApi';
import { useAuth } from '../../contexts/AuthContext';
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
  description: '',
  price: '',
  exampleFile: null,
  exampleType: 'IMAGE',
  modelCategoryId: MODEL_CATEGORIES[0].id.toString(),
  typeCategoryId: TYPE_CATEGORIES[0].id.toString(),
};

const PromptRegisterPage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useAlert();
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { authFetch } = useAuthApi();
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const { promptName, description, promptContent, price, exampleFile } = form;
    const isValid =
      promptName.trim() !== '' &&
      description.trim() !== '' &&
      promptContent.trim() !== '' &&
      price.toString().trim() !== '' &&
      exampleFile !== null;
    setIsFormValid(isValid);
  }, [form]);

  const showValidationErrors = () => {
    const newErrors = {};
    if (form.promptName.trim() === '') newErrors.promptName = '프롬프트 이름을 입력해주세요.';
    if (form.description.trim() === '') newErrors.description = '프롬프트 설명을 입력해주세요.';
    if (form.promptContent.trim() === '') newErrors.promptContent = '프롬프트 내용을 입력해주세요.';
    if (form.price.toString().trim() === '') newErrors.price = '가격을 입력해주세요.';
    if (form.exampleFile === null) newErrors.exampleFile = '예시 파일을 업로드해주세요.';
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Dropzone 설정
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      let type = 'TEXT';
      if (file.type.startsWith('image/')) type = 'IMAGE';
      else if (file.type.startsWith('video/')) type = 'VIDEO';
      else if (file.type.startsWith('text/')) type = 'TEXT';
      setForm({ ...form, exampleFile: file, exampleType: type });

      if (errors.exampleFile) {
        setErrors(prev => ({ ...prev, exampleFile: null }));
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      showValidationErrors();
      return;
    }
    setError('');
    setErrors({});
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('promptName', form.promptName);
      formData.append('promptContent', form.promptContent);
      formData.append('description', form.description);
      formData.append('price', form.price);
      if (form.exampleFile) {
        formData.append('exampleFile', form.exampleFile);
      }
      formData.append('exampleType', form.exampleType);
      formData.append('modelCategoryIds', form.modelCategoryId);
      formData.append('typeCategoryIds', form.typeCategoryId);

      // useAuthApi의 authFetch를 사용
      const response = await authFetch('/api/prompts', {
        method: 'POST',
        body: formData,
      });

      // authFetch가 자동으로 JSON 파싱을 시도하므로, 
      // 성공 시에는 response가 이미 파싱된 객체일 것입니다.
      console.log('프롬프트 등록 성공:', response);
      
      showSuccess('프롬프트가 성공적으로 등록되었습니다!');
      setForm(initialForm);
      navigate(-1);
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
    description: form.description || '프롬프트 설명을 입력하세요.',
    category: TYPE_CATEGORIES.find(cat => cat.id.toString() === form.typeCategoryId)?.name || '카테고리',
    rating: 0.0,
    price: parseInt(form.price) || 0,
    author: '작성자',
    downloads: 0,
    tags: ['미리보기']
  };

  return (
    <div className="prompt-register-container">
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
                {errors.promptName && <div className="error-text">{errors.promptName}</div>}
              </div>

              {/* 프롬프트 설명 */}
              <div className="input-group">
                <label htmlFor="description">프롬프트 설명</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="프롬프트에 대한 설명을 입력하세요."
                  rows={4}
                  required
                />
                {errors.description && <div className="error-text">{errors.description}</div>}
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
                {errors.promptContent && <div className="error-text">{errors.promptContent}</div>}
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
                {errors.price && <div className="error-text">{errors.price}</div>}
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
                {errors.exampleFile && <div className="error-text">{errors.exampleFile}</div>}
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

              {/* 등록 버튼 */}
              <button 
                type="submit" 
                className={`register-button ${!isFormValid ? 'disabled-look' : ''}`}
                disabled={uploading}
              >
                {uploading ? '등록 중...' : '등록하기'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptRegisterPage;
