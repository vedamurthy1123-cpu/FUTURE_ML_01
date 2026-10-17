# Superstore Sales Dataset: Data Cleaning Documentation Report

**Date of Cleaning:** August 28, 2026  
**Status:** Successfully Executed & Verified  
**Original Dataset:** `Sample - Superstore.csv` (**UNTOUCHED**)  
**Cleaned Output Dataset:** [`superstore_cleaned.csv`](file:///c:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/superstore_cleaned.csv)  
**Project Workspace:** `c:\Users\SKC\OneDrive\Documents\Desktop\TASK-1`

---

## Executive Summary

The data cleaning pipeline was successfully executed in strict accordance with the cleaning recommendations established in `DATA_UNDERSTANDING_AND_QUALITY_REPORT.md`. A separate, fully cleaned, zero-padded, and sorted dataset `superstore_cleaned.csv` has been generated and validated. 

**Zero rows were deleted**, preserving 100% of legitimate business transactions (9,994 rows), while 1 redundant zero-variance feature (`Country`) was removed, resulting in a final dataset schema of **9,994 rows × 20 columns**.

---

## 1. Cleaning Operations Summary

| # | Operation | Description / Action Taken | Result / Outcome |
| :-: | :--- | :--- | :--- |
| **1** | **Dataset Loading & Shape Verification** | Loaded original `Sample - Superstore.csv`. | Verified starting shape: **9,994 rows × 21 columns**. |
| **2** | **Date Column Conversion** | Parsed `Order Date` and `Ship Date` into datetime (`YYYY-MM-DD`). | Verified `Ship Date >= Order Date` for 100% of records. 0 errors. |
| **3** | **Postal Code Format Correction** | Converted numeric `Postal Code` into zero-padded 5-digit strings (`str.zfill(5)`). | Restored leading zeros for East Coast ZIP codes (e.g., `5401` → `"05401"`). |
| **4** | **Removal of Constant Feature (`Country`)** | Evaluated `Country` column variance. Found 100% `"United States"`. | **Removed `Country` column** (reduces redundant feature bloat). |
| **5** | **Missing Values Verification** | Audited all columns for null/missing values post-transformation. | **0 missing values** verified (100% complete). |
| **6** | **Exact Duplicates Verification** | Audited all 9,994 rows for identical record matches. | **0 exact duplicate rows** verified. |
| **7** | **Inspection of (Order ID, Product ID) Pairs** | Inspected 8 duplicate combinations (16 total rows). | **RETAINED ALL 16 ROWS**. They represent legitimate distinct line items. |
| **8** | **Numerical Validation** | Validated `Sales`, `Quantity`, `Discount`, and `Profit` bounds. | All bounds valid. Retained 1,871 loss-making profit items (-$156k loss). |
| **9** | **Data Type Assignment** | Set explicit Pandas types (`datetime`, `string`, `category`, `float64`, `int64`). | Optimized memory footprint and type safety. |
| **10** | **Dataset Sorting** | Sorted dataset chronologically by `Order Date` in ascending order. | Sorted from **2014-01-03** through **2017-12-30**. |

---

## 2. Dataset Schema Comparison (Before vs. After Cleaning)

| Property | Original Raw Dataset (`Sample - Superstore.csv`) | Cleaned Dataset (`superstore_cleaned.csv`) |
| :--- | :--- | :--- |
| **File Location** | `Sample - Superstore.csv/Sample - Superstore.csv` | `superstore_cleaned.csv` |
| **Row Count** | 9,994 | **9,994** (100% preserved) |
| **Column Count** | 21 | **20** (`Country` removed) |
| **Total Cells** | 209,874 | **199,880** |
| **Date Format** | String (`M/D/YYYY`) | Standard ISO Datetime (`YYYY-MM-DD`) |
| **Postal Code Format** | Integer / Float (`5401`) | 5-Digit Zero-Padded String (`"05401"`) |
| **Sorting** | Arbitrary (`Row ID` order) | Ascending Chronological (`Order Date` order) |
| **Original File Status** | **UNTOUCHED** | Cleaned output saved separately |

---

## 3. Detailed Documentation of Specific Decisions

### Decision A: Removal of `Country` Column
- **Rationale:** `Country` contained only a single unique value (`"United States"`) across all 9,994 records. Because it possesses zero statistical variance, it provides zero predictive power for machine learning models or exploratory data analysis.
- **Action Taken:** Column dropped. Schema reduced from 21 to 20 columns.

### Decision B: Treatment of 8 `(Order ID, Product ID)` Duplicate Pairs (16 Rows)
- **Investigation:** Detailed inspection revealed that these 16 rows represent legitimate customer purchases where the exact same product SKU was entered as multiple line items within a single order (e.g. distinct order line entries with different quantities or pricing adjustments under separate `Row ID`s).
- **Rationale:** Deleting these rows would artificially distort total order revenue and quantity metrics.
- **Action Taken:** **Retained all 16 rows**. No rows were deleted.

### Decision C: Retention of Negative `Profit` Records (1,871 Rows)
- **Investigation:** 1,871 line items (18.72% of dataset) reflect negative profit values ranging from -$0.02 to -$6,599.98, totaling -$156,131.29 in net business loss.
- **Rationale:** Negative profit is not a data corruption artifact or invalid entry; it represents real business loss driven primarily by heavy promotional discounting (> 20%).
- **Action Taken:** **Retained all 1871 negative profit records**.

---

## 4. Final Column Schema & Data Types

| # | Column Name | Raw Type | Cleaned Type | Example Value |
| :-: | :--- | :--- | :--- | :--- |
| **1** | `Row ID` | `int64` | `int64` | `7980` |
| **2** | `Order ID` | `object` | `string` | `"CA-2014-103800"` |
| **3** | `Order Date` | `object` | `datetime64[ns]` | `2014-01-03` |
| **4** | `Ship Date` | `object` | `datetime64[ns]` | `2014-01-07` |
| **5** | `Ship Mode` | `object` | `category` | `"Standard Class"` |
| **6** | `Customer ID` | `object` | `string` | `"DP-13000"` |
| **7** | `Customer Name` | `object` | `string` | `"Darren Powers"` |
| **8** | `Segment` | `object` | `category` | `"Consumer"` |
| **9** | `City` | `object` | `string` | `"Houston"` |
| **10** | `State` | `object` | `category` | `"Texas"` |
| **11** | `Postal Code` | `int64` | `string` | `"77095"` |
| **12** | `Region` | `object` | `category` | `"Central"` |
| **13** | `Product ID` | `object` | `string` | `"OFF-PA-10000174"` |
| **14** | `Category` | `object` | `category` | `"Office Supplies"` |
| **15** | `Sub-Category` | `object` | `category` | `"Paper"` |
| **16** | `Product Name` | `object` | `string` | `"Message Books, Order Books..."` |
| **17** | `Sales` | `float64` | `float64` | `16.448` |
| **18** | `Quantity` | `int64` | `int64` | `2` |
| **19** | `Discount` | `float64` | `float64` | `0.2` |
| **20** | `Profit` | `float64` | `float64` | `5.5512` |

---

## 5. Verification Checklist

- [x] `superstore_cleaned.csv` successfully created in project workspace.
- [x] Original `Sample - Superstore.csv` remains **100% untouched and unmodified**.
- [x] Final row count matches starting row count (9,994 rows).
- [x] 0 missing values across all 20 columns.
- [x] 0 exact duplicate rows.
- [x] Dates parsed and validated (`Ship Date >= Order Date`).
- [x] Dataset sorted chronologically by `Order Date` (2014-01-03 to 2017-12-30).
- [x] Numerical bounds validated (`Sales > 0`, `Quantity >= 1`, `0.0 <= Discount <= 0.80`, `Profit` preserved).

*Pipeline complete. System ready for Stage 3: Exploratory Data Analysis (EDA).*
