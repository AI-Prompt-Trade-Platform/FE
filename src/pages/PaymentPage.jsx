import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/Background/StarryBackground';
import { useLoadingMessage, useMinimumLoadingTime } from '../hooks/useLoadingMessage';
import './PaymentPage.css';

const PaymentPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(null);
  const { loadingMessage, refreshMessage } = useLoadingMessage(true);
  const shouldShowLoading = useMinimumLoadingTime(loading, 800);
  const navigate = useNavigate();

  // 인증 토큰 (실제 환경에서는 Auth 컨텍스트나 상태 관리 라이브러리에서 가져와야 함)
  const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVsSVVkQWFOV3VJbmdqaFVqbVlrUiJ9.eyJpc3MiOiJodHRwczovL2Rldi1vbXVkdTQ2NWVtazN0MmpqLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJFN0w4VDRYVVZIRWRuSUhMS2hacGFlcGdMMlk5Z1h3Y0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkucHJ1bXB0LmxvY2FsIiwiaWF0IjoxNzUwNDA3MjAzLCJleHAiOjE3NTA0OTM2MDMsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IkU3TDhUNFhVVkhFZG5JSExLaFpwYWVwZ0wyWTlnWHdjIn0.SkE15UHNc9KmtPE264ZI2qKYZv_4D0EokUmDEoqTtVCCwaEjoDBRT8w904ed4sht5Wi1kC-HbIo1kzxAqPfvLDqN3jZYYr-tC8P0j8rAPAmyY_jkvbOJL_t-zd7lRdF-rwsxo34ttBjHicdnj9qvk-Mzg8EBz4Jr1WM9lbXeAPjX1FFUDo9EXSAinDETYxTIlBka45VLmutRyjzvM4IDpSgqrEZaCmLt2g0zFCYFE4fiIdUPufnUXtekQEvX4Dkdz6CQHC13TDU7eQ8SLdqQeaEkGzg0PHXfKMV9V7TS4mCkO5jwSn3y7Iruym8iZUWefpPti7fRfJp6CWI0nLoMpQ";

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
      const response = await fetch('http://localhost:8080/api/mypage/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('프로필 정보를 가져오는데 실패했습니다.');

      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('사용자 프로필 조회 오류:', error);
      return null;
    }
  };

  const confirmPayment = async (paymentKey, orderId, amount, userId) => {
    try {
      // URL 파라미터 인코딩
      const encodedPaymentKey = encodeURIComponent(paymentKey);
      const encodedOrderId = encodeURIComponent(orderId);

      // PaymentWidgetController에서 제공하는 GET 엔드포인트 사용
      const url = `http://localhost:8080/api/payments/confirm?paymentKey=${encodedPaymentKey}&orderId=${encodedOrderId}&amount=${amount}&userId=${userId}`;

      console.log('결제 확인 요청 URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.text();
      console.log('결제 확인 성공:', result);
      return result;
    } catch (error) {
      error('결제 확인 오류:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (amount) => {
    setPaymentSuccess(true);
    setPaymentAmount(amount);
    await fetchUserProfile(); // 포인트 갱신

    // 5초 후 성공 메시지 숨기기
    setTimeout(() => {
      setPaymentSuccess(false);
      setPaymentAmount(null);
      // 결제 완료 후 다시 결제 페이지로 리다이렉트 (URL 파라미터 제거)
      navigate('/payment', { replace: true });
    }, 5000);
  };

  useEffect(() => {
    const init = async () => {
      const profile = await fetchUserProfile();

      const urlParams = new URLSearchParams(window.location.search);
      const paymentKey = urlParams.get('paymentKey');
      const orderId = urlParams.get('orderId');
      const amount = urlParams.get('amount');

      if (paymentKey && orderId && amount) {
        setLoading(true);
        try {
          if (!profile || !profile.userId) throw new Error('사용자 ID 누락');
          await confirmPayment(paymentKey, orderId, parseInt(amount), profile.userId);
          await handlePaymentSuccess(amount);
        } catch (e) {
          alert('결제 확인 실패: ' + e.message);
        } finally {
          setLoading(false);
          // URL 파라미터 제거 (history API 사용)
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    init();
  }, []);

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

        {paymentSuccess && (
          <div className="payment-success-message">
            <p>결제가 완료되었습니다! {paymentAmount}포인트가 충전되었습니다.</p>
          </div>
        )}

        {window.location.search.includes('fail=true') && (
          <div className="payment-error-message">
            <p>결제가 취소되었거나 실패했습니다.</p>
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