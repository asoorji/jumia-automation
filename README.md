# Playwright E-Commerce Checkout and Payment Process

## Overview

This project contains Playwright tests for automating the checkout and payment process on an e-commerce platform. The tests are designed to validate the end-to-end functionality of the checkout process and ensure a smooth payment experience.

## Project Structure

- `ecommerce.spec.js`: Contains the Playwright tests.
- `testData.json`: Stores test data such as search terms.
- `.env`: Holds environment variables required for the tests (e.g., phone number, password).
- `test-log.txt`: Logs messages from the test runs.

## Prerequisites

Before running the tests, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.x or later)
- [Playwright](https://playwright.dev/) (for test automation)
- [dotenv](https://www.npmjs.com/package/dotenv) (for managing environment variables)
- [fs](https://nodejs.org/api/fs.html) (for file system operations)
- [path](https://nodejs.org/api/path.html) (for file path operations)

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://your-repository-url.git
   cd your-repository-folder
