import re
import math
from typing import List, Tuple, Optional
from rapidfuzz import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BAN = {
    "결혼","열애","이혼","입대","컴백","신곡","드라마","예능","아이돌","배우","가수",
    "하이라이트","풀영상","생중계","티저","예고편","월드컵","올림픽","kbo","k리그",
    "nba","mlb","대선","총선","정치","주가","주식","환율","비트코인","코인",
    "라이브","생방","리뷰","자막","직캠","캠","ost","가사","챌린지",
    "캔바","canva","미리캔버스","미리 캔버스","망고보드","mangoboard",
    "패들렛","padlet","ppt","파워포인트","gpt","chatgpt","챗지피티",
    "하이클래스","highclass","홍보문의","협찬","구독과","좋아요","풀버전","유출"
}
DATE_PAT = re.compile(r"\b\d{4}[.\-/]?\d{1,2}([.\-/]?\d{1,2})?\b", re.I)
SPORTS_PAT = re.compile(r"\b(ep\d+|vs|결승|준결승|예선)\b", re.I)

def normalize(t: str) -> str:
    t = t.strip().lower()
    t = re.sub(r"\(.*?\)|\[.*?\]|\<.*?\>", " ", t)
    t = re.sub(r"[^0-9a-z가-힣\s]", " ", t)
    t = re.sub(r"\s+", " ", t)
    return t

def hard_block(t: str) -> bool:
    toks = set(t.split())
    if toks & BAN: 
        return True
    if DATE_PAT.search(t) or SPORTS_PAT.search(t): 
        return True
    return False

def dedup_near(texts: List[str], threshold: int = 92) -> List[str]:
    kept: List[str] = []
    for x in texts:
        if all(fuzz.token_set_ratio(x, y) < threshold for y in kept):
            kept.append(x)
    return kept

# TF-IDF 벡터화 시드(유사도 검색)
DEFAULT_SEEDS = [
    "로컬푸드 요리 수업","이색","힙한","아이스크림","군것질","전","조림","튀김","회오리","빵","샐러드","밀키트","팝업스토어","간식"
    ,"과자","지역 축제 참여","농산물 가공", "가공","농촌 액티비티","팜투어","팩","뷰티","잼"
]

# 작물 유사도: 합성어 대응(감자빵), 부분문자열 + Fuzzy
def crop_similarity(text_norm: str, crops: Optional[List[str]]) -> float:
    if not crops:
        return 0.0
    text_nospace = text_norm.replace(" ", "")
    best = 0.0
    for c in crops:
        c_norm = normalize(c)
        if not c_norm:
            continue
        # 부분문자열(합성어 가점)
        substr = 1.0 if c_norm in text_nospace else 0.0
        # RapidFuzz 부분 일치(토큰 기반 유사도)
        pr = fuzz.partial_ratio(c_norm, text_norm) / 100.0
        # 보정: 부분문자열 가중 0.6, pr 가중 0.4
        score = 0.6*substr + 0.4*pr
        if score > best:
            best = score
    return best

# 메인: TF-IDF 필터 + 작물 가중합
def tfidf_similarity_filter(
    candidates: List[str],
    seeds: Optional[List[str]] = None,
    threshold: float = 0.14,      # TF-IDF 최소 임계
    max_len: int = 64,            # 제목 허용
    crops: Optional[List[str]] = None,
    w_tfidf: float = 0.6,
    w_crop: float = 0.4,
    final_threshold: float = 0.18 # 최종 점수 컷(가중합 기준)
) -> List[Tuple[str, float]]:

    if seeds is None:
        seeds = DEFAULT_SEEDS

    xs = [normalize(c) for c in candidates]
    xs = [c for c in xs if 2 <= len(c) <= max_len]
    xs = [c for c in xs if not hard_block(c)]
    xs = dedup_near(xs, threshold=92)

    if not xs:
        return []

    # TF-IDF 유사도(시드 대비 최대 코사인)
    docs = seeds + xs
    vec = TfidfVectorizer(ngram_range=(1,2), min_df=1)
    X = vec.fit_transform(docs)
    seed_mat = X[:len(seeds)]
    cand_mat = X[len(seeds):]
    tfidf_sims = cosine_similarity(cand_mat, seed_mat).max(axis=1)

    # 작물 유사도
    crop_sims = [crop_similarity(txt, crops) for txt in xs]

    # 가중합 + 컷
    out: List[Tuple[str, float]] = []
    tmp_all = []
    for kw, s_tfidf, s_crop in zip(xs, tfidf_sims, crop_sims):
        if s_tfidf < threshold and math.isclose(s_crop, 0.0, abs_tol=1e-9):
            # 완전 무관은 스킵(둘 다 낮음)
            continue
        final = w_tfidf*float(s_tfidf) + w_crop*float(s_crop)
        tmp_all.append((kw, float(s_tfidf), float(s_crop), float(final)))
        if final >= final_threshold:
            out.append((kw, float(final)))

    # 정렬
    out.sort(key=lambda x: x[1], reverse=True)

    return out
