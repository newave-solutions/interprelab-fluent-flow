from playwright.sync_api import sync_playwright

def verify_interprelink_postcard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Mock the Supabase query for posts to avoid needing a real backend
        page.route("**/rest/v1/posts*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": "1", "content": "Test post content", "created_at": "2023-01-01T00:00:00Z", "user_id": "user1", "tags": ["test"]}]'
        ))

        # Go to InterpreLink page
        page.goto("http://localhost:8080/interprelink")

        # Wait for content to load
        page.wait_for_selector("text=Test post content", timeout=10000)

        # Take screenshot
        page.screenshot(path="verification/interprelink_postcard.png")

        browser.close()

if __name__ == "__main__":
    verify_interprelink_postcard()
