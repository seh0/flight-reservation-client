import React, { useState, useRef } from 'react';
import '../styles/HelpPage.css';

const faqs = [
  {
    question: "항공권 예매는 어떻게 하나요?",
    answer:
      "항공권 예매는 홈페이지 상단의 '항공권 예매' 메뉴 또는 메인 화면에서 출발지, 도착지, 여행 날짜를 입력하여 가능한 항공편을 검색하실 수 있습니다. 검색 결과에서 원하는 항공편을 선택하고 승객 정보를 입력한 후, 결제 단계를 거치면 예매가 완료됩니다. 결제가 완료되면 예약 확인 이메일이 발송되며, 마이페이지에서도 예매 내역을 확인할 수 있습니다.",
  },
  {
    question: "예매한 항공권은 어디서 확인하나요?",
    answer:
      "항공권 예매 후에는 로그인 상태에서 마이페이지 > 예매 내역 메뉴를 통해 모든 예약 내역을 확인하실 수 있습니다. 각 예약 건을 클릭하면 탑승자 정보, 항공편 정보, 결제 상태, 수하물 정보 등을 자세히 확인할 수 있으며, PDF 예약 확인서도 다운로드 가능합니다. 또한 결제 완료 시 입력하신 이메일로도 예약 확인 메일이 자동 발송됩니다.",
  },
  {
    question: "항공권 취소 및 환불은 어떻게 하나요?",
    answer:
      "항공권 취소는 마이페이지 > 예매 내역에서 해당 예약을 선택한 뒤 '취소 요청' 버튼을 통해 진행하실 수 있습니다. 항공사 및 항공권 종류(환불 가능/불가능)에 따라 환불 가능 여부와 수수료가 다를 수 있으며, 일부 프로모션 항공권은 환불이 제한될 수 있습니다. 취소 완료 후에는 카드사에 따라 환불이 완료되기까지 영업일 기준 3~7일 정도 소요될 수 있습니다.",
  },
  {
    question: "수하물 규정은 어떻게 되나요?",
    answer:
      "국내선 및 국제선 모두 항공사 정책에 따라 위탁 수하물 및 기내 수하물 기준이 다릅니다. 대부분의 국제선은 23kg 이하의 위탁 수하물 1개를 무료로 제공하지만, 일부 저가 항공사의 경우 수하물은 유료로 사전 구매해야 합니다. 기내 수하물은 보통 10kg 이내, 가로+세로+높이의 합이 115cm 이하인 가방 1개로 제한됩니다. 수하물 규정은 항공권 예매 시 또는 항공사 홈페이지에서 반드시 확인해 주세요.",
  },
];

function HelpPage() {
  const [activeIndexes, setActiveIndexes] = useState([]);
  const contentRefs = useRef([]);

  const toggleAnswer = (index) => {
    if (activeIndexes.includes(index)) {
      setActiveIndexes(activeIndexes.filter((i) => i !== index));
    } else {
      setActiveIndexes([...activeIndexes, index]);
    }
  };

  return (
    <div className="help-container">
      <h1 className="help-title">고객센터</h1>
      <p className="help-description">
        자주 묻는 질문을 통해 빠르게 문제를 해결해 보세요.<br />
        더 궁금한 사항은 고객센터로 문의해 주세요.
      </p>

      <div className="help-faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="help-faq-item">
            <button className="help-question" onClick={() => toggleAnswer(index)}>
              <span>{faq.question}</span>
              <span className="help-toggle-icon">
                {activeIndexes.includes(index) ? '▲' : '▼'}
              </span>
            </button>
            <div
              className="help-answer-wrapper"
              style={{
                maxHeight:
                  activeIndexes.includes(index) && contentRefs.current[index]
                    ? `${contentRefs.current[index].scrollHeight}px`
                    : '0px',
              }}
            >
              <div
                className="help-answer"
                ref={(el) => (contentRefs.current[index] = el)}
              >
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="help-contact">
        고객센터 운영시간: 평일 09:00 ~ 18:00 (주말 및 공휴일 제외)<br />
        전화 문의: 1544-0000 | 이메일: support@example.com
      </div>
    </div>
  );
}

export default HelpPage;
