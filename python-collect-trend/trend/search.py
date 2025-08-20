from dataclasses import dataclass
from typing import List, Dict, Set
from urllib.parse import quote_plus
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import requests
from bs4 import BeautifulSoup

# 공통
@dataclass
class SearchItem:
    title: str
    url: str
    source: str   # youtube, naverblog
    query: str

def build_queries(crop: str, contexts: List[str]) -> List[str]:
    # "감자 레시피", "감자 체험" 형태로 생성
    return [f"{crop} {ctx}".strip() for ctx in contexts if ctx.strip()]

def create_driver() -> webdriver.Chrome:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--window-size=1920x1080")
    # 봇 탐지 완화에 약간 도움
    options.add_argument("--disable-blink-features=AutomationControlled")
    driver = webdriver.Chrome(options=options)
    return driver

# YouTube
def search_youtube(query: str, max_results: int = 8, wait_sec: int = 7) -> List[SearchItem]:
    """
    유튜브 검색 결과 상위 n개(title, url) 추출
    """
    driver = create_driver()
    try:
        url = f"https://www.youtube.com/results?search_query={quote_plus(query)}"
        driver.get(url)

        # 결과 로딩 대기
        WebDriverWait(driver, wait_sec).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "ytd-video-renderer a#video-title"))
        )

        anchors = driver.find_elements(By.CSS_SELECTOR, "ytd-video-renderer a#video-title")
        items: List[SearchItem] = []
        for a in anchors[:max_results]:
            title = a.get_attribute("title") or a.text
            href = a.get_attribute("href")
            if title and href:
                items.append(SearchItem(title=title.strip(), url=href, source="youtube", query=query))
        return items
    finally:
        driver.quit()

# Naver Blog
def search_naver_blog(query: str, max_results: int = 8, timeout: int = 10) -> List[SearchItem]:
    """
    네이버 블로그 검색 결과(title, url) 추출
    - 검색 URL 예: https://search.naver.com/search.naver?where=post&query=감자 체험
    """
    base = "https://search.naver.com/search.naver?where=post&sm=tab_jum&query="
    url = base + quote_plus(query)

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/119.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "ko-KR,ko;q=0.9"
    }

    resp = requests.get(url, headers=headers, timeout=timeout)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "lxml")

    # 네이버 결과 DOM은 종종 바뀌므로, '블로그 카드의 링크+제목' 패턴을 광의로 탐색
    # 블로그 결과 묶음
    candidates = []

    # 블로그 카드 내 링크 (타이틀 포함)
    for a in soup.select("a.api_txt_lines.total_tit"):
        title = a.get_text(strip=True)
        href = a.get("href")
        if title and href:
            candidates.append((title, href))

    # 다른 텍스트 링크 형태
    if not candidates:
        for a in soup.select("a.sh_blog_title, a.title_link"):  # 구/신 규격 대비
            title = a.get_text(strip=True)
            href = a.get("href")
            if title and href:
                candidates.append((title, href))

    items: List[SearchItem] = []
    for title, href in candidates[:max_results]:
        items.append(SearchItem(title=title, url=href, source="naver_blog", query=query))
    return items

# 통합 실행
def crawl_contents(crop: str,contexts: List[str],per_context_max: int = 6,pause_sec: float = 0.8) -> List[SearchItem]:
    """
    crop + contexts 조합으로 유튜브/네이버 블로그를 모두 검색하여 통합 리스트 반환
    - 이후 점수화/필터링 로직은 별도 단계에서 적용
    """
    queries = build_queries(crop, contexts)

    results: List[SearchItem] = []
    seen_titles: Set[str] = set()

    for q in queries:
        # 유튜브
        try:
            yt = search_youtube(q, max_results=per_context_max)
            for it in yt:
                if it.title not in seen_titles:
                    seen_titles.add(it.title)
                    results.append(it)
        except Exception as e:
            print(f"[YouTube] {q} 실패: {e}")

        time.sleep(pause_sec)

        # 네이버 블로그
        try:
            nb = search_naver_blog(q, max_results=per_context_max)
            for it in nb:
                if it.title not in seen_titles:
                    seen_titles.add(it.title)
                    results.append(it)
        except Exception as e:
            print(f"[NaverBlog] {q} 실패: {e}")

        time.sleep(pause_sec)

    return results
