from playwright.sync_api import sync_playwright
import time

BASE_URL = "http://localhost:5173"

def test_username():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()
        
        print("=== Тест: Проверка имени пользователя после регистрации ===")
        
        timestamp = int(time.time())
        username = f"testuser_{timestamp}"
        email = f"test_{timestamp}@test.com"
        password = "Test123456!"
        
        page.goto(f"{BASE_URL}/register", wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        
        page.fill("input[type='text']", username)
        page.fill("input[type='email']", email)
        password_fields = page.locator("input[type='password']")
        password_fields.nth(0).fill(password)
        password_fields.nth(1).fill(password)
        
        page.click("button[type='submit']")
        page.wait_for_timeout(3000)
        
        print(f"URL: {page.url}")
        
        # Проверяем сохраненные данные
        user_data = page.evaluate("() => localStorage.getItem('user')")
        print(f"User in localStorage: {user_data}")
        
        # Проверяем отображение в header
        page.wait_for_timeout(1000)
        # Ищем текст в header
        header_text = page.locator("nav.navbar").text_content()
        print(f"Header text: {header_text}")
        
        if username in header_text:
            print(f"✓ Имя пользователя '{username}' отображается в header")
        else:
            print(f"✗ Имя пользователя '{username}' НЕ найдено в header")
        
        browser.close()

if __name__ == "__main__":
    test_username()
