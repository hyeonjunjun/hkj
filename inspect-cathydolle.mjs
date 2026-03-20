import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio/cathydolle-analysis';

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  // ========== DESKTOP (1440x900) ==========
  console.log('\n=== DESKTOP VIEW (1440x900) ===');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const desktopPage = await desktopContext.newPage();

  // Navigate to cathydolle.com
  await desktopPage.goto('https://cathydolle.com', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(3000); // Wait for animations

  // Take initial screenshot
  await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, '01-desktop-initial.png'), fullPage: false });
  console.log('Desktop initial screenshot saved');

  // Check if there's a preloader/intro animation - wait and screenshot again
  await desktopPage.waitForTimeout(5000);
  await desktopPage.screenshot({ path: path.join(OUTPUT_DIR, '02-desktop-after-load.png'), fullPage: false });
  console.log('Desktop after-load screenshot saved');

  // Get the full page HTML structure
  const pageHTML = await desktopPage.evaluate(() => {
    return document.documentElement.outerHTML;
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'full-page.html'), pageHTML);
  console.log('Full page HTML saved');

  // Look for list view elements - check for common patterns
  const listViewAnalysis = await desktopPage.evaluate(() => {
    const results = {};

    // Find all links/items that look like project entries
    const allLinks = document.querySelectorAll('a');
    const projectLinks = [];
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      if (text && text.length > 0 && text.length < 100) {
        projectLinks.push({
          href,
          text: text.substring(0, 80),
          className: link.className,
          tagName: link.tagName,
          parentClassName: link.parentElement?.className || '',
          parentTagName: link.parentElement?.tagName || '',
          rect: link.getBoundingClientRect()
        });
      }
    });
    results.projectLinks = projectLinks;

    // Find view toggle buttons (list/grid/slider)
    const buttons = document.querySelectorAll('button');
    const toggleButtons = [];
    buttons.forEach(btn => {
      toggleButtons.push({
        text: btn.textContent.trim().substring(0, 50),
        className: btn.className,
        ariaLabel: btn.getAttribute('aria-label'),
        dataAttributes: Array.from(btn.attributes)
          .filter(a => a.name.startsWith('data-'))
          .map(a => `${a.name}=${a.value}`)
      });
    });
    results.toggleButtons = toggleButtons;

    // Find sections/containers with list-like structures
    const sections = document.querySelectorAll('section, [class*="list"], [class*="project"], [class*="work"], [class*="carousel"], [class*="slider"], [class*="swiper"]');
    const sectionInfo = [];
    sections.forEach(sec => {
      const style = window.getComputedStyle(sec);
      sectionInfo.push({
        tagName: sec.tagName,
        className: sec.className.substring(0, 200),
        id: sec.id,
        childCount: sec.children.length,
        display: style.display,
        overflow: style.overflow,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        position: style.position,
        rect: sec.getBoundingClientRect()
      });
    });
    results.sections = sectionInfo;

    // Look for any element with overflow scroll/auto that could be a carousel
    const allElements = document.querySelectorAll('*');
    const scrollableElements = [];
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.overflowX === 'scroll' || style.overflowX === 'auto' ||
          style.overflowY === 'scroll' || style.overflowY === 'auto' ||
          el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
        if (el.tagName !== 'HTML' && el.tagName !== 'BODY') {
          scrollableElements.push({
            tagName: el.tagName,
            className: el.className.toString().substring(0, 150),
            id: el.id,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            overflowX: style.overflowX,
            overflowY: style.overflowY,
            childCount: el.children.length
          });
        }
      }
    });
    results.scrollableElements = scrollableElements;

    return results;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'list-view-analysis.json'), JSON.stringify(listViewAnalysis, null, 2));
  console.log('List view analysis saved');
  console.log('Project links found:', listViewAnalysis.projectLinks.length);
  console.log('Toggle buttons found:', listViewAnalysis.toggleButtons.length);
  console.log('Scrollable elements found:', listViewAnalysis.scrollableElements.length);

  // Try to find and click list view toggle if it exists
  const listToggle = await desktopPage.evaluate(() => {
    // Look for list/grid toggle
    const buttons = document.querySelectorAll('button, [role="button"], a[class*="toggle"], [class*="view"]');
    const found = [];
    buttons.forEach(btn => {
      const text = btn.textContent.trim().toLowerCase();
      const cls = (btn.className || '').toString().toLowerCase();
      if (text.includes('list') || cls.includes('list') || text.includes('index') || cls.includes('index')) {
        found.push({
          text: btn.textContent.trim(),
          className: btn.className.toString(),
          tagName: btn.tagName,
          selector: btn.id ? `#${btn.id}` : null
        });
      }
    });
    return found;
  });
  console.log('\nList toggle candidates:', JSON.stringify(listToggle, null, 2));

  // Deep dive into the main content area structure
  const mainContentStructure = await desktopPage.evaluate(() => {
    function getNodeInfo(el, depth = 0, maxDepth = 5) {
      if (depth > maxDepth) return '...';
      const style = window.getComputedStyle(el);
      const info = {
        tag: el.tagName.toLowerCase(),
        class: el.className.toString().substring(0, 150),
        id: el.id || undefined,
        display: style.display,
        position: style.position,
        overflow: style.overflow !== 'visible' ? style.overflow : undefined,
        flexDirection: style.display.includes('flex') ? style.flexDirection : undefined,
        gridTemplate: style.display.includes('grid') ? style.gridTemplateColumns : undefined,
        transform: style.transform !== 'none' ? style.transform.substring(0, 80) : undefined,
        transition: style.transition !== 'all 0s ease 0s' ? style.transition.substring(0, 100) : undefined,
        width: style.width,
        height: style.height,
        rect: {
          x: Math.round(el.getBoundingClientRect().x),
          y: Math.round(el.getBoundingClientRect().y),
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height)
        },
        text: el.children.length === 0 ? el.textContent.trim().substring(0, 60) : undefined
      };

      // Clean undefined
      Object.keys(info).forEach(k => info[k] === undefined && delete info[k]);

      if (el.children.length > 0 && el.children.length <= 30) {
        info.children = Array.from(el.children).map(c => getNodeInfo(c, depth + 1, maxDepth));
      } else if (el.children.length > 30) {
        info.childCount = el.children.length;
        info.firstChild = getNodeInfo(el.children[0], depth + 1, maxDepth);
        info.lastChild = getNodeInfo(el.children[el.children.length - 1], depth + 1, maxDepth);
      }

      return info;
    }

    // Get main content - try common selectors
    const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('#__next') || document.querySelector('#root') || document.body;
    return getNodeInfo(main, 0, 4);
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'main-content-structure.json'), JSON.stringify(mainContentStructure, null, 2));
  console.log('Main content structure saved');

  // Look specifically for project list items and their hover image elements
  const projectItemsDetailed = await desktopPage.evaluate(() => {
    // Find elements that look like project list items
    const candidates = document.querySelectorAll(
      '[class*="project"], [class*="work"], [class*="item"], [class*="entry"], [class*="slide"], li, [role="listitem"]'
    );

    const items = [];
    candidates.forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      // Filter to visible, reasonably sized elements
      if (rect.width > 100 && rect.height > 20 && rect.height < 500) {
        const imgs = el.querySelectorAll('img, video, picture, [style*="background-image"]');
        const imgInfo = Array.from(imgs).map(img => ({
          tag: img.tagName,
          src: img.src || img.getAttribute('style')?.match(/url\(['"](.*?)['"]\)/)?.[1] || '',
          className: img.className.toString().substring(0, 100),
          display: window.getComputedStyle(img).display,
          visibility: window.getComputedStyle(img).visibility,
          opacity: window.getComputedStyle(img).opacity,
          position: window.getComputedStyle(img).position,
          rect: {
            x: Math.round(img.getBoundingClientRect().x),
            y: Math.round(img.getBoundingClientRect().y),
            w: Math.round(img.getBoundingClientRect().width),
            h: Math.round(img.getBoundingClientRect().height)
          }
        }));

        items.push({
          tagName: el.tagName,
          className: el.className.toString().substring(0, 200),
          text: el.textContent.trim().substring(0, 100),
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
          display: style.display,
          cursor: style.cursor,
          hasImages: imgs.length > 0,
          imageCount: imgs.length,
          images: imgInfo,
          hasHoverListeners: el.onmouseenter !== undefined || el.onmouseover !== undefined
        });
      }
    });

    return items;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'project-items-detailed.json'), JSON.stringify(projectItemsDetailed, null, 2));
  console.log('Project items detailed analysis saved, count:', projectItemsDetailed.length);

  // Check for hover image containers (often positioned absolute/fixed, hidden by default)
  const hoverImageContainers = await desktopPage.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const hidden = [];
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const hasImage = el.querySelector('img, video') || style.backgroundImage !== 'none';
      if (hasImage && (
        style.opacity === '0' ||
        style.visibility === 'hidden' ||
        style.display === 'none' ||
        (style.position === 'fixed' && style.pointerEvents === 'none') ||
        (style.position === 'absolute' && style.opacity === '0')
      )) {
        hidden.push({
          tagName: el.tagName,
          className: el.className.toString().substring(0, 200),
          id: el.id,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          position: style.position,
          pointerEvents: style.pointerEvents,
          zIndex: style.zIndex,
          rect: el.getBoundingClientRect()
        });
      }
    });
    return hidden;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'hover-image-containers.json'), JSON.stringify(hoverImageContainers, null, 2));
  console.log('Hover image containers found:', hoverImageContainers.length);

  // ========== Simulate Hover on project items ==========
  console.log('\n=== SIMULATING HOVER ===');

  // Find all anchor/link elements that could be project items
  const projectAnchors = await desktopPage.$$('a');
  console.log('Total anchors found:', projectAnchors.length);

  // Try hovering over project-like links and capturing changes
  for (let i = 0; i < Math.min(projectAnchors.length, 15); i++) {
    const anchor = projectAnchors[i];
    const text = await anchor.textContent();
    const href = await anchor.getAttribute('href');
    const rect = await anchor.boundingBox();

    if (text && text.trim().length > 2 && text.trim().length < 60 && rect && rect.height > 15) {
      console.log(`\nHovering over: "${text.trim().substring(0, 40)}" (href: ${href})`);

      // Get state before hover
      const beforeState = await desktopPage.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        return Array.from(imgs).map(img => ({
          src: img.src.substring(img.src.lastIndexOf('/') + 1),
          opacity: window.getComputedStyle(img).opacity,
          visibility: window.getComputedStyle(img).visibility,
          display: window.getComputedStyle(img).display,
          transform: window.getComputedStyle(img).transform
        }));
      });

      // Hover
      await anchor.hover();
      await desktopPage.waitForTimeout(500);

      // Get state after hover
      const afterState = await desktopPage.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        return Array.from(imgs).map(img => ({
          src: img.src.substring(img.src.lastIndexOf('/') + 1),
          opacity: window.getComputedStyle(img).opacity,
          visibility: window.getComputedStyle(img).visibility,
          display: window.getComputedStyle(img).display,
          transform: window.getComputedStyle(img).transform
        }));
      });

      // Check for changes
      const changes = [];
      for (let j = 0; j < afterState.length; j++) {
        if (j < beforeState.length) {
          if (beforeState[j].opacity !== afterState[j].opacity ||
              beforeState[j].visibility !== afterState[j].visibility ||
              beforeState[j].transform !== afterState[j].transform) {
            changes.push({
              image: afterState[j].src,
              before: beforeState[j],
              after: afterState[j]
            });
          }
        }
      }

      if (changes.length > 0) {
        console.log('  IMAGE CHANGES DETECTED:', JSON.stringify(changes, null, 2));
        // Take screenshot of hover state
        await desktopPage.screenshot({
          path: path.join(OUTPUT_DIR, `03-desktop-hover-${i}.png`),
          fullPage: false
        });
      }
    }
  }

  // ========== Extract all CSS and JS related to the list view ==========
  console.log('\n=== EXTRACTING STYLES AND SCRIPTS ===');

  // Get all inline styles and computed styles for the main container
  const allStyles = await desktopPage.evaluate(() => {
    const stylesheets = document.styleSheets;
    const rules = [];
    for (let i = 0; i < stylesheets.length; i++) {
      try {
        const sheet = stylesheets[i];
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j].cssText;
          // Filter for potentially relevant rules
          if (rule.includes('project') || rule.includes('list') || rule.includes('item') ||
              rule.includes('work') || rule.includes('hover') || rule.includes('carousel') ||
              rule.includes('slider') || rule.includes('swiper') || rule.includes('slide') ||
              rule.includes('thumbnail') || rule.includes('preview') || rule.includes('cursor') ||
              rule.includes('image') || rule.includes('gallery')) {
            rules.push(rule.substring(0, 500));
          }
        }
      } catch(e) {
        // CORS blocked stylesheets
      }
    }
    return rules;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'relevant-css-rules.json'), JSON.stringify(allStyles, null, 2));
  console.log('Relevant CSS rules found:', allStyles.length);

  // Check for framework indicators (React, Next.js, Framer Motion, GSAP, Swiper, etc.)
  const frameworkInfo = await desktopPage.evaluate(() => {
    const info = {
      nextJs: !!document.querySelector('#__next') || !!document.querySelector('[data-nextjs-scroll-focus-boundary]'),
      react: !!document.querySelector('[data-reactroot]') || !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
      gsap: !!window.gsap,
      framerMotion: !!document.querySelector('[style*="will-change"]'),
      swiper: !!document.querySelector('.swiper') || !!window.Swiper,
      lenis: !!window.__lenis,
      locomotive: !!document.querySelector('[data-scroll-container]'),
      barba: !!window.barba,

      // Check for data attributes on body/root
      bodyDataAttrs: Array.from(document.body.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}=${a.value}`),
      htmlDataAttrs: Array.from(document.documentElement.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}=${a.value}`),

      // Check for meta tags
      generator: document.querySelector('meta[name="generator"]')?.content,
    };

    // Check all script sources
    const scripts = document.querySelectorAll('script[src]');
    info.scriptSources = Array.from(scripts).map(s => s.src).filter(s =>
      !s.includes('analytics') && !s.includes('gtag') && !s.includes('gtm')
    );

    return info;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'framework-info.json'), JSON.stringify(frameworkInfo, null, 2));
  console.log('\nFramework info:', JSON.stringify(frameworkInfo, null, 2));

  // ========== LOOK FOR THE SPECIFIC LIST/SLIDER TOGGLE ==========
  console.log('\n=== LOOKING FOR VIEW TOGGLE ===');

  // Get all interactive elements
  const interactiveElements = await desktopPage.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"], [role="tab"], [class*="toggle"], [class*="switch"], [class*="mode"]');
    return Array.from(els).map(el => ({
      tag: el.tagName,
      text: el.textContent.trim().substring(0, 50),
      className: el.className.toString().substring(0, 200),
      ariaLabel: el.getAttribute('aria-label'),
      role: el.getAttribute('role'),
      rect: {
        x: Math.round(el.getBoundingClientRect().x),
        y: Math.round(el.getBoundingClientRect().y),
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height)
      },
      isVisible: el.getBoundingClientRect().width > 0
    }));
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'interactive-elements.json'), JSON.stringify(interactiveElements, null, 2));
  console.log('Interactive elements found:', interactiveElements.length);

  // Get full body inner HTML structure (first 2 levels only, cleaned up)
  const bodyStructure = await desktopPage.evaluate(() => {
    function cleanHTML(el, depth = 0) {
      if (depth > 3) return '';
      let result = '';
      const tag = el.tagName.toLowerCase();
      const cls = el.className ? ` class="${el.className.toString().substring(0, 100)}"` : '';
      const id = el.id ? ` id="${el.id}"` : '';
      const style = el.getAttribute('style') ? ` style="${el.getAttribute('style').substring(0, 100)}"` : '';
      const dataAttrs = Array.from(el.attributes)
        .filter(a => a.name.startsWith('data-'))
        .map(a => ` ${a.name}="${a.value.substring(0, 50)}"`)
        .join('');

      result += `${'  '.repeat(depth)}<${tag}${id}${cls}${dataAttrs}${style}>\n`;

      if (el.children.length === 0 && el.textContent.trim()) {
        result += `${'  '.repeat(depth + 1)}${el.textContent.trim().substring(0, 60)}\n`;
      } else {
        for (const child of el.children) {
          result += cleanHTML(child, depth + 1);
        }
      }

      return result;
    }

    const root = document.querySelector('#__next') || document.querySelector('#root') || document.body;
    return cleanHTML(root, 0);
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'body-structure.txt'), bodyStructure);
  console.log('Body structure saved');

  await desktopContext.close();

  // ========== TABLET (768x1024) ==========
  console.log('\n=== TABLET VIEW (768x1024) ===');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 }
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto('https://cathydolle.com', { waitUntil: 'networkidle', timeout: 30000 });
  await tabletPage.waitForTimeout(5000);
  await tabletPage.screenshot({ path: path.join(OUTPUT_DIR, '04-tablet-view.png'), fullPage: false });

  const tabletLayout = await tabletPage.evaluate(() => {
    const main = document.querySelector('main') || document.querySelector('#__next') || document.body;
    const allChildren = main.querySelectorAll('*');
    const visibleItems = [];
    allChildren.forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (rect.width > 50 && rect.height > 20 && style.display !== 'none' && style.visibility !== 'hidden') {
        const text = el.children.length === 0 ? el.textContent.trim() : '';
        if (text.length > 3 && text.length < 60) {
          visibleItems.push({
            tag: el.tagName,
            class: el.className.toString().substring(0, 100),
            text,
            rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
            fontSize: style.fontSize
          });
        }
      }
    });
    return visibleItems;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'tablet-layout.json'), JSON.stringify(tabletLayout, null, 2));
  console.log('Tablet layout saved');
  await tabletContext.close();

  // ========== MOBILE (375x812) ==========
  console.log('\n=== MOBILE VIEW (375x812) ===');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('https://cathydolle.com', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(5000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, '05-mobile-view.png'), fullPage: false });

  const mobileLayout = await mobilePage.evaluate(() => {
    const main = document.querySelector('main') || document.querySelector('#__next') || document.body;
    const style = window.getComputedStyle(main);
    return {
      mainDisplay: style.display,
      mainOverflow: style.overflow,
      mainHeight: style.height,
      bodyHeight: document.body.scrollHeight,
      viewportHeight: window.innerHeight,
      isScrollable: document.body.scrollHeight > window.innerHeight
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'mobile-layout.json'), JSON.stringify(mobileLayout, null, 2));
  console.log('Mobile layout saved');
  await mobileContext.close();

  await browser.close();
  console.log('\n=== ANALYSIS COMPLETE ===');
  console.log(`All output saved to: ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
