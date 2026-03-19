"""
Take screenshots of the HKJ Studio portfolio site using Playwright.
- Homepage: http://localhost:3001
- Works page: http://localhost:3001/works
"""

from playwright.sync_api import sync_playwright

VIEWPORT = {"width": 1440, "height": 900}
BASE_URL = "http://localhost:3001"
OUTPUT_DIR = r"C:\Users\Ryan Jun\.gemini\antigravity\scratch\hkjstudio\screenshots"

PAGES = [
    {"url": f"{BASE_URL}", "filename": "homepage-dict.png"},
    {"url": f"{BASE_URL}/works", "filename": "works-index.png"},
]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport=VIEWPORT)
        page = context.new_page()

        for entry in PAGES:
            url = entry["url"]
            filepath = f"{OUTPUT_DIR}\{entry['filename']}"
            print(f"Navigating to {url} ...")
            page.goto(url, wait_until="networkidle", timeout=30000)
            # Extra settle time for animations / hydration
            page.wait_for_timeout(2000)
            page.screenshot(path=filepath, full_page=False)
            print(f"Screenshot saved: {filepath}")

        browser.close()
        print("Done.")


if __name__ == "__main__":
    main()
