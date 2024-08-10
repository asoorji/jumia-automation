import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
const { getOtpFromEmail } = require('../utils/emailService');
// const { vendor } = require('./utils/vendor');

dotenv.config();
const dataPath = path.resolve(__dirname, 'testData.json');
const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const phoneNumber = process.env.PHONENUMBER;
const password = process.env.PASSWORD;
const searchTerms = jsonData.searchTerms;
const firstSearchTerm = searchTerms[0];

// Card details from environment variables
const cardNumber = process.env.CARD_NUMBER;
const cardExpMonth = process.env.CARD_EXP_MONTH;
const cardExpYear = process.env.CARD_EXP_YEAR;
const cardCvc = process.env.CARD_CVC;

function logMessage(message) {
  const logFilePath = path.resolve(__dirname, 'test-log.txt');
  const logEntry = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(logFilePath, logEntry);
}


if (!phoneNumber) {
  throw new Error('Environment variable PHONENUMBER is not set.');
}
if (!password) {
  throw new Error('Environment variable PASSWORD is not set.');
}

test.describe('ECommerce Checkout and Payment Process', () => {
  test('checkout and payment process', async ({ page }) => {

    // Step 1: Checkout Process
    await test.step('Checkout Process', async () => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Jumia/);

      logMessage('Navigated to Jumia homepage');

      const searchInputField = page.getByPlaceholder('Search products, brands and');
      await searchInputField.click();
      await searchInputField.fill(firstSearchTerm);

      logMessage('Navigated to Jumia homepage');
      const searchButton = page.getByRole('button', { name: 'Search' });
      await searchButton.click();

      let retries = 2;
      while (retries--) {
        try {
          await page.waitForSelector('text=/\\d+ products found/', { timeout: 10000 });
          const message = page.locator('text=/\\d+ products found/');
          await expect(message).toBeVisible();
          logMessage('Search results found');

          break; 
        } catch (error) {
          logMessage('Search results not found, retrying...');
          if (!retries) throw error; 
        }
      }


      const pickFirstItem = page.getByRole('link', { name: new RegExp(firstSearchTerm, 'i') }).first();
      await pickFirstItem.click(); 
      logMessage(`Selected first search result for: ${firstSearchTerm}`);

      const addToCartButton = page.locator('#add-to-cart').getByRole('button', { name: 'Add to cart' });
      await addToCartButton.click();
      logMessage('Clicked Add to Cart button');

      retries = 2;
      while (retries--) {
        try {
          await page.waitForSelector('text="Product added successfully"', { timeout: 30000 });
          const successMessage = page.locator('text="Product added successfully"');
          await expect(successMessage).toBeVisible();         
           logMessage('Product added successfully to the cart');

          break; 
        } catch (error) {
          logMessage('Product not added to cart, retrying...');

          if (!retries) throw error;
        }
      }

      await page.getByRole('link', { name: 'Cart' }).click();
      logMessage('Navigated to Cart');

      const checkoutButton = page.getByRole('link', { name: /Checkout \(₦ \d+(\,\d{3})*(\.\d{2})?\)/ });
      await checkoutButton.waitFor({ state: 'visible' });
      await expect(checkoutButton).toBeVisible();
      await checkoutButton.click();
      logMessage('Clicked Checkout button');

    });

    // Step 2: Payment Process
    await test.step('Payment Process', async () => {
      logMessage('Starting Payment Process');

      await page.waitForSelector('text="Welcome to Jumia"', { timeout: 15000 });
      
    const identifierValue = page.locator('#input_identifierValue')
    await identifierValue.click();

    const phoneInput =   page.locator('#input_identifierValue')
    await phoneInput.fill(phoneNumber);

    const continueButton =  await page.getByRole('button', { name: 'Continue' })
   await continueButton.click();
   logMessage(`Entered phone number: ${phoneNumber}`);


   const passwordInput = page.getByLabel('Password');
   await passwordInput.click();

   const passwordField = page.getByLabel('Password');
   await passwordField.fill(password);

   const loginButton = page.getByRole('button', { name: 'Login' });
   await loginButton.click();
   logMessage('Entered password and clicked Login');

  // Fetch OTP from email
  const otp = await getOtpFromEmail(); // Fetch OTP from your email
  const [otpDigit1, otpDigit2, otpDigit3, otpDigit4] = otp.split('');
  await page.getByLabel('digit 1').fill(otpDigit1);
  await page.getByLabel('digit 2').fill(otpDigit2);
  await page.getByLabel('digit 3').fill(otpDigit3);
  await page.getByLabel('digit 4').fill(otpDigit4);
  logMessage('Entered OTP');

  const skipButton = page.getByRole('button', { name: 'Submit' });
  await skipButton.click();

  const confirmOrderButton = page.getByRole('button', { name: 'Confirm order' });
  await confirmOrderButton.click();
  logMessage('Confirmed the order');

  await page.goto('https://my.jumia.com.ng/interaction/_rIwUR0g-CWyMCEShzmRc/en-ng/browser-check');
  await page.goto('https://pay.jumia.com.ng/checkout/AAEAAADoKpAUYdbLZgdiyDeMcug2hJweQdYv1YowklRfQCaRgOCQT8Jb?');
  await page.goto('https://pay.jumia.com.ng/checkout/payment/add');

  const payWithCardButton = page.getByText('Pay with Mastercard and Visa');
  await payWithCardButton.click();

      const cardNumberInput = page.frameLocator('iframe-message iframe').locator('#cc-number');
      await cardNumberInput.click();
      await cardNumberInput.fill(cardNumber);

      const cardExpiryMonthSelect = page.frameLocator('iframe-message iframe').locator('select[name="cc-exp-month"]');
      await cardExpiryMonthSelect.selectOption(cardExpMonth);

      const cardExpiryYearSelect = page.frameLocator('iframe-message iframe').locator('select[name="cc-exp-year"]');
      await cardExpiryYearSelect.selectOption(cardExpYear);

      const cardCvcInput = page.frameLocator('iframe-message iframe').locator('#cc-csc');
      await cardCvcInput.click();
      await cardCvcInput.fill(cardCvc);

  const payNowButton = page.getByRole('button', { name: 'PAY NOW: ₦' });
  await payNowButton.click();

  const newPaymentMethodLink = page.getByRole('link', { name: 'Select a New Payment Method' });
  await newPaymentMethodLink.click();

  const firstCard = page.locator('.card-header-text').first();
  await firstCard.click();

  await payNowButton.click();

  const copyNumberButton = page.getByRole('button', { name: 'Copy Number' });
  await copyNumberButton.click();
    });
  });
});
