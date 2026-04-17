from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"

def test_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        
        context.add_init_script("""
            localStorage.setItem('accessToken', 'test-token');
            localStorage.setItem('refreshToken', 'test-refresh');
            localStorage.setItem('username', 'TestUser');
        """)
        
        page = context.new_page()
        
        print("=== Тест 1: Страница /login (без AppLayout) ===")
        login_page = context.new_page()
        login_page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
        login_page.wait_for_timeout(2000)
        login_page.screenshot(path="/tmp/test_final_login.png")
        
        sidebar = login_page.locator("nav.flex-column")
        if sidebar.count() == 0:
            print("✓ На странице /login нет sidebar")
        else:
            print("✗ На странице /login есть sidebar (ошибка)")
        login_page.close()
        
        print("\n=== Тест 2: Страница /devices (с AppLayout) ===")
        page.goto(f"{BASE_URL}/devices", wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        page.screenshot(path="/tmp/test_final_devices.png", full_page=True)
        
        # Header
        navbar = page.locator("nav.navbar")
        print(f"Navbar (Header): {navbar.count()}")
        
        # Sidebar
        sidebar = page.locator("nav.flex-column")
        print(f"Sidebar: {sidebar.count()}")
        
        # Icons
        icons = page.locator("i[class^='bi-']")
        print(f"Icons count: {icons.count()}")
        for i in range(min(icons.count(), 3)):
            print(f"  Icon {i}: {icons.nth(i).get_attribute('class')}")
        
        # Theme toggle
        theme_btn = page.locator("button[aria-label*='theme']")
        print(f"Theme toggle: {theme_btn.count()}")
        
        # Logout
        logout_btn = page.locator("button:has-text('Logout')")
        print(f"Logout button: {logout_btn.count()}")
        
        print("\n=== Тест 3: Переключение темы ===")
        if theme_btn.count() > 0:
            theme_btn.first.click()
            page.wait_for_timeout(500)
            page.screenshot(path="/tmp/test_final_dark.png", full_page=True)
            print("Тема переключена на dark")
        
        print("\n=== Тест завершен ===")
        browser.close()

if __name__ == "__main__":
    test_layout()
