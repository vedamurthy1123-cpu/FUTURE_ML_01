# Superstore Sales Dataset: Data Understanding & Data-Quality Analysis Report

**Date of Analysis:** August 28, 2026  
**Status:** Completed (No changes made to original CSV dataset)  
**Project Workspace:** `c:\Users\SKC\OneDrive\Documents\Desktop\TASK-1`

---

## Executive Summary

This report presents a thorough, non-destructive data understanding and data-quality evaluation of the Superstore Sales dataset added to the project. The analysis covers file identity, dimensions, column specifications, data completeness, value distributions, temporal coverage, data quality issues/anomalies, target column selection for time-series sales forecasting, and a plain-English explanation of the dataset structure.

---

## 1. Dataset Identification & File Details

- **CSV Filename:** `Sample - Superstore.csv`
- **Relative Workspace Path:** `Sample - Superstore.csv/Sample - Superstore.csv`
- **Absolute File Path:** `c:\Users\SKC\OneDrive\Documents\Desktop\TASK-1\Sample - Superstore.csv\Sample - Superstore.csv`
- **File Size:** `2,287,806 bytes (~2.29 MB)`
- **File Encoding:** `Windows-1252 (ANSI)` / `ISO-8859-1`
- **Dataset Modification Status:** **UNTOUCHED** (0 bytes altered).

---

## 2. Dataset Dimensions & Volume

| Metric | Count |
| :--- | :--- |
| **Total Rows (Observations)** | **9,994** |
| **Total Columns (Features)** | **21** |
| **Total Cells** | **209,874** |

---

## 3. Simple Plain-English Explanation of Dataset Structure

The Superstore sales dataset contains transactional line-item records from a nationwide United States retail superstore selling **Office Supplies**, **Furniture**, and **Technology products** to businesses and individual consumers over a 4-year period (January 2014 through December 2017).

Every row in the table represents an **individual product line item within a customer order**. For instance, if a customer buys a chair and a box of paper in one order, that order will be recorded across two separate rows sharing the same `Order ID`.

Each row captures four main categories of business information:
1. **Order Details:** Order ID, Order Date, Ship Date, and Shipping Mode (`Standard Class`, `First Class`, etc.).
2. **Customer Information:** Customer ID, Customer Name, and Customer Segment (`Consumer`, `Corporate`, `Home Office`).
3. **Geographic Location:** City, State, Country (`United States`), Postal Code, and Sales Region (`West`, `East`, `Central`, `South`).
4. **Product & Financial Performance:** Product ID, Category, Sub-Category, Product Name, Sales Amount ($), Order Quantity, Discount Rate (0% to 80%), and Net Profit/Loss ($).

---

## 4. Column Schema & Data Types

Below is the complete dictionary of all 21 columns, comparing the raw stored data type in Pandas against the recommended target logical data type for analytical/modeling pipelines:

| # | Column Name | Stored Data Type | Recommended Logical Type | Description |
| :-: | :--- | :--- | :--- | :--- |
| **1** | `Row ID` | `int64` | Identifier / Index | Sequential integer row index (1 to 9,994) |
| **2** | `Order ID` | `object` (str) | Categorical / String | Unique order tracking number (e.g. `CA-2016-152156`) |
| **3** | `Order Date` | `object` (str) | Datetime (`YYYY-MM-DD`) | Date the customer placed the order |
| **4** | `Ship Date` | `object` (str) | Datetime (`YYYY-MM-DD`) | Date the order was dispatched |
| **5** | `Ship Mode` | `object` (str) | Nominal Categorical | Shipping method class (4 unique modes) |
| **6** | `Customer ID` | `object` (str) | Categorical / ID | Unique customer identifier (e.g. `CG-12520`) |
| **7** | `Customer Name` | `object` (str) | String | Full name of customer |
| **8** | `Segment` | `object` (str) | Nominal Categorical | Customer market segment (3 categories) |
| **9** | `Country` | `object` (str) | Categorical (Constant) | Country name (100% "United States") |
| **10** | `City` | `object` (str) | Categorical | City name (531 unique cities) |
| **11** | `State` | `object` (str) | Categorical | US State (49 unique states + DC) |
| **12** | `Postal Code` | `int64` | String (Zero-Padded ZIP) | 5-digit US Postal Code |
| **13** | `Region` | `object` (str) | Nominal Categorical | Geographic region (4 regions) |
| **14** | `Product ID` | `object` (str) | Categorical / ID | Unique product SKU code (1,862 unique SKUs) |
| **15** | `Category` | `object` (str) | Nominal Categorical | Main product category (3 categories) |
| **16** | `Sub-Category` | `object` (str) | Nominal Categorical | Product sub-category (17 categories) |
| **17** | `Product Name` | `object` (str) | String | Full item description (1,850 unique names) |
| **18** | `Sales` | `float64` | Continuous Numerical ($) | Gross sales revenue for line item |
| **19** | `Quantity` | `int64` | Discrete Numerical | Number of units purchased (1 to 14) |
| **20** | `Discount` | `float64` | Continuous Ratio (0.0–0.8) | Discount rate applied (0% to 80%) |
| **21** | `Profit` | `float64` | Continuous Numerical ($) | Net financial profit or loss for line item |

---

## 5. Missing Values & Data Integrity Audit

- **Missing Values Count:** **`0` missing values across all 21 columns** (100% complete dataset).
- **Exact Duplicate Rows:** **`0` full-row duplicates** (all 9,994 rows contain distinct combinations of fields).
- **Row ID Uniqueness:** `Row ID` is 100% unique across all 9,994 records.
- **Sub-Key Duplication Audit:**
  - `(Order ID, Product ID)` pairs have **8 duplicates**, representing transactions where the exact same product SKU was listed on separate line items within the same order.

---

## 6. Categorical Columns Summary & Distribution Analysis

### Key Categorical Columns & Unique Value Counts

1. **`Country`** (1 unique value)
   - Value: `United States` (9,994 rows - 100%).
2. **`Ship Mode`** (4 unique values)
   - `Standard Class`: 5,968 rows (59.72%)
   - `Second Class`: 1,945 rows (19.46%)
   - `First Class`: 1,538 rows (15.39%)
   - `Same Day`: 543 rows (5.43%)
3. **`Segment`** (3 unique values)
   - `Consumer`: 5,191 rows (51.94%)
   - `Corporate`: 3,020 rows (30.22%)
   - `Home Office`: 1,783 rows (17.84%)
4. **`Region`** (4 unique values)
   - `West`: 3,203 rows (32.05%)
   - `East`: 2,848 rows (28.50%)
   - `Central`: 2,323 rows (23.24%)
   - `South`: 1,620 rows (16.21%)
5. **`Category`** (3 unique values)
   - `Office Supplies`: 6,026 rows (60.30%) | Total Sales: $719,047.03
   - `Furniture`: 2,121 rows (21.22%) | Total Sales: $741,999.80
   - `Technology`: 1,847 rows (18.48%) | Total Sales: $836,154.03
6. **`Sub-Category`** (17 unique values)
   - Top Sub-Categories by volume: `Binders` (1,523), `Paper` (1,370), `Furnishings` (957), `Phones` (889), `Storage` (846), `Art` (796), `Accessories` (775), `Chairs` (617), `Appliances` (466), `Labels` (364).
7. **`State`** (49 unique states + District of Columbia)
   - Top 5 States: `California` (2,001), `New York` (1,128), `Texas` (985), `Pennsylvania` (587), `Washington` (506).
8. **`City`** (531 unique cities)
   - Top 5 Cities: `New York City` (915), `Los Angeles` (747), `Philadelphia` (537), `San Francisco` (510), `Seattle` (428).
9. **`Customer ID` / `Customer Name`** (793 unique customers)
   - Highest transaction volume customer: `William Brown` (`WB-21850`) with 37 order line items.
10. **`Product ID`** (1,862 unique SKUs) vs **`Product Name`** (1,850 unique names)
    - 12 additional Product IDs relative to Product Names (indicates slight ID mapping overlap or variant re-naming).

---

## 7. Date Columns & Temporal Range Analysis

The dataset contains two date attributes formatted as `MM/DD/YYYY` in the raw file:

| Date Column | Earliest Date | Latest Date | Total Duration | Unique Dates | Invalid Dates |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Order Date`** | **2014-01-03** | **2017-12-30** | 1,458 days (4.0 years) | 1,237 days | 0 |
| **`Ship Date`** | **2014-01-07** | **2018-01-05** | 1,460 days (4.0 years) | 1,334 days | 0 |

### Order-to-Ship Delivery Lead Time Statistics
- **Minimum Lead Time:** `0 days` (Same Day shipping)
- **Maximum Lead Time:** `7 days`
- **Mean Lead Time:** `3.96 days` (~4 days)
- **Median Lead Time:** `4.00 days`
- **Logical Lead Time Consistency Check:** **0 cases** where `Ship Date < Order Date`. 100% of order-ship date pairs are logically consistent.

---

## 8. Numerical Columns Statistical Summary

Below is the summary statistics table for all numerical features in the dataset:

| Numerical Metric | Min | Max | Mean | Median | Std Dev | Zero Count | Negative Count |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **`Sales` ($)** | **$0.444** | **$22,638.48** | **$229.86** | **$54.49** | **$623.25** | 0 | 0 |
| **`Quantity`** | **1** | **14** | **3.79** | **3.00** | **2.23** | 0 | 0 |
| **`Discount`** | **0.00 (0%)** | **0.80 (80%)** | **0.156 (15.6%)** | **0.20 (20%)** | **0.206** | 4,798 (48.0%) | 0 |
| **`Profit` ($)** | **-$6,599.98** | **+$8,399.98** | **+$28.66** | **+$8.67** | **$234.26** | 65 | **1,871 (18.72%)** |

### Aggregate Totals across Dataset
- **Total Gross Sales:** **$2,297,200.86**
- **Total Net Profit:** **$286,397.02**
- **Total Cumulative Discount Given:** **$1,561.00** (Sum of rates across rows)

---

## 9. Data Quality Audit & Potential Anomalies Identified

1. **Postal Code Format Distortion (Leading Zero Stripping):**
   - `Postal Code` is stored as an integer (`int64`). US ZIP codes in eastern states (e.g., Vermont `05401`, Massachusetts `02108`) have leading zeros stripped (stored as `5401` or `2108`).
   - **Remediation Recommendation:** Parse `Postal Code` as a zero-padded 5-digit string (`str.zfill(5)`).
2. **Redundant Constant Feature (`Country`):**
   - `Country` contains only one distinct value (`United States`). It provides zero variance for analytical or machine learning algorithms.
   - **Remediation Recommendation:** Drop `Country` or maintain only as a static meta-field.
3. **High Volume of Loss-Making Line Items (18.72% Negative Profit):**
   - **1,871 transaction items** generate a **net financial loss**, amounting to a total loss of **-$156,131.29**.
   - Analysis shows this is heavily driven by steep discounts:
     - Discounts between **0% and 20%** yield positive average profit (+ $26.50 to + $66.90 per item).
     - Discounts between **20% and 50%** yield an average **loss of -$109.53** per item.
     - Discounts between **50% and 80%** yield an average **loss of -$89.44** per item.
4. **Duplicate Order ID + Product ID Items:**
   - 8 occurrences of duplicate `(Order ID, Product ID)` pairs exist, where a customer purchased the same product multiple times under distinct line items in a single order.
5. **Product ID vs Product Name Cardinality Discrepancy:**
   - 1,862 Product IDs vs 1,850 Product Names (12 Product IDs share identical names with other SKUs or have multiple SKU variants).
6. **Extreme Right-Skewness & Outliers in Sales & Profit:**
   - `Sales` mean is **$229.86** while the median is **$54.49** (Max: **$22,638.48**).
   - High variance requires log-transformation or robust scaling prior to future ML forecasting.

---

## 10. Sales Forecasting Target Column Recommendation

### **Recommended Target Column:** **`Sales`**

#### Rationale & Justification:
1. **Business Alignment:** `Sales` measures gross monetary revenue generated by Superstore, which is the standard primary KPI for retail forecasting.
2. **Data Consistency & Continuity:** `Sales` is strictly positive ($0.444 to $22,638.48), continuous, and contains zero missing or negative values across all 9,994 rows.
3. **Temporal Distribution:** Orders are distributed across 1,237 unique dates spanning 4 full calendar years (2014–2017), allowing for continuous daily, weekly, or monthly time-series aggregation.

#### Suggested Aggregation Granularity for Time-Series Forecasting:
- **Primary Time Series:** Aggregate `Sales` by **`Order Date`** at **Daily**, **Weekly**, or **Monthly** intervals.
- **Secondary Targets (Optional depending on business objective):**
  - **`Quantity`:** If demand volume (inventory units planning) is required.
  - **`Profit`:** If forecasting net profitability rather than top-line revenue is desired.

---

## 11. Summary Table of Key Findings

| Data Property | Finding / Metric |
| :--- | :--- |
| **Filename** | `Sample - Superstore.csv` |
| **Total Rows & Columns** | 9,994 rows × 21 columns |
| **Missing Values** | 0 missing values (100% complete) |
| **Duplicate Rows** | 0 exact duplicate rows |
| **Date Range** | Jan 3, 2014 – Dec 30, 2017 (Order Date) |
| **Total Revenue (Sales)** | $2,297,200.86 |
| **Total Profit** | $286,397.02 |
| **Loss-Making Items** | 1,871 items (18.72%) generating -$156,131.29 loss |
| **Top Sales Category** | Technology ($836,154.03) |
| **Top Region** | West (32.05% of orders) |
| **Recommended Target** | **`Sales`** (aggregated over `Order Date`) |

---

*Report generated automatically for project reference. Original CSV file remains strictly preserved and unmodified.*
