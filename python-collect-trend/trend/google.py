from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from pytrends.request import TrendReq
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

pytrends = TrendReq(hl='ko', tz=540)

def get_google_kr_trending():
    # Selenium으로 오늘의 구글 트렌드 인기 키워드 크롤링
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)
    driver.get("https://trends.google.co.kr/trending?geo=KR")
    try:
        # div.mZ3RIc 요소가 로딩될 때까지 대기
        WebDriverWait(driver, 7).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.mZ3RIc"))
        )
        elements = driver.find_elements(By.CSS_SELECTOR, "div.mZ3RIc")
        keywords = [el.text.strip() for el in elements if el.text.strip()]
    except Exception as e:
        print("크롤링 실패:", e)
        keywords = []
    finally:
        driver.quit()

    return keywords


def get_related_queries(keyword: str):
    # pytrends를 사용한 연관 검색어 추출
    try:
        pytrends.build_payload([keyword])
        related = pytrends.related_queries()
        result = related.get(keyword, {}).get('top')
        if result is not None:
            return result['query'].tolist()
    except Exception:
        pass
    return []


def get_trends_with_related():
    # 오늘의 트렌드 키워드와 각 키워드의 연관 검색어를 묶어서 반환
    base_keywords = get_google_kr_trending()
    final = []

    for keyword in base_keywords:
        related = get_related_queries(keyword)
        final.append({
            "keyword": keyword,
            "related": related
        })

    return final
