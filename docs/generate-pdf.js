const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const htmlPath = path.resolve('/Users/stanleyyou/WorkBuddy/20260422103457/lifescript/docs/产品说明文档.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: '/Users/stanleyyou/WorkBuddy/20260422103457/lifescript/docs/人生剧本_产品说明文档.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  
  await browser.close();
  console.log('PDF generated successfully!');
})();
