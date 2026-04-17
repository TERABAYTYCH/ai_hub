from playwright.sync_api import sync_playwright
import time

BASE_URL = "http://localhost:5173"

def test_auth():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()
        
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        
        print("=== Тест 1: Регистрация нового пользователя ===")
        page.goto(f"{BASE_URL}/register", wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        
        timestamp = int(time.time())
        username = f"user_{timestamp}"
        email = f"user_{timestamp}@test.com"
        password = "Test123456!"
        
        print(f"Регистрация: {username} / {email}")
        
        # Заполняем форму
        page.fill("input[type='text']", username)
        page.fill("input[type='email']", email)
        page.fill("input[type='password']", password)
        
        # Ищем все password поля (включая confirm password)
        password_fields = page.locator("input[type='password']")
        password_fields.nth(1).fill(password)
        
        page.screenshot(path="/tmp/test_register_form.png", full_page=True)
        
        # Отправляем форму
        page.click("button[type='submit']")
        page.wait_for_timeout(3000)
        
        print(f"URL после регистрации: {page.url}")
        page.screenshot(path="/tmp/test_after_register.png", full_page=True)
        
        # Проверяем localStorage
        token = page.evaluate("() => localStorage.getItem('accessToken')")
        print(f"accessToken в localStorage: {token[:20]}... if token else 'None'")
        
        # Проверяем, редирект на /devices
        if "/devices" in page.url:
            print("✓ Успешный редирект на /devices")
        else:
            print(f"✗ Нет редиректа на /devices (текущий URL: {page.url})")
        
        print("\n=== Тест 2: Логаут и проверка редиректа ===")
        logout_btn = page.locator("button:has-text('Logout')")
        if logout_btn.count() > 0:
            logout_btn.click()
            page.wait_for_timeout(2000)
            print(f"URL после логаута: {page.url}")
            if "/login" in page.url:
                print("✓ Редирект на /login после логаута")
        
        print("\n=== Console Errors ===")
        for err in console_errors[:5]:
            print(f"  {err}")
        
        browser.close()
        print("\n=== Тест завершен ===")

if __name__ == "__main__":
    test_auth()
