import re
from typing import List

try:
    from kiwipiepy import Kiwi  # 있으면 사용
    _kiwi = Kiwi()
except Exception:
    _kiwi = None                # 없으면 폴백

STOP = {"영상","후기","shorts","추천","리뷰","맛집","여행","vlog","오늘","요즘"}

def tokenize_ko(text: str) -> List[str]:
    if not text:
        return []
    if _kiwi:
        toks = _kiwi.tokenize(text)
        # 핵심 품사만 추출: 일반/고유명사, 어근, 동사/형용사 표면형
        out = [t.form.lower() for t in toks if t.tag in ("NNG","NNP","XR","VV","VA")]
    else:
        s = re.sub(r"[^0-9a-zA-Z가-힣\s]", " ", text).lower()
        out = [w for w in s.split() if len(w) >= 2]
    return [w for w in out if w not in STOP]