from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import random
import json
import time
import os
import sys
import re

driver_path = "/opt/homebrew/bin/chromedriver"

options = Options()
options.add_argument("--start-maximized")
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/114 Safari/537.36",
]
options.add_argument(f"user-agent={random.choice(user_agents)}")

service = Service(driver_path)
driver = webdriver.Chrome(service=service, options=options)
# print("[DEBUG] sys.argv =", sys.argv)
query = "춘천 카페"
# print("[DEBUG] 받은 query:", query)
driver.get("https://www.google.co.kr/maps")

try:
    search_box = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, "searchboxinput"))
    )
    search_box.clear()
    search_box.send_keys(query)
    search_box.send_keys(Keys.ENTER)
    print("[INFO] 검색어 입력 완료")
except Exception as e:
    print("[ERROR] 검색창 로드 또는 입력 실패:", e)
    driver.quit()
    exit(1)

#결과 카드(장소 목록)가 페이지에 표시될 때까지 대기
try:
    WebDriverWait(driver, 30).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.Nv2PK"))
    )
    print("[INFO] 검색 결과 로드 완료")
except Exception as e:
    print("[ERROR] 검색 결과 로드 실패:", e)
    driver.quit()
    exit(1)

results = []
try:
    places = driver.find_elements(By.CSS_SELECTOR, "div.Nv2PK")
    print(f"[INFO] 검색 결과에서 {len(places)}개 장소 발견")
    places = places[:9]  # 최대 8개로 제한

    for idx in range(len(places)):
        try:
            # 상세페이지 이동 후 DOM이 새로 그려지기에 다시 리스트로 돌아오면 기존 요소가 무효화되기 때문에 안정성을 위해 places 재조회
            places = driver.find_elements(By.CSS_SELECTOR, "div.Nv2PK")  # stale 방지 재조회
            place = places[idx]

            name_elem = place.find_element(By.CSS_SELECTOR, "a.hfpxzc")
            # 속성이 aria-label 값을 읽어오기 (만약 없다면 빈 문자열 반환)
            name = name_elem.get_attribute("aria-label") if name_elem else ""

            # 이미지
            img = '/path/to/my_dummy_image.png'
            try:
                image_elem = place.find_element(By.CSS_SELECTOR, "img")
                image = image_elem.get_attribute("src")
            except Exception:
                print(f"[WARN] 이미지가 없어 더미 이미지로 대체합니다.")
                image = img

            print(f"[INFO] [{idx+1}] {name} 상세 페이지 이동 중...")

            actions = ActionChains(driver)
            actions.move_to_element(name_elem).pause(random.uniform(0.5, 1.5)).click().perform()
            time.sleep(random.uniform(0.5, 1))  # 상세페이지 로딩 대기

            try:
                elems = WebDriverWait(driver, 15).until(
                    lambda d: d.find_elements(By.CSS_SELECTOR, "div.Io6YTe.fontBodyMedium")
                )

                # 주소
                if len(elems) >= 1:
                    address_value = elems[0].text.strip()
                else:
                    print(f"[WARN] [{idx+1}] 상세 페이지에서 주소 요소 부족")
                    address_value = ""

                # 전화번호
                call_value = ""
                pattern = re.compile(r"\d{2,4}-\d{3,4}-\d{4}")

                for elem in elems:
                    text = elem.text.strip()
                    if pattern.fullmatch(text):
                        call_value = text
                        break  # 첫 번째 전화번호 패턴 일치 요소만 사용
                if not call_value:
                    call_value = "가게에서 전화번호가 제공되지 않음"

            except Exception as e:
                print(f"[ERROR] [{idx+1}] 상세 페이지에서 주소/전화번호 크롤링 실패: {e}")
                address_value = ""
                call_value = ""

            # 주소
            try:
                address_elem = WebDriverWait(driver, 6).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div.Io6YTe.fontBodyMedium"))
                )
                address = address_elem.text.strip()
            except Exception:
                print(f"[WARN] [{idx+1}] 상세 페이지에서 주소 크롤링 실패")
                address = ""

            # 리뷰
            reviews=[]
            try:
                review_blocks = WebDriverWait(driver, 6).until(
                    lambda d: d.find_elements(By.CSS_SELECTOR, "div.jJc9Ad")
                )

                for block in review_blocks:
                    try:
                        nickname = block.find_element(By.CSS_SELECTOR, "div.d4r55").text.strip()
                        rating = block.find_element(By.CSS_SELECTOR, "span.kvMYJc").get_attribute("aria-label")
                        review_text = block.find_element(By.CSS_SELECTOR, "span.wiI7pd").text.strip()
                        reviews.append({
                            "nickname": nickname,
                            "rating": rating,
                            "text": review_text
                        })
                    except Exception as e:
                        print(f"[WARN] 리뷰 아이템 파싱 실패: {e}")

            except Exception:
                print(f"[WARN] [{idx+1} 상세 페이지에서 리뷰 크롤링 실패]")              

            # 별점
            try:
                rating_elem = WebDriverWait(driver, 6).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "span.ceNzKf"))
                )
                rating_value = rating_elem.get_attribute("aria-label")
            except Exception:
                print(f"[WARN] [{idx+1}] 상세 페이지에서 별점 크롤링 실패")
                rating_value = ""

            results.append({
                "id": idx + 1,
                "name": name,
                "address": address,
                "image": image,
                "rating_value": rating_value,
                "call_value": call_value,
                "review" : reviews
            })
            print(f"[{idx+1}] {name} - {address}")

            driver.back()
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.Nv2PK"))
            )
            time.sleep(random.uniform(0.2, 0.5))  # 돌아온 후 안정화 대기

        except Exception as e:
            print(f"[ERROR] [{idx+1}] 장소 처리 중 에러:", e)

except Exception as e:
    print("[ERROR] 장소 리스트 처리 실패:", e)

driver.quit()

output_path = os.path.join(os.path.dirname(__file__), "results_googlemaps.json")
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"[DONE] 총 {len(results)}개 결과를 {output_path}로 저장했습니다.")
