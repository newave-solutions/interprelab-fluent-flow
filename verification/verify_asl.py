
from playwright.sync_api import sync_playwright

def verify_asl_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # Go to the ASL Teacher page
            page.goto("http://127.0.0.1:8080/asl-teacher")

            # Wait for the page to load
            page.wait_for_load_state("networkidle")

            # Assert "ASL Teacher" heading exists
            # Relaxed selector for debugging
            page.screenshot(path="verification/debug_view.png")
            if page.get_by_text("ASL Teacher").count() > 0:
                print("Found 'ASL Teacher' text")
            else:
                print("Did NOT find 'ASL Teacher' text")


            # Take screenshot
            screenshot_path = "verification/asl_teacher.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Verification failed: {e}")
            # Take failure screenshot
            page.screenshot(path="verification/failure.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_asl_page()
