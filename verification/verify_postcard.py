from playwright.sync_api import sync_playwright

def verify_postcard_tooltips():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to ensure tooltips have space to render
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # Navigate to our test page
        page.goto("http://localhost:8080/test-postcard")

        # Wait for the card to be visible
        page.wait_for_selector("text=This is a test post")

        # 1. Hover over the "More options" button (MoreHorizontal icon)
        # It has aria-label="More options"
        more_btn = page.locator('button[aria-label="More options"]')
        more_btn.hover()

        # Wait for tooltip
        page.wait_for_selector("text=More options")

        # Take screenshot of More options tooltip
        page.screenshot(path="verification/tooltip_more.png")
        print("Captured More options tooltip")

        # Move mouse away to close tooltip
        page.mouse.move(0, 0)
        page.wait_for_timeout(500) # Wait for animation

        # 2. Hover over "Like" button
        like_btn = page.locator('button[aria-label="Like post"]')
        like_btn.hover()
        page.wait_for_selector("text=Like")
        page.screenshot(path="verification/tooltip_like.png")
        print("Captured Like tooltip")

        # 3. Hover over "Bookmark" button
        bookmark_btn = page.locator('button[aria-label="Save post"]')
        bookmark_btn.hover()
        page.wait_for_selector("text=Save post")

        # Take final verification screenshot showing the bookmark tooltip
        page.screenshot(path="verification/verification.png")
        print("Captured Save post tooltip")

if __name__ == "__main__":
    verify_postcard_tooltips()
