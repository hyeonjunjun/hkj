from playwright.sync_api import sync_playwright

pages_config = [
    ("/", "audit-home.png", False),
    ("/works", "audit-works.png", False),
    ("/about", "audit-about.png", True),
    ("/coddiwomple", "audit-coddiwomple.png", True),
    ("/work/gyeol", "audit-casestudy.png", True),
    ("/lab", "audit-lab.png", True),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    for path, filename, full in pages_config:
        url = f"http://localhost:3001{path}"
        try:
            resp = page.goto(url, wait_until="networkidle")
            status = resp.status if resp else "no response"
            page.wait_for_timeout(2000)
            out = rf"C:\Users\Ryan Jun\.gemini\antigravity\scratch\hkjstudio\screenshots\{filename}"
            page.screenshot(path=out, full_page=full)
            print(f"{path} -> {status} -> {filename}")
        except Exception as e:
            print(f"{path} -> ERROR: {e}")
    
    browser.close()
    print("Done")
