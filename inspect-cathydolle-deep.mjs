import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio/cathydolle-analysis';

async function main() {
  const browser = await chromium.launch({ headless: true });

  // ========== DESKTOP (1440x900) — Deep Dive ==========
  console.log('\n=== DESKTOP DEEP DIVE ===');
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await ctx.newPage();

  await page.goto('https://cathydolle.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);

  // 1. Extract the exact HTML of the #vertical-layout UL and its list items
  const listViewHTML = await page.evaluate(() => {
    const ul = document.querySelector('#vertical-layout ul');
    if (!ul) return 'UL NOT FOUND';
    return ul.outerHTML;
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'list-view-ul.html'), listViewHTML);
  console.log('List view UL HTML saved');

  // 2. Get detailed info about each <li> item
  const listItems = await page.evaluate(() => {
    const lis = document.querySelectorAll('#vertical-layout ul li');
    return Array.from(lis).map((li, i) => {
      const style = window.getComputedStyle(li);
      const div = li.querySelector('div');
      const divStyle = div ? window.getComputedStyle(div) : null;
      const spans = li.querySelectorAll('span');
      const spanTexts = Array.from(spans).map(s => ({
        text: s.textContent.trim(),
        className: s.className.substring(0, 200),
        display: window.getComputedStyle(s).display,
        opacity: window.getComputedStyle(s).opacity,
        width: window.getComputedStyle(s).width
      }));

      return {
        index: i,
        id: li.id,
        className: li.className.substring(0, 300),
        text: li.textContent.trim().substring(0, 80),
        rect: {
          x: Math.round(li.getBoundingClientRect().x),
          y: Math.round(li.getBoundingClientRect().y),
          w: Math.round(li.getBoundingClientRect().width),
          h: Math.round(li.getBoundingClientRect().height)
        },
        display: style.display,
        height: style.height,
        width: style.width,
        cursor: style.cursor,
        opacity: style.opacity,
        transition: style.transition,
        borderBottom: style.borderBottom,
        overflow: style.overflow,
        innerDivClass: div ? div.className.substring(0, 300) : null,
        innerDivTransition: divStyle ? divStyle.transition : null,
        innerDivDisplay: divStyle ? divStyle.display : null,
        innerDivFlexDirection: divStyle ? divStyle.flexDirection : null,
        spans: spanTexts,
        allAttributes: Array.from(li.attributes).map(a => `${a.name}="${a.value.substring(0, 80)}"`)
      };
    });
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'list-items-detailed.json'), JSON.stringify(listItems, null, 2));
  console.log('List items detailed:', listItems.length);

  // 3. Examine the #scrollContainer and its canvas
  const scrollContainerInfo = await page.evaluate(() => {
    const sc = document.getElementById('scrollContainer');
    if (!sc) return 'NOT FOUND';
    const canvas = sc.querySelector('canvas');
    const style = window.getComputedStyle(sc);
    return {
      id: sc.id,
      className: sc.className,
      display: style.display,
      position: style.position,
      width: style.width,
      height: style.height,
      overflow: style.overflow,
      zIndex: style.zIndex,
      childCount: sc.children.length,
      canvas: canvas ? {
        width: canvas.width,
        height: canvas.height,
        className: canvas.className,
        style: {
          position: window.getComputedStyle(canvas).position,
          width: window.getComputedStyle(canvas).width,
          height: window.getComputedStyle(canvas).height,
          top: window.getComputedStyle(canvas).top,
          left: window.getComputedStyle(canvas).left,
          zIndex: window.getComputedStyle(canvas).zIndex,
          pointerEvents: window.getComputedStyle(canvas).pointerEvents,
          opacity: window.getComputedStyle(canvas).opacity
        }
      } : null
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'scroll-container-info.json'), JSON.stringify(scrollContainerInfo, null, 2));
  console.log('Scroll container info:', JSON.stringify(scrollContainerInfo, null, 2));

  // 4. Look for the List/Slider toggle and its interaction
  const toggleInfo = await page.evaluate(() => {
    const listSpan = document.getElementById('list');
    const sliderSpan = document.getElementById('slider');
    return {
      list: listSpan ? {
        text: listSpan.textContent.trim(),
        className: listSpan.className,
        opacity: window.getComputedStyle(listSpan).opacity,
        pointerEvents: window.getComputedStyle(listSpan).pointerEvents,
        cursor: window.getComputedStyle(listSpan).cursor,
        display: window.getComputedStyle(listSpan).display,
        transition: window.getComputedStyle(listSpan).transition,
        transform: window.getComputedStyle(listSpan).transform
      } : null,
      slider: sliderSpan ? {
        text: sliderSpan.textContent.trim(),
        className: sliderSpan.className,
        opacity: window.getComputedStyle(sliderSpan).opacity,
        pointerEvents: window.getComputedStyle(sliderSpan).pointerEvents,
        cursor: window.getComputedStyle(sliderSpan).cursor,
        display: window.getComputedStyle(sliderSpan).display,
        transition: window.getComputedStyle(sliderSpan).transition,
        transform: window.getComputedStyle(sliderSpan).transform
      } : null
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'toggle-info.json'), JSON.stringify(toggleInfo, null, 2));
  console.log('Toggle info:', JSON.stringify(toggleInfo, null, 2));

  // 5. Simulate hover on each list item and screenshot
  const firstListItem = await page.$('#vertical-layout ul li:first-child > div');
  if (firstListItem) {
    console.log('\nHovering over first list item...');
    await firstListItem.hover();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06-desktop-hover-item1.png'), fullPage: false });

    // Check canvas state after hover
    const canvasAfterHover1 = await page.evaluate(() => {
      const canvas = document.querySelector('#scrollContainer canvas');
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      // Check if canvas has any content by sampling pixels
      try {
        const pixels = ctx.getImageData(720, 450, 1, 1).data; // center pixel
        return {
          centerPixel: Array.from(pixels),
          opacity: window.getComputedStyle(canvas).opacity,
          width: canvas.width,
          height: canvas.height
        };
      } catch(e) {
        return { error: e.message };
      }
    });
    console.log('Canvas after hover 1:', JSON.stringify(canvasAfterHover1));
  }

  // Hover on second item
  const secondListItem = await page.$('#vertical-layout ul li:nth-child(2) > div');
  if (secondListItem) {
    console.log('Hovering over second list item...');
    await secondListItem.hover();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07-desktop-hover-item2.png'), fullPage: false });
  }

  // Hover on 7th item (right column)
  const seventhListItem = await page.$('#vertical-layout ul li:nth-child(7) > div');
  if (seventhListItem) {
    console.log('Hovering over 7th list item (right col)...');
    await seventhListItem.hover();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08-desktop-hover-item7.png'), fullPage: false });
  }

  // 6. Move mouse away and take screenshot to see the "rest" state
  await page.mouse.move(720, 20); // move to top center (nav area)
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09-desktop-no-hover.png'), fullPage: false });

  // 7. Examine the #pixelCrosshair element behavior
  const pixelCrosshairInfo = await page.evaluate(() => {
    const el = document.getElementById('pixelCrosshair');
    const text = document.getElementById('pixelText');
    if (!el) return null;
    const style = window.getComputedStyle(el);
    return {
      className: el.className,
      opacity: style.opacity,
      display: style.display,
      position: style.position,
      transform: style.transform,
      children: Array.from(el.children).map(c => ({
        tag: c.tagName,
        className: c.className.substring(0, 200),
        id: c.id,
        text: c.textContent.trim().substring(0, 60),
        display: window.getComputedStyle(c).display,
        position: window.getComputedStyle(c).position,
        opacity: window.getComputedStyle(c).opacity,
        rect: {
          x: Math.round(c.getBoundingClientRect().x),
          y: Math.round(c.getBoundingClientRect().y),
          w: Math.round(c.getBoundingClientRect().width),
          h: Math.round(c.getBoundingClientRect().height)
        }
      })),
      parentClassName: el.parentElement?.className || '',
      parentStyle: {
        mixBlendMode: window.getComputedStyle(el.parentElement).mixBlendMode,
        pointerEvents: window.getComputedStyle(el.parentElement).pointerEvents,
        position: window.getComputedStyle(el.parentElement).position,
        zIndex: window.getComputedStyle(el.parentElement).zIndex
      }
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'pixel-crosshair-info.json'), JSON.stringify(pixelCrosshairInfo, null, 2));
  console.log('Pixel crosshair info saved');

  // 8. Try to click the "Slider" toggle to switch views
  console.log('\n=== SWITCHING TO SLIDER VIEW ===');
  const sliderToggle = await page.$('#slider');
  if (sliderToggle) {
    // First, make it clickable by removing pointer-events-none
    await page.evaluate(() => {
      const el = document.getElementById('slider');
      if (el) {
        el.style.pointerEvents = 'all';
        el.style.opacity = '1';
      }
    });
    await sliderToggle.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10-desktop-slider-view.png'), fullPage: false });

    // Analyze the slider view
    const sliderViewAnalysis = await page.evaluate(() => {
      const sc = document.getElementById('scrollContainer');
      const vl = document.getElementById('vertical-layout');
      return {
        scrollContainer: {
          height: sc?.getBoundingClientRect().height,
          scrollHeight: sc?.scrollHeight,
          opacity: sc ? window.getComputedStyle(sc).opacity : null,
          display: sc ? window.getComputedStyle(sc).display : null,
          childCount: sc?.children.length,
          innerHTML: sc?.innerHTML.substring(0, 500)
        },
        verticalLayout: {
          opacity: vl ? window.getComputedStyle(vl).opacity : null,
          pointerEvents: vl ? window.getComputedStyle(vl).pointerEvents : null,
          display: vl ? window.getComputedStyle(vl).display : null
        }
      };
    });

    fs.writeFileSync(path.join(OUTPUT_DIR, 'slider-view-analysis.json'), JSON.stringify(sliderViewAnalysis, null, 2));
    console.log('Slider view analysis:', JSON.stringify(sliderViewAnalysis, null, 2));
  }

  // 9. Try analyzing React event handlers on list items
  const reactEventInfo = await page.evaluate(() => {
    // Check if elements have React fiber nodes
    const li = document.querySelector('#vertical-layout ul li');
    if (!li) return 'no li found';

    const fiberKey = Object.keys(li).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    const propsKey = Object.keys(li).find(k => k.startsWith('__reactProps$'));

    const result = {
      fiberKey: fiberKey || 'not found',
      propsKey: propsKey || 'not found',
      allKeys: Object.keys(li).filter(k => k.startsWith('__'))
    };

    if (propsKey) {
      const props = li[propsKey];
      result.propsKeys = Object.keys(props);
      result.hasOnMouseEnter = !!props.onMouseEnter;
      result.hasOnMouseLeave = !!props.onMouseLeave;
      result.hasOnClick = !!props.onClick;
      result.hasOnMouseMove = !!props.onMouseMove;

      // Check inner div props too
      const innerDiv = li.querySelector('div');
      if (innerDiv) {
        const innerPropsKey = Object.keys(innerDiv).find(k => k.startsWith('__reactProps$'));
        if (innerPropsKey) {
          const innerProps = innerDiv[innerPropsKey];
          result.innerDivPropsKeys = Object.keys(innerProps);
          result.innerDivHasOnMouseEnter = !!innerProps.onMouseEnter;
          result.innerDivHasOnMouseLeave = !!innerProps.onMouseLeave;
          result.innerDivHasOnMouseMove = !!innerProps.onMouseMove;
          result.innerDivHasOnClick = !!innerProps.onClick;
        }
      }
    }

    return result;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'react-event-info.json'), JSON.stringify(reactEventInfo, null, 2));
  console.log('React event info:', JSON.stringify(reactEventInfo, null, 2));

  // 10. Extract complete styles for the list and its items
  const listStyles = await page.evaluate(() => {
    const ul = document.querySelector('#vertical-layout ul');
    if (!ul) return null;
    const ulStyle = window.getComputedStyle(ul);

    const firstLi = ul.querySelector('li');
    const liStyle = firstLi ? window.getComputedStyle(firstLi) : null;

    return {
      ul: {
        display: ulStyle.display,
        flexDirection: ulStyle.flexDirection,
        flexWrap: ulStyle.flexWrap,
        justifyContent: ulStyle.justifyContent,
        alignItems: ulStyle.alignItems,
        gap: ulStyle.gap,
        rowGap: ulStyle.rowGap,
        columnGap: ulStyle.columnGap,
        maxHeight: ulStyle.maxHeight,
        height: ulStyle.height,
        width: ulStyle.width,
        padding: ulStyle.padding,
        overflow: ulStyle.overflow,
        overflowX: ulStyle.overflowX,
        overflowY: ulStyle.overflowY,
        position: ulStyle.position,
        className: ul.className
      },
      li: liStyle ? {
        display: liStyle.display,
        flexDirection: liStyle.flexDirection,
        justifyContent: liStyle.justifyContent,
        alignItems: liStyle.alignItems,
        height: liStyle.height,
        width: liStyle.width,
        borderBottom: liStyle.borderBottom,
        borderBottomWidth: liStyle.borderBottomWidth,
        borderBottomColor: liStyle.borderBottomColor,
        borderBottomStyle: liStyle.borderBottomStyle,
        cursor: liStyle.cursor,
        transition: liStyle.transition,
        opacity: liStyle.opacity,
        padding: liStyle.padding,
        margin: liStyle.margin,
        position: liStyle.position,
        className: firstLi.className
      } : null
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'list-styles.json'), JSON.stringify(listStyles, null, 2));
  console.log('List styles saved');

  // 11. Check for all image sources that might be preloaded
  const allImages = await page.evaluate(() => {
    // Check for img elements
    const imgs = document.querySelectorAll('img');
    const imgSources = Array.from(imgs).map(img => ({
      src: img.src,
      className: img.className,
      width: img.width,
      height: img.height,
      display: window.getComputedStyle(img).display,
      visibility: window.getComputedStyle(img).visibility,
      opacity: window.getComputedStyle(img).opacity
    }));

    // Check for preload links
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"], link[rel="preload"][type*="image"]');
    const preloads = Array.from(preloadLinks).map(l => l.href);

    // Check for Next.js image data
    const nextData = document.querySelector('#__NEXT_DATA__');
    let nextImgData = null;
    if (nextData) {
      try {
        const data = JSON.parse(nextData.textContent);
        nextImgData = JSON.stringify(data).substring(0, 1000);
      } catch(e) {}
    }

    return { imgSources, preloads, nextImgData };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'all-images.json'), JSON.stringify(allImages, null, 2));
  console.log('All images:', JSON.stringify(allImages, null, 2));

  // 12. Get the full body scroll height and check for horizontal scroll container
  const scrollBehavior = await page.evaluate(() => {
    return {
      bodyScrollHeight: document.body.scrollHeight,
      bodyScrollWidth: document.body.scrollWidth,
      bodyClientHeight: document.body.clientHeight,
      bodyClientWidth: document.body.clientWidth,
      windowInnerHeight: window.innerHeight,
      windowInnerWidth: window.innerWidth,
      isVerticallyScrollable: document.body.scrollHeight > window.innerHeight,
      isHorizontallyScrollable: document.body.scrollWidth > window.innerWidth,
      scrollContainerScrollWidth: document.getElementById('scrollContainer')?.scrollWidth,
      scrollContainerScrollHeight: document.getElementById('scrollContainer')?.scrollHeight,
      scrollContainerClientWidth: document.getElementById('scrollContainer')?.clientWidth,
      scrollContainerClientHeight: document.getElementById('scrollContainer')?.clientHeight,
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'scroll-behavior.json'), JSON.stringify(scrollBehavior, null, 2));
  console.log('Scroll behavior:', JSON.stringify(scrollBehavior, null, 2));

  // 13. Extract the JS bundle URLs to analyze for interaction patterns
  const jsBundles = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script[src*="_next"]');
    return Array.from(scripts).map(s => s.src);
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'js-bundles.json'), JSON.stringify(jsBundles, null, 2));

  // 14. Fetch the main app bundle and look for key interaction code
  console.log('\n=== FETCHING JS BUNDLES ===');
  for (const url of jsBundles.slice(0, 5)) {
    try {
      const resp = await page.evaluate(async (url) => {
        const r = await fetch(url);
        const text = await r.text();
        return text.substring(0, 200000); // first 200KB
      }, url);

      // Search for keywords
      const keywords = ['mouseenter', 'mouseleave', 'mousemove', 'canvas', 'drawImage', 'scrollContainer', 'vertical-layout', 'slider', 'list', 'carousel', 'pixelCrosshair', 'hover', 'onHover', 'activeProject', 'activeIndex'];
      const matches = {};
      for (const kw of keywords) {
        const idx = resp.indexOf(kw);
        if (idx !== -1) {
          // Get some context around the match
          matches[kw] = resp.substring(Math.max(0, idx - 100), Math.min(resp.length, idx + 200));
        }
      }

      if (Object.keys(matches).length > 0) {
        const bundleName = url.split('/').pop().split('?')[0];
        fs.writeFileSync(path.join(OUTPUT_DIR, `bundle-matches-${bundleName}.json`), JSON.stringify(matches, null, 2));
        console.log(`Bundle ${bundleName}: found matches for`, Object.keys(matches).join(', '));
      }
    } catch(e) {
      console.log('Error fetching bundle:', e.message);
    }
  }

  // 15. Get ALL inline script content that contains RSC data about the page
  const rscData = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script:not([src])');
    const data = [];
    scripts.forEach(s => {
      const text = s.textContent;
      if (text.includes('section') || text.includes('canvas') || text.includes('vertical') || text.includes('scroll')) {
        data.push(text.substring(0, 2000));
      }
    });
    return data;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'rsc-data.json'), JSON.stringify(rscData, null, 2));
  console.log('RSC data scripts found:', rscData.length);

  // ========== MOBILE - deeper analysis ==========
  console.log('\n=== MOBILE DEEP DIVE (375x812) ===');
  const mobileCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('https://cathydolle.com', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(5000);

  // Check what's visible on mobile
  const mobileStructure = await mobilePage.evaluate(() => {
    const vl = document.getElementById('vertical-layout');
    const sc = document.getElementById('scrollContainer');
    const listSpan = document.getElementById('list');
    const sliderSpan = document.getElementById('slider');

    // Check for mobile-specific elements
    const mobileUl = document.querySelector('#vertical-layout ul.max-md\\:hidden');
    const allUls = document.querySelectorAll('#vertical-layout ul');

    return {
      verticalLayout: vl ? {
        display: window.getComputedStyle(vl).display,
        opacity: window.getComputedStyle(vl).opacity,
        pointerEvents: window.getComputedStyle(vl).pointerEvents,
        height: window.getComputedStyle(vl).height,
        rect: {
          x: Math.round(vl.getBoundingClientRect().x),
          y: Math.round(vl.getBoundingClientRect().y),
          w: Math.round(vl.getBoundingClientRect().width),
          h: Math.round(vl.getBoundingClientRect().height)
        }
      } : null,
      scrollContainer: sc ? {
        height: sc.getBoundingClientRect().height,
        display: window.getComputedStyle(sc).display
      } : null,
      listToggleVisible: listSpan ? window.getComputedStyle(listSpan.parentElement).display !== 'none' : false,
      ulCount: allUls.length,
      allUlInfo: Array.from(allUls).map(ul => ({
        className: ul.className.substring(0, 200),
        display: window.getComputedStyle(ul).display,
        visibility: window.getComputedStyle(ul).visibility,
        childCount: ul.children.length,
        rect: {
          w: Math.round(ul.getBoundingClientRect().width),
          h: Math.round(ul.getBoundingClientRect().height)
        }
      })),
      bodyHTML: document.querySelector('#vertical-layout')?.innerHTML.substring(0, 3000)
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'mobile-structure.json'), JSON.stringify(mobileStructure, null, 2));
  console.log('Mobile structure:', JSON.stringify(mobileStructure, null, 2));

  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, '11-mobile-full.png'), fullPage: true });
  console.log('Mobile full screenshot saved');

  await mobileCtx.close();
  await ctx.close();
  await browser.close();
  console.log('\n=== DEEP DIVE COMPLETE ===');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
