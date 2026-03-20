import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio/cathydolle-analysis';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await ctx.newPage();

  // Intercept all JS requests
  const jsResponses = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('_next/static/chunks/') && !url.includes('polyfills') && !url.includes('webpack')) {
      jsResponses.push({ url, status: response.status() });
    }
  });

  await page.goto('https://cathydolle.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);

  console.log('JS chunks loaded:', jsResponses.length);

  // Fetch app-specific bundles (the ones with "app" in the path)
  const appBundles = jsResponses.filter(r =>
    r.url.includes('/app/') || r.url.includes('layout') ||
    r.url.includes('1904') || r.url.includes('5239') ||
    r.url.includes('3276') || r.url.includes('3567') ||
    r.url.includes('4544') || r.url.includes('b536') ||
    r.url.includes('732')
  );

  console.log('App-specific bundles:', appBundles.map(b => b.url.split('/').pop().split('?')[0]));

  // Fetch ALL non-framework bundles and search for relevant code
  const keywords = [
    'scrollContainer', 'vertical-layout', 'verticalLayout',
    'Three', 'three', 'canvas', 'WebGLRenderer', 'Scene', 'Camera',
    'mouseenter', 'mouseleave', 'onMouseEnter', 'onMouseLeave',
    'pixelCrosshair', 'pixelText', 'activeProject', 'activeIndex',
    'hoverProject', 'hoveredIndex', 'currentProject',
    'slider', 'list', 'viewMode', 'setViewMode', 'setView',
    'gsap', 'GSAP', 'timeline', 'ScrollTrigger',
    'data-slug', 'data-id', 'project-',
    'useTexture', 'loadTexture', 'TextureLoader',
    'PlaneGeometry', 'ShaderMaterial', 'MeshBasicMaterial',
    'sanity', 'cdn.sanity',
    'blur(', 'opacity', 'translate3d',
    'animateToProject', 'transitionToSlider', 'switchView'
  ];

  for (const resp of jsResponses) {
    const bundleName = resp.url.split('/').pop().split('?')[0];
    try {
      const text = await page.evaluate(async (url) => {
        const r = await fetch(url);
        return await r.text();
      }, resp.url);

      const matches = {};
      for (const kw of keywords) {
        const indices = [];
        let startIdx = 0;
        while (true) {
          const idx = text.indexOf(kw, startIdx);
          if (idx === -1) break;
          indices.push(idx);
          startIdx = idx + kw.length;
          if (indices.length >= 5) break; // max 5 occurrences
        }

        if (indices.length > 0) {
          matches[kw] = {
            count: indices.length,
            contexts: indices.slice(0, 3).map(idx =>
              text.substring(Math.max(0, idx - 150), Math.min(text.length, idx + 250))
            )
          };
        }
      }

      if (Object.keys(matches).length > 3) {
        fs.writeFileSync(
          path.join(OUTPUT_DIR, `bundle-deep-${bundleName}.json`),
          JSON.stringify(matches, null, 2)
        );
        console.log(`\n=== ${bundleName} === (${Object.keys(matches).length} keyword matches)`);
        for (const [kw, data] of Object.entries(matches)) {
          console.log(`  ${kw}: ${data.count} occurrences`);
        }
      }
    } catch (e) {
      console.log(`Error fetching ${bundleName}:`, e.message);
    }
  }

  // Also examine what happens during hover more carefully using Three.js inspection
  console.log('\n=== EXAMINING THREE.JS SCENE ===');
  const threeInfo = await page.evaluate(() => {
    // Check for Three.js
    const canvas = document.querySelector('#scrollContainer canvas');
    if (!canvas) return { error: 'no canvas found' };

    const result = {
      canvasDataEngine: canvas.getAttribute('data-engine'),
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      canvasClassName: canvas.className,
    };

    // Check if Three.js is on window
    if (window.THREE) {
      result.threeVersion = window.THREE.REVISION;
    }

    // Check the canvas context type
    try {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        result.contextType = 'webgl';
        result.renderer = gl.getParameter(gl.RENDERER);
        result.vendor = gl.getParameter(gl.VENDOR);
      }
    } catch(e) {
      result.contextError = e.message;
    }

    return result;
  });

  console.log('Three.js info:', JSON.stringify(threeInfo, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'threejs-info.json'), JSON.stringify(threeInfo, null, 2));

  // Try to hover and check what changes in the Three.js scene
  console.log('\n=== HOVER INTERACTION DEEP ANALYSIS ===');

  // Hover over first item and capture state changes
  const firstItem = await page.$('#ard');
  if (firstItem) {
    console.log('Hovering over #ard...');

    // Get state before hover
    const beforeHover = await page.evaluate(() => {
      const li = document.getElementById('ard');
      const allLis = document.querySelectorAll('#vertical-layout ul li');
      return {
        hoveredItem: {
          opacity: window.getComputedStyle(li).opacity,
          filter: window.getComputedStyle(li).filter,
          transform: window.getComputedStyle(li).transform
        },
        allItemOpacities: Array.from(allLis).map(l => ({
          id: l.id,
          opacity: parseFloat(window.getComputedStyle(l).opacity).toFixed(4),
          filter: window.getComputedStyle(l).filter
        }))
      };
    });

    await firstItem.hover();
    await page.waitForTimeout(1000);

    const afterHover = await page.evaluate(() => {
      const li = document.getElementById('ard');
      const allLis = document.querySelectorAll('#vertical-layout ul li');
      return {
        hoveredItem: {
          opacity: window.getComputedStyle(li).opacity,
          filter: window.getComputedStyle(li).filter,
          transform: window.getComputedStyle(li).transform
        },
        allItemOpacities: Array.from(allLis).map(l => ({
          id: l.id,
          opacity: parseFloat(window.getComputedStyle(l).opacity).toFixed(4),
          filter: window.getComputedStyle(l).filter
        })),
        pixelCrosshairOpacity: window.getComputedStyle(document.getElementById('pixelCrosshair')).opacity,
        pixelText: document.getElementById('pixelText')?.textContent.trim()
      };
    });

    await page.screenshot({ path: path.join(OUTPUT_DIR, '12-hover-ard.png'), fullPage: false });

    fs.writeFileSync(path.join(OUTPUT_DIR, 'hover-state-comparison.json'), JSON.stringify({
      before: beforeHover,
      after: afterHover
    }, null, 2));

    console.log('Before hover #ard opacity:', beforeHover.hoveredItem.opacity);
    console.log('After hover #ard opacity:', afterHover.hoveredItem.opacity);
    console.log('After hover pixelCrosshair opacity:', afterHover.pixelCrosshairOpacity);
    console.log('Pixel text:', afterHover.pixelText);
  }

  // Hover the 3rd item to see if the canvas/image changes
  const thirdItem = await page.$('#jean-khamkwan');
  if (thirdItem) {
    console.log('\nHovering over #jean-khamkwan...');
    await thirdItem.hover();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '13-hover-jean.png'), fullPage: false });

    const afterHover3 = await page.evaluate(() => {
      const allLis = document.querySelectorAll('#vertical-layout ul li');
      return {
        allItemOpacities: Array.from(allLis).map(l => ({
          id: l.id,
          opacity: parseFloat(window.getComputedStyle(l).opacity).toFixed(4),
          filter: window.getComputedStyle(l).filter
        }))
      };
    });
    fs.writeFileSync(path.join(OUTPUT_DIR, 'hover-state-jean.json'), JSON.stringify(afterHover3, null, 2));
  }

  // Move to no-man's land (off list items)
  await page.mouse.move(720, 20);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '14-no-hover.png'), fullPage: false });

  // Check mobile view - what replaces the list?
  console.log('\n=== MOBILE VIEW ANALYSIS ===');
  const mobileCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true, hasTouch: true
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('https://cathydolle.com', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(5000);

  const mobileFullStructure = await mobilePage.evaluate(() => {
    const vl = document.getElementById('vertical-layout');
    if (!vl) return 'vertical-layout not found';

    // The UL is hidden on mobile (max-md:hidden), so what else is in vertical-layout?
    const children = Array.from(vl.children);
    return children.map(c => {
      const style = window.getComputedStyle(c);
      return {
        tag: c.tagName,
        className: c.className.substring(0, 300),
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        position: style.position,
        width: style.width,
        height: style.height,
        rect: {
          x: Math.round(c.getBoundingClientRect().x),
          y: Math.round(c.getBoundingClientRect().y),
          w: Math.round(c.getBoundingClientRect().width),
          h: Math.round(c.getBoundingClientRect().height)
        },
        childCount: c.children.length,
        innerHTML: c.innerHTML.substring(0, 500)
      };
    });
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'mobile-vertical-layout-children.json'), JSON.stringify(mobileFullStructure, null, 2));
  console.log('Mobile vertical-layout children:', JSON.stringify(mobileFullStructure, null, 2));

  // Check what's visible on mobile - is there a scrollable image gallery?
  const mobileVisibleContent = await mobilePage.evaluate(() => {
    const sc = document.getElementById('scrollContainer');
    const canvas = sc?.querySelector('canvas');
    return {
      scrollContainer: {
        display: sc ? window.getComputedStyle(sc).display : 'not found',
        height: sc ? window.getComputedStyle(sc).height : null,
        scrollHeight: sc?.scrollHeight,
        rect: sc ? {
          w: Math.round(sc.getBoundingClientRect().width),
          h: Math.round(sc.getBoundingClientRect().height)
        } : null
      },
      canvas: canvas ? {
        width: canvas.width,
        height: canvas.height,
        display: window.getComputedStyle(canvas).display,
        rect: {
          w: Math.round(canvas.getBoundingClientRect().width),
          h: Math.round(canvas.getBoundingClientRect().height)
        }
      } : null,
      bodyScrollHeight: document.body.scrollHeight,
      windowHeight: window.innerHeight,
      isScrollable: document.body.scrollHeight > window.innerHeight
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'mobile-visible-content.json'), JSON.stringify(mobileVisibleContent, null, 2));
  console.log('Mobile visible content:', JSON.stringify(mobileVisibleContent, null, 2));

  // Take mobile screenshot scrolled down
  await mobilePage.evaluate(() => window.scrollTo(0, 400));
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, '15-mobile-scrolled.png'), fullPage: false });

  await mobileCtx.close();
  await ctx.close();
  await browser.close();
  console.log('\n=== BUNDLE ANALYSIS COMPLETE ===');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
