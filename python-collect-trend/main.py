import re
from typing import List
from trend.precleaning import tfidf_similarity_filter
from collections import OrderedDict
from trend.google import get_trends_with_related
from trend.search import crawl_contents

SIM_THRESHOLD = 0.18  # 0.15~0.22 사이에서 조정

def flatten_trend_terms(trend_items) -> List[str]:
    out: List[str] = []
    for it in trend_items:
        if it.get("keyword"):
            out.append(it["keyword"])
        if it.get("related"):
            out.extend(list(filter(None, it["related"])))
    return out

def unique_order(xs: List[str]) -> List[str]:
    # 순서 유지 중복 제거
    return list(OrderedDict((x, True) for x in xs).keys())

STOPWORDS = {"은", "는", "이", "가", "을", "를", "에", "의", "와", "과", "으로", "에서", "하다", "했다", "하기", "및", "또는", 
    "정말", "매우", "아주", "너무", "많이", "빠르게", "빨리", "쉽게", "쉽고", 
    "맛있게", "맛있는", "새콤달콤", "인기만점", "폭신", "쫀득쫀득", "가득",
    "그리고", "또한", "하지만", "그러나", "또"}

def tokenize_and_filter(sentence: str) -> List[str]:
    # 문장을 띄어쓰기 기준으로 분해한 뒤, 의미 없는 조사/어미/중복된 단어 제거
    # 특수문자 제거
    cleaned = re.sub(r"[^가-힣0-9a-zA-Z\s]", " ", sentence)
    tokens = cleaned.split()

    # stopwords 제거 + 한 글자짜리 제거
    words = [
        w for w in tokens
        if w not in STOPWORDS and len(w) > 1
    ]

    # 중복 제거 (순서 유지)
    return list(OrderedDict.fromkeys(words))

if __name__ == "__main__":
    crop = "딸기"
    # 구글 트렌드 + 연관
    trend_items = get_trends_with_related()
    trend_terms = flatten_trend_terms(trend_items)
    trend_terms = unique_order(trend_terms)
    trend_filtered = tfidf_similarity_filter(trend_terms, threshold=SIM_THRESHOLD, crops=[crop])

    # YouTube/네이버 블로그 타이틀
    contexts = ["레시피", "힙한", "체험", "축제","이색 체험"]
    items = crawl_contents(crop, contexts, per_context_max=5)

    titles = [it.title for it in items if it.title]
    titles = unique_order(titles)
    content_filtered = tfidf_similarity_filter(titles, threshold=SIM_THRESHOLD,crops=[crop], w_tfidf=0.55, w_crop=0.45)

    for i, (kw, s) in enumerate(content_filtered[:50], 1):
        print(f"{i:02d}. {kw} | sim={s:.3f}")

    # GPT에 넘길 최종 상위 n개 뽑기
    FINAL_TOP_N = 10
    final_terms = [kw for kw, _ in (trend_filtered[:FINAL_TOP_N] + content_filtered[:FINAL_TOP_N])]

    print("\n=== [C] GPT 프롬프트에 넣을 상위 키워드 ===")
    for i, kw in enumerate(unique_order(final_terms), 1):
        print(f"{i:02d}. {kw}")

    all_words = []
    print("\n=== [D] 띄어쓰기 기반 단어 추출 결과 ===")
    for i, (kw, sim) in enumerate(content_filtered[:10], 1):
        word_list = tokenize_and_filter(kw)
        all_words.extend(word_list)
    all_words = list(OrderedDict.fromkeys(all_words))
    print("\n=== [E] 최종 합쳐진 단어 리스트 ===")
    print(all_words)