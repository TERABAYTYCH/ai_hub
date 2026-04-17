from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"

def test_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        
        page = context.new_page()
        
        print("=== Тест: Страница /login ===")
        page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
        page.wait_for_timeout(3000)
        page.screenshot(path="/tmp/test_login.png", full_page=True)
        
        # Получаем содержимое страницы
        content = page.content()
        print(f"Page content length: {len(content)}")
        
        # Проверяем форму логина
        login_form = page.locator("form")
        print(f"Login form: {login_form.count()}")
        
        print("\n=== Тест завершен ===")
        print("Скриншот сохранен: /tmp/test_login.png")
        browser.close()

if __name__ == "__main__":
    test_layout()
