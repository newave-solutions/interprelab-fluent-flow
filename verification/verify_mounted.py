from playwright.sync_api import sync_playwright

def verify_mounted(page):
    print("Navigating to home page...")
    page.goto("http://127.0.0.1:8080")

    # Just wait a fixed time, fallback
    page.wait_for_timeout(5000)

    print("Taking screenshot...")
    page.screenshot(path="verification/verification.png")
    print("Screenshot taken.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        verify_mounted(page)
        browser.close()
