// API 기본 설정 - CloudFront 우회를 위해 직접 ALB 도메인 사용
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// 디버깅: 현재 API URL 확인
console.log('🔍 Current API Base URL:', API_BASE_URL);
console.log('🔍 Environment Mode:', import.meta.env.MODE);
console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL);

// 프로덕션에서 localhost 사용 여부 확인
const isProductionWithLocalhost = import.meta.env.MODE === 'production' && API_BASE_URL.includes('localhost');

// HTTP 클라이언트 설정
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // 인증 토큰 설정
  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // 기본 fetch 래퍼
  async request(endpoint, options = {}) {
    // 프로덕션에서 localhost API 호출 방지
    if (isProductionWithLocalhost) {
      console.warn('API call skipped in production (localhost not available):', endpoint);
      return { data: [], message: 'API not available in production' };
    }

    const url = `${this.baseURL}${endpoint}`;
    // FormData 요청의 경우 완성된 헤더를 그대로 사용
    const config = {
      ...options,
      headers: options._skipDefaultHeaders ? options.headers : {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // 디버깅: 요청 정보 로깅
    console.log('🌐 API 요청 정보:', {
      url,
      method: options.method || 'GET',
      hasAuthToken: !!this.defaultHeaders['Authorization'],
      authTokenPreview: this.defaultHeaders['Authorization'] ? 
        this.defaultHeaders['Authorization'].substring(0, 20) + '...' : 'None',
      headers: Object.keys(config.headers),
      hasBody: !!options.body,
      bodyType: options.body?.constructor?.name,
    });

    try {
      const response = await fetch(url, config);
      
      console.log('📡 API 응답 상태:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
      
      if (!response.ok) {
        let errorData = {};
        const contentType = response.headers.get('content-type');
        
        try {
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            const errorText = await response.text();
            console.log('❌ 비-JSON 오류 응답:', errorText);
            errorData = { message: errorText };
          }
        } catch (parseError) {
          console.log('❌ 오류 응답 파싱 실패:', parseError);
        }
        
        console.log('❌ API 오류 상세:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return response;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // HTTP 메서드들
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    const isFormData = data instanceof FormData;
    
    let headers;
    if (isFormData) {
      // FormData일 때는 Content-Type 헤더를 완전히 제거
      const { 'Content-Type': _, ...headersWithoutContentType } = this.defaultHeaders;
      const { 'content-type': __, ...cleanHeaders } = headersWithoutContentType;
      headers = { ...cleanHeaders, ...options.headers };
      
      // options.headers에서도 Content-Type 제거
      if (options.headers) {
        const { 'Content-Type': ___, 'content-type': ____, ...cleanOptionsHeaders } = options.headers;
        headers = { ...cleanHeaders, ...cleanOptionsHeaders };
      }
      
      console.log('🧹 FormData용 헤더 정리 완료:', Object.keys(headers));
    } else {
      headers = { ...this.defaultHeaders, ...options.headers };
    }
    
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers,
      _skipDefaultHeaders: isFormData, // FormData 요청 시 기본 헤더 병합 건너뛰기
    });
  }

  put(endpoint, data, options = {}) {
    const isFormData = data instanceof FormData;
    
    let headers;
    if (isFormData) {
      // FormData일 때는 Content-Type 헤더를 완전히 제거
      const { 'Content-Type': _, ...headersWithoutContentType } = this.defaultHeaders;
      headers = { ...headersWithoutContentType, ...options.headers };
    } else {
      headers = { ...this.defaultHeaders, ...options.headers };
    }
    
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      headers,
      _skipDefaultHeaders: isFormData, // FormData 요청 시 기본 헤더 병합 건너뛰기
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// API 클라이언트 인스턴스
const apiClient = new ApiClient();

// 프롬프트 관련 API - 백엔드 엔드포인트에 맞게 수정
export const promptAPI = {
  // 인기 프롬프트 조회
  getPopularPrompts: (limit = 8) => 
    apiClient.get(`/home/prompts/popular?size=${limit}`),
  
  // 최신 프롬프트 조회
  getLatestPrompts: (limit = 8) => 
    apiClient.get(`/home/prompts/recent?size=${limit}`),
  
  // 프롬프트 검색
  searchPrompts: (keyword, page = 0, size = 10) => 
    apiClient.get(`/home/prompts/search?keyword=${keyword}&page=${page}&size=${size}`),
  
  // 프롬프트 카테고리 필터링
  filterPrompts: (modelCategory, typeCategory, page = 0, size = 10) => {
    const params = new URLSearchParams();
    if (modelCategory) params.append('modelCategorySlug', modelCategory);
    if (typeCategory) params.append('typeCategorySlug', typeCategory);
    params.append('page', page);
    params.append('size', size);
    return apiClient.get(`/home/prompts/filter?${params}`);
  },
  
  // 프롬프트 상세 조회
  getPromptById: (id) => 
    apiClient.get(`/prompts/${id}`),
  
  // 프롬프트 리뷰 목록 조회
  getPromptReviews: (id, page = 0, size = 10) => 
    apiClient.get(`/api/reviews/${id}`),
  
  // 프롬프트 AI 평가 조회
  getPromptAiEvaluation: (id) => 
    apiClient.get(`/prompts/${id}/ai-evaluation`),
  
  // 프롬프트 이미지/썸네일 목록 조회
  getPromptImages: (id) => 
    apiClient.get(`/prompts/${id}/images`),
  
  // 프롬프트 생성
  createPrompt: (promptData) => 
    apiClient.post('/prompts', promptData),
  
  // 프롬프트 수정
  updatePrompt: (id, promptData) => 
    apiClient.put(`/prompts/${id}`, promptData),
  
  // 프롬프트 삭제
  deletePrompt: (id) => 
    apiClient.delete(`/prompts/${id}`),
  
  // 프롬프트 좋아요
  likePrompt: (id) => 
    apiClient.post(`/prompts/${id}/like`),
  
  // 프롬프트 구매
  purchasePrompt: (id) => 
    apiClient.post(`/prompts/${id}/purchase`),
};

// 사용자 관련 API
export const userAPI = {
  // 사용자 프로필 조회
  getProfile: () => 
    apiClient.get('/mypage/profile'),
  
  // 사용자 프로필 수정
  updateProfile: (userData) => 
    apiClient.put('/mypage/me/profile/update', userData),
  
  // 구매 내역 조회
  getPurchaseHistory: (page = 0, size = 10) => 
    apiClient.get(`/mypage/prompts/purchased?page=${page}&size=${size}`),
  
  // 판매 내역 조회
  getSellingHistory: (page = 0, size = 10) => 
    apiClient.get(`/mypage/prompts/selling?page=${page}&size=${size}`),
  
  // 위시리스트 조회
  getWishlist: (page = 0, size = 10) => 
    apiClient.get(`/wishlist?page=${page}&size=${size}`),
  
  // 위시리스트 추가
  addToWishlist: (promptId) => 
    apiClient.post(`/wishlist/${promptId}`),
  
  // 위시리스트 제거
  removeFromWishlist: (promptId) => 
    apiClient.delete(`/wishlist/${promptId}`),
};

// 결제 관련 API
export const paymentAPI = {
  // 결제 요청
  createPayment: (paymentData) => 
    apiClient.post('/payments', paymentData),
  
  // 결제 확인
  confirmPayment: (paymentId) => 
    apiClient.post(`/payments/${paymentId}/confirm`),
  
  // 결제 내역 조회
  getPaymentHistory: () => 
    apiClient.get('/payments/history'),
};

// 통계 관련 API
export const statsAPI = {
  // 대시보드 통계
  getDashboardStats: () => 
    apiClient.get('/stats/dashboard'),
  
  // 프롬프트 통계
  getPromptStats: (promptId) => 
    apiClient.get(`/stats/prompts/${promptId}`),
  
  // 수익 모니터링 데이터 조회
  getMonitoringData: (period = 'MONTH') =>
    apiClient.get(`/mypage/monitoring?period=${period}`),
};


// 인증 초기화 함수
export const initializeAuth = () => {
  // 로컬 스토리지에서 토큰 복원
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
  }
};

// 인증 토큰 관리
export const setAuthToken = (token) => {
  apiClient.setAuthToken(token);
  if (token) {
      localStorage.setItem('authToken', token);
  } else {
      localStorage.removeItem('authToken');
  }
};


// 기본 API 클라이언트 노출
export default apiClient; 