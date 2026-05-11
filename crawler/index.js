const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.aquariumlife.pt/?utm_source=chatgpt.com';

const dirs = ['audit', 'screenshots', 'dom-map'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

async function run() {
    console.log('Starting Playwright crawler...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        extraHTTPHeaders: {
            'Accept-Language': 'pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Upgrade-Insecure-Requests': '1'
        }
    });
    
    const page = await context.newPage();
    console.log(`Navigating to ${BASE_URL}`);
    
    try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // Handle cookie consent if any (basic heuristic)
        const cookieBtn = await page.$('text=/Aceitar|Accept/i');
        if (cookieBtn) {
            console.log('Accepting cookies...');
            await cookieBtn.click();
            await page.waitForTimeout(2000);
        }

        console.log('Taking full page screenshot...');
        await page.screenshot({ path: path.join(__dirname, '..', 'screenshots', 'home-desktop.png'), fullPage: true });

        console.log('Extracting CSS/JS inventory...');
        const inventory = await page.evaluate(() => {
            const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
            const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
            const inlineScripts = document.querySelectorAll('script:not([src])').length;
            
            return { cssLinks, scripts, inlineScripts };
        });

        fs.writeFileSync(
            path.join(__dirname, '..', 'audit', 'css_inventory.json'), 
            JSON.stringify({ links: inventory.cssLinks }, null, 2)
        );
        fs.writeFileSync(
            path.join(__dirname, '..', 'audit', 'js_inventory.json'), 
            JSON.stringify({ scripts: inventory.scripts, inlineCount: inventory.inlineScripts }, null, 2)
        );

        console.log('Extracting Component & Layout map...');
        const layoutMap = await page.evaluate(() => {
            const structure = {
                header: !!document.querySelector('header'),
                footer: !!document.querySelector('footer'),
                main: !!document.querySelector('main'),
                classes: {}
            };
            
            // Map frequent classes (component candidates)
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.className && typeof el.className === 'string') {
                    const classes = el.className.split(/\s+/).filter(Boolean);
                    classes.forEach(c => {
                        structure.classes[c] = (structure.classes[c] || 0) + 1;
                    });
                }
            });
            
            return structure;
        });

        // Filter out classes used only once or twice, keep top used classes
        const topClasses = Object.entries(layoutMap.classes)
            .filter(([c, count]) => count > 2)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [c, count]) => ({ ...acc, [c]: count }), {});

        fs.writeFileSync(
            path.join(__dirname, '..', 'dom-map', 'layout.json'), 
            JSON.stringify({
                header: layoutMap.header,
                main: layoutMap.main,
                footer: layoutMap.footer
            }, null, 2)
        );

        fs.writeFileSync(
            path.join(__dirname, '..', 'dom-map', 'components.json'), 
            JSON.stringify({ topClasses }, null, 2)
        );

        console.log('Crawling finished successfully!');

    } catch (e) {
        console.error('Error during crawling:', e);
    } finally {
        await browser.close();
    }
}

run();
