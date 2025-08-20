# service.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from collections import OrderedDict
import re

from trend.precleaning import tfidf_similarity_filter
from trend.google import get_trends_with_related
from trend.search import crawl_contents

app = FastAPI()

SIM_THRESHOLD = 0.18

STOPWORDS = {
    "은","는","이","가","을","를","에","의","와","과","으로","에서","하다","했다","하기","및","또는",
    "정말","매우","아주","너무","많이","빠르게","빨리","쉽게","쉽고",
    "맛있게","맛있는","새콤달콤","인기만점","폭신","쫀득쫀득","가득",
    "그리고","또한","하지만","그러나","또"
}
# 중복 제거
def unique_order(xs: List[str]) -> List[str]:
    return list(OrderedDict((x, True) for x in xs).keys())

# 특수문자 제거 + stopwords 제거 + 한 글자짜리 제거
def tokenize_and_filter(sentence: str) -> List[str]:
    cleaned = re.sub(r"[^가-힣0-9a-zA-Z\s]", " ", sentence)
    tokens = cleaned.split()
    words = [w for w in tokens if w not in STOPWORDS and len(w) > 1]
    return list(OrderedDict.fromkeys(words))

def flatten_trend_terms(trend_items) -> List[str]:
    out = []
    for it in trend_items:
        if it.get("keyword"):
            out.append(it["keyword"])
        if it.get("related"):
            out.extend(list(filter(None, it["related"])))
    return out

def analyze_one_crop(crop: str) -> List[str]:
    crop = (crop or "").strip()
    if not crop:
        return []

    # 트렌드 + 연관어
    trend_items = get_trends_with_related()
    trend_terms = unique_order(flatten_trend_terms(trend_items))
    trend_filtered = tfidf_similarity_filter(
        trend_terms, threshold=SIM_THRESHOLD, crops=[crop]
    ) 

    # 유튜브, 네이버 크롤링
    contexts = ["레시피", "힙한", "체험", "축제", "이색 체험"]
    items = crawl_contents(crop, contexts, per_context_max=5)
    titles = unique_order([it.title for it in items if getattr(it, "title", None)])
    content_filtered = tfidf_similarity_filter(
        titles, threshold=SIM_THRESHOLD, crops=[crop], w_tfidf=0.55, w_crop=0.45
    ) 

    # 상위 키워드
    top_n = 10
    final_terms = [kw for kw, _ in (trend_filtered[:top_n] + content_filtered[:top_n])]
    final_terms = unique_order(final_terms)

    # 단어 토큰화 + 정제
    all_words: List[str] = []
    for kw, _ in content_filtered[:30]:
        all_words.extend(tokenize_and_filter(kw))
    all_words = unique_order(all_words)

    return unique_order(all_words + final_terms)

# 스키마
class CropsList(BaseModel):
    crops: List[str]

class CropsStr(BaseModel):
    crops: str  # "딸기, 감자" 같은 문자열

# 백엔드 통신
@app.post("/collect-data-list")
def collect_data_list(req: CropsList) -> List[str]:
    # 여러개의 작물(지금은 하나만)
    crops = [c for c in (req.crops or []) if c and c.strip()]
    if not crops:
        return []
    
    return analyze_one_crop(crops[0])

@app.post("/analyze-crops-str")
def analyze_crops_str(req: CropsStr) -> List[str]:
    # 문자열 입력 → 분리 규칙으로 리스트 변환
    # 쉼표, 파이프, 슬래시, 공백 여러 개 등 구분자 처리
    raw = (req.crops or "").strip()
    if not raw:
        return []
    parts = re.split(r"[,\|/]+|\s{2,}", raw)
    crops = [p.strip() for p in parts if p and p.strip()]
    if not crops:
        return []
    return analyze_one_crop(crops[0])
