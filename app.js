// Application State
let appState = {
    industry: null,
    persona: null,
    responses: {},
    currentStep: 'intro'
};

// Industry and Persona Mappings
const INDUSTRY_NAMES = {
    'restaurant': '음식점',
    'cafe': '카페',
    'fitness': '피트니스'
};

const PERSONA_NAMES = {
    'light_visitor': '가벼운 방문자',
    'problem_solver': '문제 해결형 고객',
    'recommendation_based': '추천 기반 고객',
    'loyal_customer': '충성 고객'
};

// Questions Data
const COMMON_QUESTIONS = [
    '우리 매장은 고객의 즉각적인 만족을 충족시킨다',
    '내 매장은 고객의 반복 방문을 유도하는 장치가 있다 (ex. 단골 시스템, 혜택 등)',
    '고객은 나의 브랜드에 대해 차별성을 느낄 수 있다',
    '내 매장은 온라인에서 신뢰를 줄 수 있는 후기/정보를 충분히 제공하고 있다',
    '나의 상품/서비스는 고객 입장에서 가격 대비 가치가 충분히 높다',
    '고객은 내 매장의 브랜드나 스토리에 관심을 가진다',
    '고객은 우리 매장을 친구에게 추천하고 싶어할 것이다',
    '내 매장은 업종 내 경쟁자들과 비교해 돋보이는 포인트가 명확하다',
    '우리 매장은 고객의 니즈 변화에 민감하게 대응하고 있다',
    '고객은 우리 매장에서 "자신에게 맞는 선택"을 하고 있다고 느낀다'
];

const INDUSTRY_QUESTIONS = {
    'restaurant': [
        '고객은 식사 외의 경험(예: 공간, 이야기, 서비스)도 중요하게 여긴다',
        '메뉴 구성은 고객 니즈에 맞게 최적화되어 있다',
        '방문 전 검색이나 리뷰 확인이 고객의 행동에 영향을 준다',
        '음식 외에도 리뷰, 사진, 블로그 콘텐츠가 우리 매장을 대표한다',
        '우리 매장은 주변 다른 음식점과 구분되는 명확한 키워드가 있다'
    ],
    'cafe': [
        '고객은 공간 분위기와 인테리어를 매우 중요하게 생각한다',
        '커피나 음료 외에도 디저트, 포토존 등 복합적 니즈를 만족시킨다',
        '고객은 SNS 공유나 인증을 위해 방문하는 성향이 있다',
        '우리 매장의 이미지나 콘셉트는 뚜렷하고 일관성 있다',
        '우리 카페는 경쟁사 대비 인스타그램 등에서 더 많은 반응을 유도한다'
    ],
    'fitness': [
        '고객은 운동 목적에 맞는 맞춤형 지도를 기대한다',
        '고객은 수업 이외에도 결과 측정, 상담 등 부가 서비스를 원한다',
        '전문가로서의 신뢰와 커뮤니케이션 역량이 고객 유치에 영향을 준다',
        '내 센터는 회원의 변화 과정을 명확히 시각화할 수 있다',
        '우리는 고객의 운동 여정을 콘텐츠로 활용하고 있다'
    ]
};

const LIKERT_OPTIONS = [
    { value: 1, text: '전혀 그렇지 않다' },
    { value: 2, text: '그렇지 않다' },
    { value: 3, text: '보통이다' },
    { value: 4, text: '그렇다' },
    { value: 5, text: '매우 그렇다' }
];

// Utility Functions
function showStep(stepName) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show target step
    const targetStep = document.getElementById(`step-${stepName}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        appState.currentStep = stepName;
        
        // Update specific step content
        if (stepName === 'questions') {
            generateQuestions();
        } else if (stepName === 'results') {
            generateResults();
        }
    }
    
    // Reinitialize Feather icons
    feather.replace();
}

function restartApp() {
    appState = {
        industry: null,
        persona: null,
        responses: {},
        currentStep: 'intro'
    };
    
    // Reset form selections
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    // Reset buttons
    document.getElementById('industryNext').disabled = true;
    document.getElementById('personaNext').disabled = true;
    
    // Reset visual selections
    document.querySelectorAll('.industry-label, .persona-label').forEach(label => {
        label.classList.remove('selected');
    });
    
    showStep('intro');
}

// Industry Selection
function selectIndustry(industry) {
    appState.industry = industry;
    
    // Update radio button
    document.getElementById(industry).checked = true;
    
    // Enable next button
    document.getElementById('industryNext').disabled = false;
    
    console.log('Industry selected:', industry);
}

function nextToPersona() {
    if (!appState.industry) {
        alert('업종을 선택해주세요.');
        return;
    }
    
    // Update industry name in persona step
    document.getElementById('industryName').textContent = INDUSTRY_NAMES[appState.industry];
    
    showStep('persona');
}

// Persona Selection
function selectPersona(persona) {
    appState.persona = persona;
    
    // Update radio button
    document.getElementById(persona).checked = true;
    
    // Enable next button
    document.getElementById('personaNext').disabled = false;
    
    console.log('Persona selected:', persona);
}

function nextToQuestions() {
    if (!appState.persona) {
        alert('페르소나를 선택해주세요.');
        return;
    }
    
    showStep('questions');
}

// Questions Generation
function generateQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    let questionNum = 1;
    
    // Common questions
    COMMON_QUESTIONS.forEach((question, index) => {
        const questionHtml = createQuestionHtml(questionNum, question, `q${questionNum}`);
        container.appendChild(questionHtml);
        questionNum++;
    });
    
    // Industry-specific questions
    const industryQuestions = INDUSTRY_QUESTIONS[appState.industry];
    industryQuestions.forEach((question, index) => {
        const questionId = `q${questionNum}_${appState.industry}`;
        const questionHtml = createQuestionHtml(questionNum, question, questionId);
        container.appendChild(questionHtml);
        questionNum++;
    });
}

function createQuestionHtml(number, text, questionId) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-card mb-4';
    
    questionDiv.innerHTML = `
        <h6 class="question-title">
            <span class="question-number">${number}</span>
            ${text}
        </h6>
        <div class="likert-scale">
            ${LIKERT_OPTIONS.map(option => `
                <div class="likert-option">
                    <input type="radio" name="${questionId}" value="${option.value}" id="${questionId}_${option.value}">
                    <label for="${questionId}_${option.value}" class="likert-label">
                        <span class="likert-text">${option.text}</span>
                    </label>
                </div>
            `).join('')}
        </div>
    `;
    
    return questionDiv;
}

// Results Calculation
function calculateResults() {
    // Collect responses
    appState.responses = {};
    
    // Common questions
    for (let i = 1; i <= 10; i++) {
        const value = document.querySelector(`input[name="q${i}"]:checked`);
        if (value) {
            appState.responses[`q${i}`] = parseInt(value.value);
        }
    }
    
    // Industry-specific questions
    for (let i = 11; i <= 15; i++) {
        const questionId = `q${i}_${appState.industry}`;
        const value = document.querySelector(`input[name="${questionId}"]:checked`);
        if (value) {
            appState.responses[questionId] = parseInt(value.value);
        }
    }
    
    // Validate all questions answered
    const expectedQuestions = 15;
    const answeredQuestions = Object.keys(appState.responses).length;
    
    if (answeredQuestions < expectedQuestions) {
        alert('모든 질문에 답변해주세요.');
        return;
    }
    
    console.log('Responses collected:', appState.responses);
    
    showStep('results');
}

function calculateScore(responses, industry) {
    let totalScore = 0;
    let weightedSum = 0;
    
    // Common questions (weight: 1.0)
    for (let i = 1; i <= 10; i++) {
        const response = responses[`q${i}`];
        if (response) {
            totalScore += response * 1.0;
            weightedSum += 1.0;
        }
    }
    
    // Industry-specific questions (weight: 1.2)
    for (let i = 11; i <= 15; i++) {
        const questionId = `q${i}_${industry}`;
        const response = responses[questionId];
        if (response) {
            totalScore += response * 1.2;
            weightedSum += 1.2;
        }
    }
    
    // Calculate final score (0-100 scale)
    const finalScore = Math.round((totalScore / (weightedSum * 5)) * 100);
    
    // Determine engagement level
    let level;
    if (finalScore >= 70) {
        level = '고관여';
    } else if (finalScore >= 50) {
        level = '중간관여';
    } else {
        level = '저관여';
    }
    
    return { score: finalScore, level: level };
}

// Strategy Data
const STRATEGIES = {
    'restaurant': {
        '고관여': {
            'light_visitor': {
                summary: "높은 관여도와 즉흥적 방문 성향을 가진 고객층입니다. 브랜드 인지도가 높아 우연한 방문도 충분히 만족시킬 수 있는 역량이 있습니다.",
                channels: [
                    {
                        title: "온라인 가시성 강화",
                        subtitle: "브랜드 노출 확대",
                        icon: "monitor",
                        theory: "높은 관여도를 가진 가벼운 방문자는 브랜드에 대한 신뢰가 있어 즉흥적 방문을 합니다.",
                        direction: "• 구글 마이비즈니스 최적화로 검색 노출 확대\n• 네이버 플레이스 정보 지속 업데이트\n• 인스타그램 스토리로 실시간 메뉴/분위기 공유\n• 배달앱 노출 순위 관리"
                    },
                    {
                        title: "즉석 만족 시스템",
                        subtitle: "즉시 경험 개선",
                        icon: "zap",
                        theory: "즉흥적 방문객도 즉시 만족할 수 있는 서비스 체계가 필요합니다.",
                        direction: "• 웨이팅 없는 빠른 서비스 체계 구축\n• 시그니처 메뉴 즉석 추천 시스템\n• 테이크아웃 전용 간편 메뉴 운영\n• 실시간 테이블 현황 안내"
                    }
                ]
            },
            'problem_solver': {
                summary: "높은 관여도와 명확한 목적을 가진 고객층입니다. 특정 니즈 해결에 집중하며, 만족도가 높으면 재방문율이 매우 높습니다.",
                channels: [
                    {
                        title: "니즈별 솔루션 제공",
                        subtitle: "목적 기반 서비스",
                        icon: "target",
                        theory: "문제 해결형 고객은 명확한 목적이 있어 그에 맞는 정확한 솔루션을 원합니다.",
                        direction: "• 상황별 맞춤 메뉴 큐레이션 (데이트, 회식, 혼밥 등)\n• 식이제한 고객 전용 메뉴 개발\n• 개인 맞춤 추천 시스템 구축\n• 특별한 날 패키지 서비스"
                    },
                    {
                        title: "전문성 어필",
                        subtitle: "차별화된 전문 영역",
                        icon: "award",
                        theory: "높은 관여도 고객은 전문성을 인정하고 그에 따른 프리미엄을 지불할 의향이 있습니다.",
                        direction: "• 셰프 스토리텔링 및 전문성 강조\n• 식재료 원산지 및 조리법 투명 공개\n• 시즌별 한정 메뉴로 희소성 창출\n• 맛 커스터마이징 서비스 제공"
                    }
                ]
            },
            'recommendation_based': {
                summary: "높은 관여도와 입소문 중시 성향을 가진 고객층입니다. 브랜드 경험을 타인과 적극 공유하며, 강력한 홍보 효과를 만들어낼 수 있습니다.",
                channels: [
                    {
                        title: "공유 가치 창출",
                        subtitle: "인스타그래머블 경험",
                        icon: "share-2",
                        theory: "추천 기반 고객은 경험을 공유할 가치가 있을 때 적극적인 홍보자가 됩니다.",
                        direction: "• 인스타그램 포토존 및 플레이팅 특화\n• 스토리텔링이 있는 메뉴 개발\n• 공유 인센티브 프로그램 운영\n• 리뷰 작성 시 혜택 제공"
                    },
                    {
                        title: "커뮤니티 구축",
                        subtitle: "고객 간 네트워크 형성",
                        icon: "users",
                        theory: "입소문을 중시하는 고객층을 위한 커뮤니티 공간이 브랜드 충성도를 높입니다.",
                        direction: "• 단골 고객 전용 이벤트 개최\n• 리뷰어 모임 및 시식회 운영\n• 추천 고객 리워드 시스템\n• SNS 고객 소통 채널 운영"
                    }
                ]
            },
            'loyal_customer': {
                summary: "높은 관여도와 브랜드 애착을 가진 최고의 고객층입니다. 지속적인 관계 유지를 통해 평생고객으로 발전시킬 수 있습니다.",
                channels: [
                    {
                        title: "VIP 관계 관리",
                        subtitle: "개인화된 프리미엄 서비스",
                        icon: "crown",
                        theory: "충성 고객은 특별 대우를 통해 더욱 강한 유대감을 형성하며 브랜드 가치를 높입니다.",
                        direction: "• 개인 취향 데이터베이스 구축\n• VIP 전용 메뉴 및 서비스 제공\n• 기념일 맞춤 서비스\n• 우선 예약 및 특별 할인"
                    },
                    {
                        title: "브랜드 동반 성장",
                        subtitle: "고객과 함께하는 발전",
                        icon: "trending-up",
                        theory: "충성 고객을 브랜드 발전의 파트너로 만들어 상호 성장하는 관계를 구축합니다.",
                        direction: "• 신메뉴 시식단 운영\n• 브랜드 발전 과정 투명 공유\n• 고객 피드백 적극 반영 시스템\n• 브랜드 성장 혜택 공유"
                    }
                ]
            }
        },
        '중간관여': {
            'light_visitor': {
                summary: "중간 수준의 관여도를 가진 즉흥적 방문 고객입니다. 브랜드에 대한 관심을 높여 관여도를 상승시킬 수 있는 잠재력이 있습니다.",
                channels: [
                    {
                        title: "접근성 개선",
                        subtitle: "방문 장벽 낮추기",
                        icon: "map-pin",
                        theory: "중간관여 고객의 즉흥적 방문을 유도하려면 접근의 편의성이 핵심입니다.",
                        direction: "• 위치 기반 타겟 광고 집행\n• 간판 및 외관 가시성 개선\n• 주차 편의성 강조\n• 대중교통 접근성 안내"
                    },
                    {
                        title: "첫인상 강화",
                        subtitle: "즉시 관심 끌기",
                        icon: "eye",
                        theory: "즉흥적 방문객에게는 첫 5분이 브랜드 인상을 결정하는 중요한 시간입니다.",
                        direction: "• 입구에서의 강력한 첫인상 연출\n• 대표 메뉴 명확한 어필\n• 빠른 서비스 체계 구축\n• 친근한 직원 응대 교육"
                    }
                ]
            },
            'problem_solver': {
                summary: "중간 수준의 관여도로 특정 목적을 가진 고객입니다. 니즈 충족도에 따라 관여도 상승 가능성이 높은 그룹입니다.",
                channels: [
                    {
                        title: "명확한 포지셔닝",
                        subtitle: "해결책 제시",
                        icon: "compass",
                        theory: "중간관여 문제해결형 고객에게는 명확한 해결책 제시가 관여도 향상의 열쇠입니다.",
                        direction: "• 상황별 추천 메뉴 명시\n• 가격대별 옵션 다양화\n• 빠른 상담 서비스 제공\n• 만족 보장 정책 운영"
                    },
                    {
                        title: "점진적 관계 형성",
                        subtitle: "신뢰 구축 프로세스",
                        icon: "layers",
                        theory: "중간관여 고객과의 관계를 단계적으로 발전시켜 높은 관여도로 이끌어야 합니다.",
                        direction: "• 방문 횟수별 혜택 시스템\n• 개인 취향 학습 서비스\n• 점진적 관계 심화 전략\n• 재방문 유도 팔로우업"
                    }
                ]
            },
            'recommendation_based': {
                summary: "중간 관여도로 입소문을 중시하는 고객입니다. 좋은 경험 제공을 통해 적극적인 홍보자로 전환할 수 있습니다.",
                channels: [
                    {
                        title: "경험 품질 향상",
                        subtitle: "공유할 만한 가치 창출",
                        icon: "star",
                        theory: "중간관여 추천형 고객이 적극적 추천자가 되려면 예상을 뛰어넘는 경험이 필요합니다.",
                        direction: "• 예상 초과 서비스 제공\n• 특별한 순간 연출\n• 기억에 남는 디테일 강화\n• 감동 포인트 체계화"
                    },
                    {
                        title: "자연스러운 공유 유도",
                        subtitle: "부담 없는 추천 환경",
                        icon: "message-square",
                        theory: "강요가 아닌 자연스러운 공유 동기를 부여하여 진정성 있는 추천을 이끌어냅니다.",
                        direction: "• 공유하고 싶은 순간 연출\n• 간단한 공유 도구 제공\n• 추천 시 상호 혜택 구조\n• 자연스러운 입소문 환경 조성"
                    }
                ]
            },
            'loyal_customer': {
                summary: "중간 관여도를 가진 브랜드 애호가입니다. 관여도를 높여 진정한 충성고객으로 발전시킬 수 있는 중요한 그룹입니다.",
                channels: [
                    {
                        title: "관여도 상승 전략",
                        subtitle: "깊은 관계로 발전",
                        icon: "arrow-up",
                        theory: "중간관여 충성고객을 고관여로 이끌기 위해서는 브랜드와의 접점을 늘려야 합니다.",
                        direction: "• 브랜드 스토리 적극 공유\n• 고객 참여형 이벤트 기획\n• 개인화 서비스 단계적 확대\n• 브랜드 커뮤니티 참여 유도"
                    },
                    {
                        title: "지속적 관계 유지",
                        subtitle: "꾸준한 소통과 관리",
                        icon: "repeat",
                        theory: "충성도는 있지만 관여도가 중간인 고객과의 지속적 소통으로 관계를 심화시켜야 합니다.",
                        direction: "• 정기적 소통 채널 운영\n• 계절별 맞춤 제안\n• 생일 등 특별일 관리\n• 장기 고객 혜택 프로그램"
                    }
                ]
            }
        },
        '저관여': {
            'light_visitor': {
                summary: "낮은 관여도로 우연히 방문하는 고객입니다. 기본적인 만족도 제공을 통해 재방문을 유도하고 점차 관여도를 높여야 합니다.",
                channels: [
                    {
                        title: "기본기 완성",
                        subtitle: "확실한 기본 만족도",
                        icon: "check-circle",
                        theory: "저관여 고객에게는 복잡한 전략보다 기본적인 만족도 확보가 우선입니다.",
                        direction: "• 음식 맛과 품질의 일관성 확보\n• 친절하고 빠른 기본 서비스\n• 깔끔하고 편안한 매장 환경\n• 합리적 가격 정책"
                    },
                    {
                        title: "관심 유발 포인트",
                        subtitle: "주목받을 수 있는 요소",
                        icon: "lightbulb",
                        theory: "저관여 고객의 관심을 끌 수 있는 명확하고 간단한 차별화 포인트가 필요합니다.",
                        direction: "• 시그니처 메뉴 개발 및 강조\n• 특별한 하나의 강점 집중\n• 간단명료한 브랜드 메시지\n• 눈에 띄는 비주얼 요소"
                    }
                ]
            },
            'problem_solver': {
                summary: "낮은 관여도로 특정 니즈를 가진 고객입니다. 문제 해결에 집중하여 만족도를 높이고 관여도 상승을 도모해야 합니다.",
                channels: [
                    {
                        title: "간단한 해결책 제시",
                        subtitle: "복잡하지 않은 솔루션",
                        icon: "tool",
                        theory: "저관여 문제해결형 고객에게는 간단하고 명확한 해결책이 효과적입니다.",
                        direction: "• 메뉴 선택의 단순화\n• 빠른 주문 및 결제 시스템\n• 명확한 추천 시스템\n• 간편한 정보 제공"
                    },
                    {
                        title: "점진적 신뢰 구축",
                        subtitle: "작은 성공의 누적",
                        icon: "building-2",
                        theory: "저관여 고객과는 작은 성공 경험을 쌓아 점진적으로 신뢰를 구축해야 합니다.",
                        direction: "• 첫 방문 만족도 집중 관리\n• 작은 약속 지키기\n• 단계별 서비스 향상\n• 신뢰할 수 있는 일관성"
                    }
                ]
            },
            'recommendation_based': {
                summary: "낮은 관여도이지만 입소문을 중시하는 고객입니다. 기본 만족도 확보 후 자연스러운 추천을 유도해야 합니다.",
                channels: [
                    {
                        title: "기대치 관리",
                        subtitle: "적절한 기대 설정",
                        icon: "target",
                        theory: "저관여 고객에게는 과도한 기대보다 적절한 기대 설정 후 그것을 확실히 충족하는 것이 중요합니다.",
                        direction: "• 현실적 서비스 수준 약속\n• 확실한 기본 만족도 제공\n• 예상 범위 내 긍정적 경험\n• 신뢰할 수 있는 일관성"
                    },
                    {
                        title: "간접 추천 유도",
                        subtitle: "부담 없는 공유 환경",
                        icon: "share",
                        theory: "저관여 고객에게는 직접적 추천 요청보다 자연스러운 공유 환경 조성이 효과적입니다.",
                        direction: "• SNS 공유하기 쉬운 환경\n• 간단한 추천 도구 제공\n• 부담 없는 혜택 구조\n• 자연스러운 입소문 유도"
                    }
                ]
            },
            'loyal_customer': {
                summary: "낮은 관여도이지만 브랜드에 애착을 가진 고객입니다. 관여도를 점진적으로 높여 진정한 충성고객으로 육성해야 합니다.",
                channels: [
                    {
                        title: "관계 기반 구축",
                        subtitle: "개인적 유대감 형성",
                        icon: "heart",
                        theory: "저관여 충성고객과는 브랜드보다는 개인적 관계를 먼저 구축하는 것이 효과적입니다.",
                        direction: "• 직원과의 개인적 친밀감 조성\n• 단골 인정 및 특별 대우\n• 개인 취향 기억 및 적용\n• 인간적 소통 강화"
                    },
                    {
                        title: "서서히 관여도 상승",
                        subtitle: "부담 없는 점진적 발전",
                        icon: "trending-up",
                        theory: "저관여 충성고객의 관여도 상승은 급하지 않게 자연스럽게 이끌어야 합니다.",
                        direction: "• 부담 없는 브랜드 스토리 공유\n• 선택적 참여 기회 제공\n• 강요하지 않는 관계 발전\n• 자연스러운 관심 증대"
                    }
                ]
            }
        }
    },
    'cafe': {
        '고관여': {
            'light_visitor': {
                summary: "높은 관여도와 즉흥적 방문 성향을 가진 고객층입니다. 카페 문화에 대한 이해도가 높아 분위기와 퀄리티를 중시합니다.",
                channels: [
                    {
                        title: "분위기 마케팅",
                        subtitle: "감성적 공간 연출",
                        icon: "image",
                        theory: "고관여 즉흥 방문객은 카페의 분위기와 감성적 가치를 중요하게 생각합니다.",
                        direction: "• 인스타그램 스토리로 실시간 분위기 전달\n• 시간대별 다른 무드 연출\n• 계절감 있는 인테리어 변화\n• 감성적 조명과 음악 큐레이션"
                    },
                    {
                        title: "즉석 만족 시스템",
                        subtitle: "즉시 경험 최적화",
                        icon: "coffee",
                        theory: "즉흥적 방문에도 높은 만족도를 제공할 수 있는 체계적 서비스가 필요합니다.",
                        direction: "• 대기시간 최소화 시스템\n• 다양한 원두 옵션 즉석 제공\n• 빠른 커스터마이징 서비스\n• 테이크아웃 전용 간편 메뉴"
                    }
                ]
            },
            'problem_solver': {
                summary: "높은 관여도로 명확한 목적을 가진 고객층입니다. 작업, 모임, 휴식 등 특정 니즈를 충족시키는 공간과 서비스를 원합니다.",
                channels: [
                    {
                        title: "목적별 공간 제공",
                        subtitle: "니즈 맞춤 환경",
                        icon: "layout",
                        theory: "문제 해결형 고객은 방문 목적에 맞는 최적화된 공간과 서비스를 필요로 합니다.",
                        direction: "• 작업 전용 조용한 구역 운영\n• 모임용 그룹 테이블 제공\n• 개인 공간 보장 좌석 배치\n• 목적별 시간 제한 정책"
                    },
                    {
                        title: "전문성 강화",
                        subtitle: "커피 전문가로서의 차별화",
                        icon: "award",
                        theory: "높은 관여도 고객은 커피의 전문성과 품질에 대한 기대가 높습니다.",
                        direction: "• 바리스타의 전문성 어필\n• 원두별 상세 정보 제공\n• 개인 취향 맞춤 추천\n• 커피 관련 교육 서비스"
                    }
                ]
            },
            'recommendation_based': {
                summary: "높은 관여도와 입소문 중시 성향을 가진 고객층입니다. 카페 경험을 SNS에 적극 공유하며 강력한 홍보 효과를 만들 수 있습니다.",
                channels: [
                    {
                        title: "SNS 최적화",
                        subtitle: "인스타그래머블 경험",
                        icon: "camera",
                        theory: "추천 기반 고객은 공유 가치가 높은 시각적, 경험적 콘텐츠를 선호합니다.",
                        direction: "• 포토존과 인테리어 특화\n• 플레이팅과 비주얼 강화\n• 해시태그 전략적 활용\n• 인플루언서와의 협업"
                    },
                    {
                        title: "커뮤니티 허브",
                        subtitle: "소통과 네트워킹 공간",
                        icon: "users",
                        theory: "입소문을 중시하는 고객들을 위한 커뮤니티 공간이 브랜드 충성도를 높입니다.",
                        direction: "• 정기 모임 및 이벤트 개최\n• 고객 간 소통 촉진\n• 브랜드 앰버서더 프로그램\n• 리뷰어 특별 혜택"
                    }
                ]
            },
            'loyal_customer': {
                summary: "높은 관여도와 브랜드 애착을 가진 최고의 고객층입니다. 카페의 가치와 철학에 깊이 공감하며 장기적 관계를 유지합니다.",
                channels: [
                    {
                        title: "개인 맞춤 서비스",
                        subtitle: "VIP 고객 관리",
                        icon: "user-check",
                        theory: "충성 고객은 개인화된 서비스를 통해 더욱 강한 유대감을 형성합니다.",
                        direction: "• 개인 취향 데이터베이스 관리\n• 맞춤형 음료 제조\n• VIP 전용 혜택 및 이벤트\n• 특별한 날 개인 서비스"
                    },
                    {
                        title: "브랜드 동반자",
                        subtitle: "함께 성장하는 관계",
                        icon: "handshake",
                        theory: "충성 고객을 브랜드 발전의 파트너로 만들어 상호 성장하는 관계를 구축합니다.",
                        direction: "• 신메뉴 테스터 역할 부여\n• 브랜드 발전 과정 공유\n• 피드백 적극 수렴 및 반영\n• 브랜드 성과 혜택 공유"
                    }
                ]
            }
        },
        '중간관여': {
            'light_visitor': {
                summary: "중간 수준의 관여도를 가진 즉흥적 방문 고객입니다. 카페에 대한 관심을 높여 관여도 상승을 도모할 수 있습니다.",
                channels: [
                    {
                        title: "접근성 강화",
                        subtitle: "방문 편의성 개선",
                        icon: "map-pin",
                        theory: "중간관여 즉흥 방문객에게는 접근의 편의성과 즉시성이 중요합니다.",
                        direction: "• 위치 기반 모바일 광고\n• 외관과 간판 개선\n• 테라스나 입구 활용\n• 주변 상권과의 시너지"
                    },
                    {
                        title: "관심 유발 요소",
                        subtitle: "호기심 자극하기",
                        icon: "eye",
                        theory: "중간관여 고객의 관심을 끌어 카페에 대한 호기심과 관여도를 높여야 합니다.",
                        direction: "• 시그니처 음료 강조\n• 특별한 디저트나 푸드\n• 독특한 인테리어 포인트\n• 계절별 한정 메뉴"
                    }
                ]
            },
            'problem_solver': {
                summary: "중간 수준의 관여도로 특정 목적을 가진 고객입니다. 목적 달성도에 따라 관여도 상승 가능성이 높습니다.",
                channels: [
                    {
                        title: "명확한 서비스 정의",
                        subtitle: "목적별 솔루션 제시",
                        icon: "clipboard",
                        theory: "중간관여 문제해결형 고객에게는 명확한 서비스 범위와 혜택 제시가 필요합니다.",
                        direction: "• 용도별 좌석 가이드 제공\n• 시간대별 서비스 차별화\n• 목적별 패키지 상품\n• 명확한 정책 안내"
                    },
                    {
                        title: "점진적 관계 발전",
                        subtitle: "신뢰 기반 구축",
                        icon: "trending-up",
                        theory: "중간관여 고객과의 관계를 단계적으로 발전시켜 높은 관여도로 이끌어야 합니다.",
                        direction: "• 방문 패턴 학습 서비스\n• 단계별 혜택 시스템\n• 개인 선호도 파악\n• 맞춤 서비스 점진 확대"
                    }
                ]
            },
            'recommendation_based': {
                summary: "중간 관여도로 입소문을 중시하는 고객입니다. 좋은 경험을 통해 적극적인 추천자로 전환 가능합니다.",
                channels: [
                    {
                        title: "공유 포인트 창출",
                        subtitle: "특별한 경험 연출",
                        icon: "star",
                        theory: "중간관여 추천형 고객이 적극적 추천자가 되려면 예상을 뛰어넘는 특별함이 필요합니다.",
                        direction: "• 놀라움을 주는 서비스\n• 기억에 남는 비주얼\n• 특별한 순간 연출\n• 감동적인 디테일"
                    },
                    {
                        title: "공유 유도 시스템",
                        subtitle: "자연스러운 추천 환경",
                        icon: "share-2",
                        theory: "강요하지 않으면서도 자연스럽게 공유하고 싶게 만드는 환경과 동기 부여가 필요합니다.",
                        direction: "• 공유 인센티브 프로그램\n• 리뷰 작성 혜택\n• 친구 추천 시 할인\n• SNS 이벤트 진행"
                    }
                ]
            },
            'loyal_customer': {
                summary: "중간 관여도를 가진 브랜드 애호가입니다. 관여도를 높여 진정한 충성고객으로 발전시킬 중요한 그룹입니다.",
                channels: [
                    {
                        title: "관여도 증진 전략",
                        subtitle: "브랜드와의 접점 확대",
                        icon: "arrow-up",
                        theory: "중간관여 충성고객을 고관여로 이끌기 위해서는 브랜드와의 다양한 접점을 만들어야 합니다.",
                        direction: "• 브랜드 스토리 적극 공유\n• 원두나 재료 스토리텔링\n• 바리스타와의 소통 기회\n• 카페 운영 비하인드 공개"
                    },
                    {
                        title: "지속적 관계 관리",
                        subtitle: "꾸준한 소통과 케어",
                        icon: "repeat",
                        theory: "충성도는 있지만 관여도가 중간인 고객과의 지속적이고 개인적인 관계 관리가 필요합니다.",
                        direction: "• 정기적 소통 채널\n• 개인 기념일 관리\n• 계절별 맞춤 추천\n• 장기 고객 우대 정책"
                    }
                ]
            }
        },
        '저관여': {
            'light_visitor': {
                summary: "낮은 관여도로 우연히 방문하는 고객입니다. 기본적인 만족도를 통해 재방문을 유도하고 점차 관여도를 높여야 합니다.",
                channels: [
                    {
                        title: "기본 품질 확보",
                        subtitle: "확실한 기본기",
                        icon: "check-circle",
                        theory: "저관여 고객에게는 복잡한 전략보다 기본적인 품질과 서비스의 일관성이 우선입니다.",
                        direction: "• 커피 맛의 일관성 유지\n• 깔끔하고 편안한 환경\n• 친절한 기본 서비스\n• 합리적 가격 정책"
                    },
                    {
                        title: "간단한 차별화",
                        subtitle: "기억에 남는 한 가지",
                        icon: "zap",
                        theory: "저관여 고객의 관심을 끌 수 있는 명확하고 간단한 하나의 특징이 필요합니다.",
                        direction: "• 시그니처 음료 개발\n• 특별한 디저트 하나\n• 독특한 인테리어 포인트\n• 기억하기 쉬운 서비스"
                    }
                ]
            },
            'problem_solver': {
                summary: "낮은 관여도로 특정 니즈를 가진 고객입니다. 간단한 문제 해결에 집중하여 만족도를 높여야 합니다.",
                channels: [
                    {
                        title: "단순한 솔루션",
                        subtitle: "복잡하지 않은 해결책",
                        icon: "tool",
                        theory: "저관여 문제해결형 고객에게는 복잡하지 않고 즉시 이해할 수 있는 솔루션이 효과적입니다.",
                        direction: "• 메뉴 구성의 단순화\n• 빠른 주문 시스템\n• 명확한 좌석 안내\n• 간편한 결제 방식"
                    },
                    {
                        title: "신뢰성 구축",
                        subtitle: "일관된 서비스 제공",
                        icon: "shield",
                        theory: "저관여 고객과는 작은 약속을 지키는 일관성으로 점진적 신뢰를 구축해야 합니다.",
                        direction: "• 예고된 시간 준수\n• 일정한 품질 유지\n• 약속한 서비스 이행\n• 안정적 운영 시간"
                    }
                ]
            },
            'recommendation_based': {
                summary: "낮은 관여도이지만 입소문을 중시하는 고객입니다. 기본 만족도 확보 후 자연스러운 추천을 유도해야 합니다.",
                channels: [
                    {
                        title: "적절한 기대 관리",
                        subtitle: "현실적 약속과 이행",
                        icon: "target",
                        theory: "저관여 고객에게는 과도한 기대를 주지 않으면서도 확실한 만족을 제공하는 것이 중요합니다.",
                        direction: "• 현실적 서비스 수준 제시\n• 확실한 기본 만족도\n• 예상 범위 내 긍정 경험\n• 신뢰할 수 있는 일관성"
                    },
                    {
                        title: "부담 없는 공유",
                        subtitle: "자연스러운 추천 환경",
                        icon: "message-circle",
                        theory: "저관여 고객에게는 부담스럽지 않은 방식으로 자연스러운 공유를 유도해야 합니다.",
                        direction: "• 간단한 공유 도구\n• 부담 없는 혜택 구조\n• 선택적 참여 방식\n• 자연스러운 입소문 유도"
                    }
                ]
            },
            'loyal_customer': {
                summary: "낮은 관여도이지만 브랜드에 애착을 가진 고객입니다. 관여도를 점진적으로 높여 진정한 충성고객으로 육성해야 합니다.",
                channels: [
                    {
                        title: "개인적 관계 우선",
                        subtitle: "인간적 유대감 형성",
                        icon: "heart",
                        theory: "저관여 충성고객과는 브랜드보다는 개인적, 인간적 관계를 먼저 구축하는 것이 효과적입니다.",
                        direction: "• 직원과의 친밀감 조성\n• 개인 취향 기억\n• 단골 인정과 특별 대우\n• 따뜻한 인간적 소통"
                    },
                    {
                        title: "자연스러운 발전",
                        subtitle: "부담 없는 관계 심화",
                        icon: "sunrise",
                        theory: "저관여 충성고객의 관여도 상승은 급하지 않게 자연스럽게 이끌어야 합니다.",
                        direction: "• 부담 없는 브랜드 스토리\n• 선택적 참여 기회\n• 강요하지 않는 발전\n• 자연스러운 관심 증대"
                    }
                ]
            }
        }
    },
    'fitness': {
        '고관여': {
            'light_visitor': {
                summary: "높은 관여도와 즉흥적 방문 성향을 가진 고객층입니다. 피트니스에 대한 관심도가 높아 전문성과 효과를 중시합니다.",
                channels: [
                    {
                        title: "즉시 체험 시스템",
                        subtitle: "바로 경험할 수 있는 서비스",
                        icon: "zap",
                        theory: "고관여 즉흥 방문객은 즉시 운동 효과를 체감할 수 있는 시스템을 선호합니다.",
                        direction: "• 무료 체험 수업 상시 운영\n• 즉석 체성분 분석 서비스\n• 단기 집중 프로그램 제공\n• 실시간 운동 효과 측정"
                    },
                    {
                        title: "전문성 어필",
                        subtitle: "차별화된 전문 영역",
                        icon: "award",
                        theory: "높은 관여도 고객은 트레이너의 전문성과 센터의 차별화된 강점을 중요하게 생각합니다.",
                        direction: "• 트레이너 자격과 경력 강조\n• 전문 장비와 시설 어필\n• 성공 사례 스토리텔링\n• 과학적 운동 방법론 제시"
                    }
                ]
            },
            'problem_solver': {
                summary: "높은 관여도로 명확한 운동 목표를 가진 고객층입니다. 체계적인 목표 달성 프로그램과 전문적 관리를 원합니다.",
                channels: [
                    {
                        title: "목표별 맞춤 프로그램",
                        subtitle: "개인 목표 최적화",
                        icon: "target",
                        theory: "문제 해결형 고객은 자신의 구체적 목표에 맞는 체계적이고 과학적인 프로그램을 원합니다.",
                        direction: "• 목표별 맞춤 운동 계획\n• 정기적 진행도 측정\n• 개인별 식단 관리\n• 단계별 목표 설정 시스템"
                    },
                    {
                        title: "성과 관리 시스템",
                        subtitle: "체계적 결과 추적",
                        icon: "trending-up",
                        theory: "높은 관여도의 목표 지향적 고객은 명확한 성과 측정과 관리 시스템을 중요하게 생각합니다.",
                        direction: "• 정기적 체성분 분석\n• 운동 기록 및 진척도 관리\n• 목표 달성도 시각화\n• 개인별 성과 리포트"
                    }
                ]
            },
            'recommendation_based': {
                summary: "높은 관여도와 입소문 중시 성향을 가진 고객층입니다. 운동 성과를 SNS에 공유하며 강력한 홍보 효과를 만들 수 있습니다.",
                channels: [
                    {
                        title: "성과 공유 시스템",
                        subtitle: "변화 과정 스토리텔링",
                        icon: "camera",
                        theory: "추천 기반 고객은 자신의 운동 성과와 변화 과정을 공유할 가치가 있을 때 적극적 홍보자가 됩니다.",
                        direction: "• 변화 과정 포토 서비스\n• 성과 인증 콘텐츠 제작\n• SNS 공유 이벤트\n• 성공 스토리 협업 제작"
                    },
                    {
                        title: "커뮤니티 운영",
                        subtitle: "운동 동반자 네트워크",
                        icon: "users",
                        theory: "입소문을 중시하는 고객들을 위한 운동 커뮤니티가 지속적 동기 부여와 브랜드 충성도를 높입니다.",
                        direction: "• 운동 챌린지 그룹 운영\n• 회원 간 동기 부여 시스템\n• 성과 공유 모임 개최\n• 추천 리워드 프로그램"
                    }
                ]
            },
            'loyal_customer': {
                summary: "높은 관여도와 브랜드 애착을 가진 최고의 고객층입니다. 장기적 건강 관리 파트너로서 지속적 관계를 유지합니다.",
                channels: [
                    {
                        title: "평생 건강 파트너십",
                        subtitle: "장기적 건강 관리",
                        icon: "heart",
                        theory: "충성 고객과는 단순한 운동 서비스를 넘어 평생 건강 관리 파트너로서의 관계를 구축해야 합니다.",
                        direction: "• 장기 건강 계획 수립\n• 연령별 맞춤 프로그램\n• 건강 상태 지속 모니터링\n• 평생 회원 혜택 제공"
                    },
                    {
                        title: "VIP 맞춤 서비스",
                        subtitle: "개인 전담 관리",
                        icon: "user-check",
                        theory: "충성 고객에게는 개인 전담 관리 시스템을 통해 최고 수준의 맞춤 서비스를 제공합니다.",
                        direction: "• 전담 트레이너 배정\n• VIP 전용 시설 이용\n• 개인별 건강 데이터 관리\n• 우선 예약 및 특별 혜택"
                    }
                ]
            }
        },
        '중간관여': {
            'light_visitor': {
                summary: "중간 수준의 관여도를 가진 즉흥적 방문 고객입니다. 운동에 대한 관심을 높여 관여도 상승을 도모할 수 있습니다.",
                channels: [
                    {
                        title: "접근 장벽 제거",
                        subtitle: "부담 없는 시작",
                        icon: "door-open",
                        theory: "중간관여 즉흥 방문객에게는 운동 시작에 대한 부담과 장벽을 최소화하는 것이 중요합니다.",
                        direction: "• 부담 없는 체험 프로그램\n• 초보자 친화적 환경\n• 간단한 등록 절차\n• 운동복 대여 서비스"
                    },
                    {
                        title: "즉시 만족감 제공",
                        subtitle: "빠른 성취감 경험",
                        icon: "smile",
                        theory: "중간관여 고객의 지속적 참여를 위해서는 초기 운동에서 즉시 만족감을 느낄 수 있어야 합니다.",
                        direction: "• 쉽고 재미있는 운동부터 시작\n• 즉시 느낄 수 있는 효과\n• 성취감을 주는 단계별 목표\n• 긍정적 피드백 시스템"
                    }
                ]
            },
            'problem_solver': {
                summary: "중간 수준의 관여도로 특정 운동 목표를 가진 고객입니다. 목표 달성도에 따라 관여도 상승 가능성이 높습니다.",
                channels: [
                    {
                        title: "명확한 솔루션 제시",
                        subtitle: "구체적 해결책 제공",
                        icon: "clipboard",
                        theory: "중간관여 문제해결형 고객에게는 명확하고 달성 가능한 운동 솔루션 제시가 필요합니다.",
                        direction: "• 목표별 운동 가이드 제공\n• 현실적 기간 설정\n• 단계별 성과 측정\n• 명확한 운동 방법 교육"
                    },
                    {
                        title: "점진적 관계 구축",
                        subtitle: "신뢰 기반 서비스",
                        icon: "building-2",
                        theory: "중간관여 고객과의 관계를 단계적으로 발전시켜 운동에 대한 관여도를 높여야 합니다.",
                        direction: "• 개인 진도에 맞춘 관리\n• 정기적 상담 서비스\n• 단계별 목표 재설정\n• 지속적 동기 부여 시스템"
                    }
                ]
            },
            'recommendation_based': {
                summary: "중간 관여도로 입소문을 중시하는 고객입니다. 좋은 운동 경험을 통해 적극적인 추천자로 전환 가능합니다.",
                channels: [
                    {
                        title: "공유할 가치 창출",
                        subtitle: "특별한 운동 경험",
                        icon: "star",
                        theory: "중간관여 추천형 고객이 적극적 추천자가 되려면 남들과 공유하고 싶은 특별한 경험이 필요합니다.",
                        direction: "• 독특하고 재미있는 운동 프로그램\n• 눈에 띄는 변화 연출\n• 특별한 운동 공간과 장비\n• 기억에 남는 서비스"
                    },
                    {
                        title: "자연스러운 추천 유도",
                        subtitle: "공유 동기 부여",
                        icon: "share-2",
                        theory: "강요하지 않으면서도 자연스럽게 주변에 추천하고 싶게 만드는 동기와 환경이 필요합니다.",
                        direction: "• 친구 추천 혜택 프로그램\n• 그룹 운동 할인 혜택\n• 성과 공유 이벤트\n• 추천자 리워드 시스템"
                    }
                ]
            },
            'loyal_customer': {
                summary: "중간 관여도를 가진 브랜드 애호가입니다. 운동에 대한 관여도를 높여 진정한 충성고객으로 발전시킬 중요한 그룹입니다.",
                channels: [
                    {
                        title: "관여도 증진 전략",
                        subtitle: "운동 동기 강화",
                        icon: "arrow-up",
                        theory: "중간관여 충성고객을 고관여로 이끌기 위해서는 운동에 대한 흥미와 동기를 지속적으로 강화해야 합니다.",
                        direction: "• 다양한 운동 프로그램 체험\n• 개인 성과 기록 관리\n• 새로운 운동 도전 기회\n• 운동 지식 교육 제공"
                    },
                    {
                        title: "지속적 관계 관리",
                        subtitle: "꾸준한 동반 관리",
                        icon: "repeat",
                        theory: "충성도는 있지만 관여도가 중간인 고객과의 지속적이고 개인적인 관계 관리가 필요합니다.",
                        direction: "• 정기적 운동 상담\n• 개인 일정 맞춤 관리\n• 건강 상태 지속 체크\n• 장기 회원 우대 혜택"
                    }
                ]
            }
        },
        '저관여': {
            'light_visitor': {
                summary: "낮은 관여도로 우연히 방문하는 고객입니다. 운동에 대한 부담을 줄이고 재미있는 경험을 통해 관심을 유발해야 합니다.",
                channels: [
                    {
                        title: "부담 제거",
                        subtitle: "운동에 대한 장벽 낮추기",
                        icon: "smile",
                        theory: "저관여 고객에게는 운동에 대한 부담감과 부정적 인식을 제거하는 것이 우선입니다.",
                        direction: "• 쉽고 재미있는 운동부터 시작\n• 부담 없는 체험 프로그램\n• 친근하고 편안한 분위기\n• 초보자 맞춤 환경"
                    },
                    {
                        title: "즉시 효과 체험",
                        subtitle: "바로 느낄 수 있는 변화",
                        icon: "zap",
                        theory: "저관여 고객의 운동 관심을 유발하기 위해서는 즉시 체감할 수 있는 효과가 필요합니다.",
                        direction: "• 스트레칭으로 즉시 시원함\n• 간단한 운동으로 성취감\n• 체성분 변화 즉시 확인\n• 기분 좋아지는 운동 체험"
                    }
                ]
            },
            'problem_solver': {
                summary: "낮은 관여도로 특정 운동 목적을 가진 고객입니다. 간단한 목표 달성에 집중하여 운동에 대한 관심을 높여야 합니다.",
                channels: [
                    {
                        title: "간단한 목표 설정",
                        subtitle: "달성 가능한 작은 목표",
                        icon: "check",
                        theory: "저관여 문제해결형 고객에게는 복잡하지 않고 쉽게 달성할 수 있는 목표 설정이 중요합니다.",
                        direction: "• 작고 명확한 목표 설정\n• 단기간 달성 가능한 계획\n• 간단한 운동 방법 교육\n• 즉시 확인할 수 있는 성과"
                    },
                    {
                        title: "신뢰 관계 구축",
                        subtitle: "작은 약속부터 지키기",
                        icon: "handshake",
                        theory: "저관여 고객과는 작은 약속을 지키는 일관성으로 점진적 신뢰를 구축해야 합니다.",
                        direction: "• 약속한 운동 효과 확실히 제공\n• 정해진 시간 정확히 준수\n• 단순하고 명확한 소통\n• 일관된 서비스 품질"
                    }
                ]
            },
            'recommendation_based': {
                summary: "낮은 관여도이지만 입소문을 중시하는 고객입니다. 기본적인 만족 경험을 통해 자연스러운 추천을 유도해야 합니다.",
                channels: [
                    {
                        title: "기대치 관리",
                        subtitle: "현실적 목표와 성과",
                        icon: "target",
                        theory: "저관여 고객에게는 과도한 기대를 주지 않으면서도 확실한 만족을 제공하는 것이 중요합니다.",
                        direction: "• 현실적인 운동 효과 안내\n• 달성 가능한 목표 제시\n• 확실한 기본 서비스 제공\n• 예상 범위 내 긍정 경험"
                    },
                    {
                        title: "부담 없는 추천",
                        subtitle: "자연스러운 공유 환경",
                        icon: "message-circle",
                        theory: "저관여 고객에게는 부담스럽지 않은 방식으로 자연스러운 추천을 유도해야 합니다.",
                        direction: "• 간단한 추천 혜택\n• 부담 없는 친구 초대\n• 선택적 참여 방식\n• 자연스러운 입소문 유도"
                    }
                ]
            },
            'loyal_customer': {
                summary: "낮은 관여도이지만 브랜드에 애착을 가진 고객입니다. 운동에 대한 관심을 점진적으로 높여 진정한 충성고객으로 육성해야 합니다.",
                channels: [
                    {
                        title: "개인적 관계 우선",
                        subtitle: "사람 간의 유대감",
                        icon: "heart",
                        theory: "저관여 충성고객과는 운동보다는 개인적, 인간적 관계를 먼저 구축하는 것이 효과적입니다.",
                        direction: "• 트레이너와의 개인적 친밀감\n• 개인 상황 이해 및 배려\n• 따뜻한 관심과 격려\n• 운동 외적 소통"
                    },
                    {
                        title: "자연스러운 동기 부여",
                        subtitle: "부담 없는 운동 관심 증대",
                        icon: "sunrise",
                        theory: "저관여 충성고객의 운동 관여도 상승은 급하지 않게 자연스럽게 이끌어야 합니다.",
                        direction: "• 부담 없는 운동 정보 제공\n• 선택적 운동 참여 기회\n• 강요하지 않는 동기 부여\n• 자연스러운 관심 증대"
                    }
                ]
            }
        }
    }
};

// Results Generation
function generateResults() {
    const { score, level } = calculateScore(appState.responses, appState.industry);
    const strategy = STRATEGIES[appState.industry][level][appState.persona];
    
    const container = document.getElementById('resultsContainer');
    
    container.innerHTML = `
        <!-- Score Display -->
        <div class="result-card">
            <div class="score-display">
                <h1 class="score-number-large">${score}</h1>
                <span class="level-badge-large">${level}</span>
                <div class="mt-3">
                    <p class="mb-1"><strong>${INDUSTRY_NAMES[appState.industry]}</strong> × <strong>${PERSONA_NAMES[appState.persona]}</strong></p>
                    <small class="opacity-75">15문항 진단 결과</small>
                </div>
            </div>
        </div>

        <!-- Strategy Summary -->
        <div class="strategy-card">
            <div class="strategy-title">
                <i data-feather="lightbulb"></i>
                진단 요약
            </div>
            <p class="theory-text">${strategy.summary}</p>
        </div>

        <!-- Marketing Channels -->
        <div class="strategy-card">
            <div class="strategy-title">
                <i data-feather="trending-up"></i>
                맞춤 마케팅 전략
            </div>
            
            ${strategy.channels.map(channel => `
                <div class="channel-card">
                    <div class="channel-header">
                        <div class="d-flex align-items-center">
                            <div class="channel-icon">
                                <i data-feather="${channel.icon}"></i>
                            </div>
                            <div class="ms-3">
                                <h4 class="channel-title">${channel.title}</h4>
                                <p class="channel-subtitle">${channel.subtitle}</p>
                            </div>
                        </div>
                    </div>
                    <div class="channel-content">
                        <div class="subsection-title">이론적 배경</div>
                        <p class="theory-text">${channel.theory}</p>
                        
                        <div class="subsection-title">실행 방향</div>
                        <div class="direction-text">${channel.direction.split('\n').map(line => `<p class="mb-2">${line}</p>`).join('')}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    console.log('Results generated:', { score, level, industry: appState.industry, persona: appState.persona });
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    showStep('intro');
    feather.replace();
});

// Handle browser back/forward
window.addEventListener('popstate', function() {
    showStep('intro');
});