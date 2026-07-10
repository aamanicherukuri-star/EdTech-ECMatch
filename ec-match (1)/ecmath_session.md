# AI Coding Agent Session – ECMatch Web Scraper Module

## Context

While building ECMatch (an early-stage web platform), I used Claude (web) and Gemini to help design and iterate a web scraper module to collect structured data from online sources.

---

## Step 1: Initial Build

I prompted AI to generate a basic Python scraper to extract structured data from web pages.

**AI-generated components:**

* Python `requests` setup
* BeautifulSoup parsing logic
* Basic HTML traversal for target elements

---

## Step 2: Blocking / Request Failures

The scraper initially failed on some pages due to request blocking.

**Fix request to AI:**
“Add headers and user-agent to prevent request blocking”

**Result:**

* Added headers
* Improved request reliability
* Increased success rate of requests

---

## Step 3: Incorrect Data Extraction

The scraper was not correctly identifying the required fields.

**Fix request:**
“Adjust selectors to correctly extract structured fields from page layout”

**Result:**

* Updated CSS selectors
* Fixed parsing logic
* Improved accuracy of extracted data

---

## Step 4: Iteration and Refinement

I iterated with AI to improve robustness across multiple pages.

**Improvements:**

* Handled inconsistent HTML structures
* Improved output formatting
* Structured output into JSON-ready format

---

## Outcome

A functioning scraper module integrated into ECMatch that extracts structured web data. The build process was heavily assisted by AI coding agents (Claude + Gemini), with iterative prompt–debug–refine cycles. This allowed ECMatch to feature a scraper for Extracurriculars to then be added to the database

Future progress to this includes: 
   Better structure to search additional
