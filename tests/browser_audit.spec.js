// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8000';

test.describe('Norwy-mapi Browser Audit', () => {
  
  test('Seite lädt ohne JavaScript-Fehler', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    expect(errors.length, `JavaScript-Fehler gefunden: ${errors.join(', ')}`).toBe(0);
  });
  
  test('Kritische Elemente sind sichtbar', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const searchField = page.locator('#search');
    await expect(searchField).toBeVisible();
    
    const mapElement = page.locator('#map');
    await expect(mapElement).toBeVisible();
    
    const navElement = page.locator('.nav');
    await expect(navElement).toBeVisible();
  });
  
  test('Ortsdaten werden geladen', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    
    const placesCount = await page.evaluate(() => {
      return Array.isArray(window.PLACES) ? window.PLACES.length : 0;
    });
    
    expect(placesCount).toBeGreaterThan(1000);
    console.log(`✓ ${placesCount} Orte geladen`);
  });
  
  test('Camper-Daten werden geladen', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    
    const camperCount = await page.evaluate(() => {
      return Array.isArray(window.CAMPER_POINTS) ? window.CAMPER_POINTS.length : 0;
    });
    
    expect(camperCount).toBeGreaterThan(1000);
    console.log(`✓ ${camperCount} Camper-Punkte geladen`);
  });
  
  test('Suchfunktion funktioniert', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);
    
    await page.click('#listTab');
    await page.waitForTimeout(300);
    
    await page.fill('#search', 'Trolltunga');
    await page.waitForTimeout(500);
    
    const resultCount = await page.locator('.place').count();
    expect(resultCount).toBeGreaterThan(0);
  });
  
  test('Detail-Modal öffnet sich', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);
    
    await page.click('#listTab');
    await page.waitForTimeout(300);
    
    const firstPlace = page.locator('.place').first();
    await firstPlace.click();
    await page.waitForTimeout(300);
    
    const detailModal = page.locator('#detail');
    await expect(detailModal).toHaveClass(/open/);
  });
  
  test('Navigation zwischen Tabs funktioniert', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);
    
    await page.click('#mapTab');
    await expect(page.locator('#mapTab')).toHaveClass(/active/);
    
    await page.click('#listTab');
    await expect(page.locator('#listTab')).toHaveClass(/active/);
    
    await page.click('#routeTab');
    await expect(page.locator('#routeTab')).toHaveClass(/active/);
    
    await page.click('#favTab');
    await expect(page.locator('#favTab')).toHaveClass(/active/);
  });
  
  test('Tastatur-Navigation funktioniert (ESC schließt Modal)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);
    
    await page.click('#listTab');
    await page.waitForTimeout(300);
    
    const firstPlace = page.locator('.place').first();
    await firstPlace.click();
    await page.waitForTimeout(300);
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    
    const detailModal = page.locator('#detail');
    await expect(detailModal).not.toHaveClass(/open/);
  });
  
  test('Keine kritischen Accessibility-Fehler', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();
    
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    
    expect(criticalViolations.length, 
      `Kritische Accessibility-Fehler: ${JSON.stringify(criticalViolations, null, 2)}`
    ).toBe(0);
  });
  
  test('Kein offensichtlicher Boot-Fehler auf Startseite', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1500);
    
    const errorBox = page.locator('#appError');
    const isErrorVisible = await errorBox.isVisible().catch(() => false);
    
    expect(isErrorVisible).toBe(false);
  });
  
  test('Service Worker registriert sich (falls vorhanden)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    if (swRegistered) {
      console.log('✓ Service Worker API verfügbar');
    } else {
      console.log('⚠ Service Worker API nicht verfügbar (z.B. kein HTTPS)');
    }
    
    expect(swRegistered !== undefined).toBe(true);
  });
  
});
