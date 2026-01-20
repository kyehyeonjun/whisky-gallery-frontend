<template>
  <div class="container">
    <!-- 상단 헤더 -->
    <header class="header">
      <div class="logo">WHISKY GALLERY</div>
      <nav>
        <a href="#">위스키</a>
        <a href="#">커뮤니티</a>
      </nav>
    </header>

    <main class="main-content">
      <!-- 리뷰 섹션 -->
      <div class="reviews-section">
        <!-- 제품 헤더 (이름 및 평점) -->
        <div class="product-header">
          <input v-model="whiskyData.name" class="title-input" placeholder="위스키 이름" />
          <div class="rating-badge">
            <span class="score">{{ formattedScore }}</span>
            <span class="votes">{{ whiskyData.votes }} 투표</span>
          </div>
        </div>

        <!-- 제품 상세 정보 (이미지 + 테이블) -->
        <div class="product-details">
          <div class="image-section">
            <!-- 실제 이미지가 없으므로 placeholder 이미지 사용 -->
            <div class="bottle-placeholder">
              <img :src="whiskyData.image" alt="위스키 이미지" />
              <input type="file" accept="image/*" @change="handleImageUpload" class="image-upload-btn" />
            </div>
          </div>

          <div class="info-section">
            <!-- 로딩 오버레이 -->
            <div v-if="isLoading" class="loading-overlay">
              <div class="spinner"></div>
              <span>데이터를 불러오는 중입니다...</span>
            </div>
            <h2>위스키 상세 정보</h2>
            <table class="info-table">
              <tbody>
                <tr>
                  <th>WB 코드</th>
                  <td>
                    <div class="search-row">
                      <input v-model="whiskyData.wbCode" placeholder="코드 입력" />
                      <button @click="searchWhisky" class="search-btn">찾기</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>카테고리</th>
                  <td><input v-model="whiskyData.category" /></td>
                </tr>
                <tr>
                  <th>증류소</th>
                  <td><input v-model="whiskyData.distillery" /></td>
                </tr>
                <tr>
                  <th>병입자</th>
                  <td><input v-model="whiskyData.bottler" /></td>
                </tr>
                <tr>
                  <th>병입 시리즈</th>
                  <td><input v-model="whiskyData.series" /></td>
                </tr>
                <tr>
                  <th>숙성 연수</th>
                  <td><input v-model="whiskyData.age" /></td>
                </tr>
                <tr>
                  <th>캐스크 타입</th>
                  <td><input v-model="whiskyData.caskType" /></td>
                </tr>
                <tr>
                  <th>도수</th>
                  <td><input v-model="whiskyData.strength" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 리뷰 작성 폼 -->
        <div class="review-form">
          <h3>리뷰 작성</h3>
          <div class="final-rating-display">
            <h4>리뷰 총점</h4>
            <p>{{ formattedAverageRating }}</p>
          </div>
          <div class="form-group">
            <div class="rating-label-group">
              <label>향 (Aroma)</label>
              <span class="rating-display">{{ newReview.aromaScore }} / 100</span>
            </div>
            <input type="range" v-model.number="newReview.aromaScore" min="0" max="100" class="rating-slider" />
            <textarea v-model="newReview.aroma" rows="2" placeholder="어떤 향이 느껴지나요?"></textarea>
            <div class="flavor-selector">
              <!-- 카테고리 선택 -->
              <div v-if="!selectorState.aroma.selectedCategory" class="flavor-grid">
                <button v-for="(category, key) in flavorData" :key="key" @click="selectCategory('aroma', key)" class="flavor-btn category-btn">
                  {{ category.name }}
                </button>
              </div>
              <!-- 개별 플레이버 선택 -->
              <div v-else class="flavor-grid">
                <button @click="goBackToCategories('aroma')" class="flavor-btn item-btn">&lt;</button>
                <button 
                  v-for="item in flavorData[selectorState.aroma.selectedCategory!].items" 
                  :key="item" 
                  @click="selectFlavor('aroma', item)" 
                  class="flavor-btn item-btn">
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="rating-label-group">
              <label>맛 (Taste)</label>
              <span class="rating-display">{{ newReview.tasteScore }} / 100</span>
            </div>
            <input type="range" v-model.number="newReview.tasteScore" min="0" max="100" class="rating-slider" />
            <textarea v-model="newReview.taste" rows="2" placeholder="맛은 어떤가요?"></textarea>
            <div class="flavor-selector">
              <!-- 카테고리 선택 -->
              <div v-if="!selectorState.taste.selectedCategory" class="flavor-grid">
                <button v-for="(category, key) in flavorData" :key="key" @click="selectCategory('taste', key)" class="flavor-btn category-btn">
                  {{ category.name }}
                </button>
              </div>
              <!-- 개별 플레이버 선택 -->
              <div v-else class="flavor-grid">
                <button @click="goBackToCategories('taste')" class="flavor-btn item-btn">&lt;</button>
                <button 
                  v-for="item in flavorData[selectorState.taste.selectedCategory!].items" 
                  :key="item" 
                  @click="selectFlavor('taste', item)" 
                  class="flavor-btn item-btn">
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="rating-label-group">
              <label>여운 (Finish)</label>
              <span class="rating-display">{{ newReview.finishScore }} / 100</span>
            </div>
            <input type="range" v-model.number="newReview.finishScore" min="0" max="100" class="rating-slider" />
            <textarea v-model="newReview.finish" rows="2" placeholder="마시고 난 후의 여운은..."></textarea>
            <div class="flavor-selector">
              <!-- 카테고리 선택 -->
              <div v-if="!selectorState.finish.selectedCategory" class="flavor-grid">
                <button v-for="(category, key) in flavorData" :key="key" @click="selectCategory('finish', key)" class="flavor-btn category-btn">
                  {{ category.name }}
                </button>
              </div>
              <!-- 개별 플레이버 선택 -->
              <div v-else class="flavor-grid">
                <button @click="goBackToCategories('finish')" class="flavor-btn item-btn">&lt;</button>
                <button 
                  v-for="item in flavorData[selectorState.finish.selectedCategory!].items" 
                  :key="item" 
                  @click="selectFlavor('finish', item)" 
                  class="flavor-btn item-btn">
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>총평 (Comment)</label>
            <textarea v-model="newReview.comment" rows="3" placeholder="리뷰에 대한 총평을 남겨주세요."></textarea>
          </div>
          <div class="button-group">
            <button @click="addReview">리뷰 등록</button>
            <button @click="copyReview" class="copy-btn">리뷰 복사</button>
          </div>
        </div>

        <!-- 리뷰 목록 -->
        <div class="review-list">
          <div v-for="(review, index) in reviews" :key="index" class="review-card">
            <div class="review-header">
              <span class="user">{{ review.user }}</span>
              <span class="review-score">{{ review.rating.toFixed(2) }}</span>
            </div>
            <p class="review-date">{{ review.date }}</p>
            <div class="review-content">
              <p><strong>향:</strong> {{ review.aroma }}</p>
              <p><strong>맛:</strong> {{ review.taste }}</p>
              <p><strong>여운:</strong> {{ review.finish }}</p>
              <div class="review-comment-section">
                <p>{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

const isLoading = ref(false);

// 데이터 구조를 명확하게 정의하는 인터페이스
interface Whisky {
  wbCode: string;
  name: string;
  score: number | string; // API 응답이 숫자 또는 문자열일 수 있음
  votes: number;
  image: string;
  category: string;
  distillery: string;
  bottler: string;
  series: string;
  age: string; // 또는 number
  caskType: string;
  strength: string; // 또는 number
}

// 위스키 정보 데이터 (사용자 입력 가능)
const whiskyData = ref({
  wbCode: '',
  name: '',
  score: '',
  votes: 0,
  image: 'https://placehold.co/300x500?text=No+Image',
  category: '',
  distillery: '',
  bottler: '',
  series: '',
  age: '',
  caskType: '',
  strength: ''
});

// 평점을 소수점 둘째 자리로 포맷팅하기 위한 computed 속성
const formattedScore = computed(() => {
  const score = whiskyData.value.score;
  // 점수 값이 없거나 숫자가 아니면 '--'를 반환
  if (score === '' || score === null || isNaN(Number(score))) {
    return '--';
  }
  // 숫자일 경우 소수점 둘째 자리까지 반환
  return Number(score).toFixed(2);
});

// 위스키 검색 함수
const searchWhisky = async () => {
  if (!whiskyData.value.wbCode) {
    alert('WB 코드를 입력해주세요.');
    return;
  }

  isLoading.value = true;
  try {
    // 환경에 따라 API 기본 URL을 설정합니다.
    // 개발 중에는 vite.config.js의 프록시를 사용하기 위해 빈 문자열이 되고,
    // 프로덕션 빌드 시에는 .env.production 파일의 VITE_API_BASE_URL 값을 사용합니다.
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/whisky/${whiskyData.value.wbCode}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // API 응답 데이터로 기존 데이터를 안전하게 업데이트합니다.
    whiskyData.value = {
      ...whiskyData.value, // 기존 값 유지
      ...data,             // API에서 받은 값으로 덮어쓰기
      image: data.image || 'https://placehold.co/300x500?text=No+Image' // 이미지 기본값 처리
    };

  } catch (error) {
    console.error("위스키 정보 조회 중 오류 발생:", error);
    alert("위스키 정보를 불러오는 데 실패했습니다. WB 코드를 확인하거나 서버 상태를 점검해주세요.");
  } finally {
    isLoading.value = false;
  }
};

// 이미지 업로드 핸들러
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files) {
    const file = target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          whiskyData.value.image = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
};

// 리뷰 데이터 인터페이스
interface Review {
  user: string;
  rating: number;
  date: string;
  aroma: string;
  taste: string;
  finish: string;
  comment: string;
}

// 리뷰 데이터 (초기에는 비어 있음)
const reviews = ref<Review[]>([]);

// 플레이버 데이터
const flavorData = {
  fruity: { name: '과일', items: ['사과', '배', '복숭아', '살구', '체리', '딸기', '건포도', '파인애플', '망고', '블루베리', '라즈베리', '자두', '리치'] },
  citrus: { name: '시트러스', items: ['오렌지', '레몬', '라임', '자몽', '귤', '유자'] },
  sweet: { name: '달콤', items: ['꿀', '바닐라', '카라멜', '화이트초콜릿','다크초콜릿', '흑설탕', '메이플 시럽', '토피'] },
  spicy: { name: '스파이시', items: ['시나몬', '정향', '육두구', '후추', '생강', '아니스'] },
  nutty: { name: '견과류', items: ['아몬드', '호두', '헤이즐넛', '땅콩', '마카다미아'] },
  grainy: { name: '곡물', items: ['맥아', '보리', '오트밀', '옥수수', '빵', '비스킷'] },
  woody: { name: '나무', items: ['오크', '삼나무', '소나무', '샌달우드', '젖은 나무'] },
  smoky: { name: '스모키', items: ['피트', '장작불', '토스트', '타르', '성냥'] },
  floral: { name: '꽃', items: ['헤더', '장미', '라벤더', '제비꽃', '자스민'] },
  herbal: { name: '허브/풀', items: ['민트', '풀', '건초', '유칼립투스', '홍차', '녹차', '말차', '얼그레이', '로즈마리'] },
  salty: { name: '짠맛/해산물', items: ['소금', '바닷물', '요오드', '해초', '굴'] },
  dairy: { name: '유제품', items: ['버터', '크림', '치즈', '요거트', '우유'] }
};

// flavorData의 키 타입을 정의하여 TypeScript가 flavorData['someKey'] 접근을 이해할 수 있도록 합니다.
type FlavorCategoryKey = keyof typeof flavorData;

type FlavorArea = 'aroma' | 'taste' | 'finish';

const selectorState = ref({
  aroma: { selectedCategory: null as FlavorCategoryKey | null },
  taste: { selectedCategory: null as FlavorCategoryKey | null },
  finish: { selectedCategory: null as FlavorCategoryKey | null },
});

const selectCategory = (area: FlavorArea, key: FlavorCategoryKey) => {
  selectorState.value[area].selectedCategory = key;
};

const goBackToCategories = (area: FlavorArea) => {
  selectorState.value[area].selectedCategory = null;
};

const selectFlavor = (area: FlavorArea, flavor: string) => {
  const currentText = newReview.value[area];
  newReview.value[area] = currentText ? `${currentText}, ${flavor}` : flavor;
};

// 새 리뷰 데이터 인터페이스
interface NewReview {
  rating: number;
  aroma: string;
  aromaScore: number;
  taste: string;
  tasteScore: number;
  finish: string;
  finishScore: number;
  comment: string;
}

// 새 리뷰 입력 상태
const newReview = ref<NewReview>({
  rating: 88,
  aroma: '',
  aromaScore: 88,
  taste: '',
  tasteScore: 88,
  finish: '',
  finishScore: 88,
  comment: '',
});

// 개별 점수가 변경될 때마다 평균 점수를 다시 계산합니다.
watchEffect(() => {
  const { aromaScore, tasteScore, finishScore } = newReview.value;
  newReview.value.rating = (aromaScore + tasteScore + finishScore) / 3;
});

// 표시용 평균 점수 (소수점 둘째 자리)
const formattedAverageRating = computed(() => {
  return newReview.value.rating.toFixed(2);
});

// 리뷰 등록 함수
const addReview = () => {
  const { aroma, taste, finish, comment } = newReview.value;

  // 셋 중 하나라도 내용이 있으면 등록 가능하도록
  if (aroma.trim() === '' && taste.trim() === '' && finish.trim() === '') {
    alert('하나 이상의 테이스팅 노트를 작성해주세요.');
    return;
  }
  
  reviews.value.unshift({
    user: 'Guest User', // 로그인 기능이 없으므로 게스트로 고정
    rating: newReview.value.rating,
    date: new Date().toISOString().split('T')[0],
    aroma: aroma,
    taste: taste,
    finish: finish,
    comment: comment,
  });
  
  // 폼 초기화
  newReview.value.aroma = '';
  newReview.value.taste = '';
  newReview.value.finish = '';
  newReview.value.comment = '';
  newReview.value.aromaScore = 88;
  newReview.value.tasteScore = 88;
  newReview.value.finishScore = 88;
};

// 리뷰 복사 함수
const copyReview = async () => {
	const lines = [];
	const w = whiskyData.value;
	const r = newReview.value;

	lines.push('[위스키 정보]');
	if (w.name?.trim()) lines.push(`* ${w.name} *`);
	if (w.wbCode?.trim()) lines.push(`WB 코드: ${w.wbCode}`);
	if (w.category?.trim()) lines.push(`카테고리: ${w.category}`);
	if (w.distillery?.trim()) lines.push(`증류소: ${w.distillery}`);
	if (w.bottler?.trim()) lines.push(`병입자: ${w.bottler}`);
	if (w.series?.trim()) lines.push(`병입 시리즈: ${w.series}`);
	if (w.age?.trim()) lines.push(`숙성 연수: ${w.age}`);
	if (w.caskType?.trim()) lines.push(`캐스크 타입: ${w.caskType}`);
	if (w.strength?.trim()) lines.push(`도수: ${w.strength}`);

	lines.push('\n[리뷰]');
	lines.push(`총점: ${formattedAverageRating.value}`);

	if (r.aroma?.trim()) {
		lines.push(`\n향: ${r.aromaScore} / 100`);
		lines.push(`- ${r.aroma}`);
	}
	if (r.taste?.trim()) {
		lines.push(`\n맛: ${r.tasteScore} / 100`);
		lines.push(`- ${r.taste}`);
	}
	if (r.finish?.trim()) {
		lines.push(`\n여운: ${r.finishScore} / 100`);
		lines.push(`- ${r.finish}`);
	}
	if (r.comment?.trim()) {
		lines.push('\n총평:');
		lines.push(`- ${r.comment}`);
	}

	const textToCopy = lines.join('\n');

	if (navigator.clipboard && window.isSecureContext) {
		try {
			await navigator.clipboard.writeText(textToCopy);
			alert('리뷰 내용이 클립보드에 복사되었습니다.');
		} catch (err) {
			console.error('클립보드 복사 실패:', err);
			alert('리뷰 복사에 실패했습니다.');
		}
	} else {
		const textArea = document.createElement("textarea");
		textArea.value = textToCopy;
		textArea.style.position = "absolute";
		textArea.style.left = "-9999px";
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand('copy');
			alert('리뷰 내용이 클립보드에 복사되었습니다.');
		} catch (err) {
			console.error('클립보드 복사 실패 (fallback):', err);
			alert('리뷰 복사에 실패했습니다.');
		} finally {
			document.body.removeChild(textArea);
		}
	}
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.header {
  background-color: #2c3e50;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo { font-weight: bold; font-size: 1.5rem; }
.header nav a { color: #fff; text-decoration: none; margin-left: 20px; font-size: 0.9rem; }

.main-content { padding: 2rem; }

.product-header {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem;
}

.title-input {
  font-size: 1.8rem; color: #2c3e50; font-weight: bold;
  border: 1px solid #ddd; padding: 5px; border-radius: 4px; width: 70%;
}

.rating-badge {
  text-align: center; background: #f9f9f9; padding: 10px 20px;
  border-radius: 8px; border: 1px solid #ddd;
}
.score { display: block; font-size: 2rem; font-weight: bold; color: #d35400; }
.votes { font-size: 0.8rem; color: #777; }

.product-details { display: flex; gap: 40px; margin-bottom: 3rem; }
.image-section { flex: 1; display: flex; justify-content: center; background: #fff; }
.bottle-placeholder { text-align: center; }
.bottle-placeholder img { max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
.image-upload-btn { margin-top: 10px; display: block; }

.info-section {
  flex: 2;
  position: relative;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
  color: #333;
  font-weight: bold;
}
.spinner {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #d35400; /* Orange from button */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}
.info-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
.info-table th, .info-table td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
.info-table th { width: 30%; color: #777; font-weight: normal; }
.info-table td { font-weight: bold; }
.info-table input {
  width: 100%; padding: 5px; font-size: 1rem; font-weight: bold;
  border: 1px solid #ddd; border-radius: 4px;
}

.search-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.search-row input {
  width: auto;
  flex: 1;
}
.search-btn {
  padding: 5px 15px;
  font-size: 0.9rem;
  white-space: nowrap;
}

.reviews-section { background: #f9f9f9; padding: 2rem; border-radius: 8px; }
.review-form { background: #fff; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #eee; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
.form-group input, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }

.rating-label-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Override default label margin inside this group */
.rating-label-group label {
  margin-bottom: 0;
}

.final-rating-display {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #fffaf5;
  border: 1px solid #ffe8d1;
  border-radius: 8px;
}
.final-rating-display h4 {
  margin: 0 0 0.5rem 0;
  color: #7c4d25;
  font-size: 1rem;
  font-weight: normal;
}
.final-rating-display p {
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
  color: #d35400;
}

.rating-display {
  font-size: 1.1rem;
  font-weight: bold;
  color: #d35400;
}

.rating-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 10px;
  background: #f1f1f1;
  border-radius: 5px;
  outline: none;
  margin-top: 0.5rem;
  padding: 0; /* Reset from .form-group input */
  border: none; /* Reset from .form-group input */
  margin-bottom: 0.5rem;
}

.rating-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  background: #d35400;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.rating-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  background: #d35400;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

button {
  background-color: #d35400; color: white; border: none; padding: 10px 20px;
  border-radius: 4px; cursor: pointer; font-size: 1rem;
}
button:hover { background-color: #e67e22; }

.copy-btn {
  background-color: #2980b9;
}
.copy-btn:hover {
  background-color: #3498db;
}

.review-card {
  background: #fff; padding: 1.5rem; margin-bottom: 1rem; border-radius: 8px;
  border-left: 5px solid #d35400; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.review-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.review-header .user { font-weight: bold; color: #2c3e50; }
.review-header .review-score { background: #2c3e50; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; }
.review-date { font-size: 0.85rem; color: #999; margin-bottom: 0.5rem; }
.review-content p {
  margin: 0.5rem 0 0 0;
  line-height: 1.6;
  color: #555;
}
.review-content p:first-child {
  margin-top: 0;
}
.review-content strong {
  color: #333;
  margin-right: 5px;
}

.flavor-selector {
  margin-top: 0.5rem;
}

.flavor-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.flavor-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  color: #333;
}
.flavor-btn:hover {
  background-color: #f0f0f0;
  border-color: #ccc;
}
.category-btn {
  background-color: #f8f9fa;
}

.review-comment-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #eee;
}

.review-comment-section p {
  font-style: italic;
  color: #333;
  line-height: 1.7;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 모바일 화면 최적화 */
@media (max-width: 768px) {
  .container {
    padding: 0;
    box-shadow: none;
  }

  .main-content, .reviews-section {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    padding: 1rem;
    gap: 10px;
  }

  .header nav a {
    margin: 0 10px;
  }

  .product-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .title-input {
    width: 100%;
    box-sizing: border-box;
    font-size: 1.5rem;
  }

  .product-details {
    flex-direction: column;
    gap: 20px;
  }

  .info-table th, .info-table td {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    border: none;
    text-align: left;
  }

  .info-table tr {
    display: block;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .info-table tr:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .final-rating-display p {
    font-size: 2rem;
  }
}
</style>
