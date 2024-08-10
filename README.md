# Playwright E-Commerce Checkout and Payment Process

## Overview

This project contains Playwright tests for automating the checkout and payment process on an e-commerce platform (JUMIA). 
The tests are designed to validate the end-to-end functionality of the checkout process and ensure a smooth payment experience.

THE OTP IS FETCHED DIRECTLY FROM THE EMAIL 
GITHUB ACTION IS USED FOR THE CI/CD 

## Project Structure

- `ecommerce.spec.js`: Contains the Playwright tests.
- `testData.json`: Stores test data such as search terms.
- `.env`: Holds environment variables required for the tests (e.g., phone number, password).
- `test-log.txt`: Logs messages from the test runs.

## Prerequisites

Before running the tests, ensure you have the following installed:

- Node.js (version 16.x or later)
- Playwright (for test automation)
- dotenv (for managing environment variables)
- fs (for file system operations)
- path (for file path operations)

## Setup

### Clone the Repository

```bash
git clone [https://your-repository-url.git](https://github.com/asoorji/jumia-automation.git)
cd [your-repository-folder](https://github.com/asoorji/jumia-automation.git)
```

### Install Dependencies

Ensure you have the required npm packages:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

### Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PHONENUMBER=your_phone_number
PASSWORD=your_password

OTP_EMAIL=your_email_address
OTP_EMAIL_PASSWORD=your_email_password

CARD_NUMBER=
CARD_EXP_MONTH=
CARD_EXP_YEAR=
CARD_CVC=
```

### Prepare Test Data

Ensure `testData.json` is present in the root directory with the required structure:

```json
{
  "searchTerms": ["laptop", "smartphone"]
}
```

## Running the Tests

To run the Playwright tests, execute the following command:

```bash
npx playwright test
```

To run tests with the Playwright UI, use:

```bash
npx playwright test --ui
```

## Logging

The test logs are saved in `test-log.txt` in the root directory. Logs include navigation steps, actions performed, and any errors encountered.

## Test Details

### Checkout and Payment Process

#### Checkout Process
1. Navigate to the homepage.
2. Search for a product using the first search term from `testData.json`.
3. Add the first search result to the cart.
4. Proceed to the cart and click on the Checkout button.

#### Payment Process
1. Log in with the provided phone number and password.
2. Enter the OTP digits.
3. Confirm the order and navigate through payment options.
4. Enter payment details and complete the payment process.

## Troubleshooting

- **Browser Not Found**: If you encounter an error about missing browser executables, ensure you have run `npx playwright install` to download the required browsers.
- **Environment Variables**: Verify that all required environment variables are correctly set in your `.env` file.
- **File Paths**: Check that `testData.json` and other required files are present in the correct locations.
- **Fetching OTP: Ensure the email service script (utils/emailService.js) is correctly implemented and that your email credentials are set up properly.
