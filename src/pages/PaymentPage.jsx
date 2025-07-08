import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/Background/StarryBackground';
import { useLoadingMessage, useMinimumLoadingTime } from '../hooks/useLoadingMessage';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, paymentAPI, setAuthToken } from '../services/api';
import './PaymentPage.css';

const PaymentPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'fail' | null
  const [paymentAmount, setPaymentAmount] = useState(null);
  const { loadingMessage, refreshMessage } = useLoadingMessage(true);
  const shouldShowLoading = useMinimumLoadingTime(loading, 800);
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth();

  // 포인트 옵션 정의
  const pointOptions = [
    { points: 1000, amount: 1000 },
    { points: 3000, amount: 3000 },
    { points: 5000, amount: 5000 },
    { points: 10000, amount: 10000 },
    { points: 30000, amount: 30000 },
    { points: 50000, amount: 50000 },
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchUserProfile = async () => {
    try {
      const authToken = await getAccessTokenSilently();
      setAuthToken(authToken);
      
      const data = await userAPI.getProfile();
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('사용자 프로필 조회 오류:', error);
      return null;
    }
  };

  const confirmPayment = async (paymentKey, orderId, amount) => {
    try {
      const authToken = await getAccessTokenSilently();
      setAuthToken(authToken);
      
      // 백엔드가 POST 메소드와 URL 파라미터를 함께 기대하므로, 커스텀 API 호출을 사용합니다.
      const encodedPaymentKey = encodeURIComponent(paymentKey);
      const encodedOrderId = encodeURIComponent(orderId);
      const url = `/payments/confirm?paymentKey=${encodedPaymentKey}&orderId=${encodedOrderId}&amount=${amount}`;

      console.log('결제 확인 요청 URL:', url);

      // API 클라이언트의 request 메서드를 직접 사용
      const response = await fetch(`${userAPI.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}${url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`결제 확인 실패: ${response.status} ${errorBody}`);
      }
      
      const result = await response.text();
      console.log('결제 확인 성공:', result);
      return result;
    } catch (error) {
      console.error('결제 확인 오류:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (amount) => {
    setPaymentStatus('success');
    setPaymentAmount(amount);
    await fetchUserProfile(); // 포인트 갱신

    // 5초 후 성공 메시지 숨기기 및 상태 초기화
    setTimeout(() => {
      setPaymentStatus(null);
      setPaymentAmount(null);
    }, 5000);
  };

  useEffect(() => {
    const processPaymentResult = async () => {
      // URL 파라미터를 컴포넌트 상태로 먼저 가져옵니다.
      const urlParams = new URLSearchParams(window.location.search);
      const paymentKey = urlParams.get('paymentKey');
      const orderId = urlParams.get('orderId');
      const amount = urlParams.get('amount');
      const isFail = urlParams.get('fail') === 'true';

      // URL에서 파라미터를 즉시 제거하여 중복 처리를 방지합니다.
      if (paymentKey || isFail) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (isFail) {
        setPaymentStatus('fail');
        // 5초 후 실패 메시지 숨기기
        setTimeout(() => setPaymentStatus(null), 5000);
        return;
      }

      if (paymentKey && orderId && amount) {
        setLoading(true);
        try {
          if (!user) throw new Error('사용자 정보가 없습니다.');
          await confirmPayment(paymentKey, orderId, parseInt(amount));
          await handlePaymentSuccess(amount);
        } catch (e) {
          console.error(e);
          setPaymentStatus('fail');
          // 5초 후 실패 메시지 숨기기
          setTimeout(() => setPaymentStatus(null), 5000);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserProfile(); // 페이지 첫 로드 시 사용자 정보 가져오기
    processPaymentResult(); // 결제 결과 처리
  }, [user]); // user 객체가 로드되면 이 effect를 다시 실행합니다.

  const handlePayment = () => {
    if (!window.TossPayments) {
      alert('결제 모듈이 로드되지 않았습니다.');
      return;
    }

    if (!userProfile || !userProfile.userId) {
      alert('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setLoading(true);
    refreshMessage(); // 새로운 로딩 메시지 생성
    
    const tossPayments = window.TossPayments('test_ck_Poxy1XQL8R1WlLW1eNDXr7nO5Wml');
    const orderId = 'order_' + new Date().getTime();

    // 성공 URL에 paymentKey 파라미터를 추가하지 않음 (토스페이먼츠가 자동으로 추가함)
    const successUrl = `${window.location.origin}/payment?orderId=${orderId}&amount=${selectedAmount}`;
    const failUrl = `${window.location.origin}/payment?fail=true`;

    tossPayments.requestPayment('카드', {
      amount: selectedAmount,
      orderId,
      orderName: `${selectedAmount} 포인트 결제`,
      customerName: userProfile?.profileName || '사용자',
      successUrl,
      failUrl
    }).catch(error => {
      console.error('결제 요청 오류:', error);
      alert('결제 요청 중 오류가 발생했습니다.');
      setLoading(false);
    });
  };

  return (
    <div className="payment-page">
      <StarryBackground />
      <main className="payment-container">
        <h1 className="payment-title">포인트 충전</h1>

        {shouldShowLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-message">{loadingMessage}</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="payment-success-message">
            <p>결제가 완료되었습니다! {Number(paymentAmount).toLocaleString()}포인트가 충전되었습니다.</p>
          </div>
        )}

        {paymentStatus === 'fail' && (
          <div className="payment-error-message">
            <p>결제가 취소되었거나 실패했습니다. 문제가 지속되면 고객센터로 문의해주세요.</p>
          </div>
        )}

        <div className="point-options">
          {pointOptions.map((option) => (
            <button
              key={option.points}
              className={`point-option ${selectedAmount === option.amount ? 'selected' : ''}`}
              onClick={() => setSelectedAmount(option.amount)}
            >
              {option.points} 포인트
              <span className="amount">{option.amount}원</span>
            </button>
          ))}
        </div>

        <div className="payment-summary">
          <h2>결제 정보</h2>
          <div className="summary-item"><span>충전 포인트:</span><span>{selectedAmount} 포인트</span></div>
          <div className="summary-item"><span>결제 금액:</span><span>{selectedAmount}원</span></div>
          {userProfile && (
            <>
              <div className="summary-item"><span>사용자:</span><span>{userProfile.profileName}</span></div>
              <div className="summary-item"><span>현재 포인트:</span><span>{userProfile.point || 0} 포인트</span></div>
            </>
          )}
        </div>

        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={loading || !userProfile}
        >
          {loading ? loadingMessage : '결제하기'}
        </button>
      </main>
    </div>
  );
};

export default PaymentPage;