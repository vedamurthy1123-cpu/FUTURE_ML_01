# Stage 4: Feature Engineering Documentation Report
**Superstore Sales & Demand Forecasting Project**

**Date of Execution:** August 28, 2026  
**Source Dataset:** [`superstore_cleaned.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_cleaned.csv) (**UNTOUCHED**)  
**Output Feature Dataset:** [`superstore_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_features.csv)  
**Feature Summary JSON:** [`feature_summary.json`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/outputs/summaries/feature_summary.json)  
**Project Workspace:** `c:\Users\SKC\OneDrive\Documents\Desktop\TASK-1`

---

## 1. Objective
The objective of Stage 4 Feature Engineering is to transform transactional retail line items from `superstore_cleaned.csv` into a structured, leakage-free **monthly time-series feature matrix** (`superstore_features.csv`). The engineered features capture long-term trends, annual Q4 seasonality, short-term demand momentum, moving averages, and historical promotional impacts to maximize predictive accuracy for time-series forecasting models.

---

## 2. Source Dataset & Forecasting Granularity
- **Source File:** `superstore_cleaned.csv` (9,994 line items spanning 2014–2017).
- **Selected Granularity:** **Monthly Level (`YearMonth`)**.
- **Justification for Monthly Granularity:**
  1. **Noise Reduction:** Aggregating daily transactions to monthly sums eliminates non-trading weekend zero-sales days and erratic daily noise.
  2. **Seasonal Pattern Clarity:** EDA demonstrated strong annual Q4 seasonality (September–December revenue surges). Monthly granularity cleanly highlights annual 12-month periodicity.
  3. **Supply Chain Alignment:** Retail demand planning, purchasing, and budgeting operates primarily on monthly cycles.
  4. **Target Variable:** **`Sales`** (Total Monthly Gross Sales Revenue in USD). Total Target Revenue: **$2,297,200.86**.

---

## 3. Engineered Feature Taxonomy

| Category | Feature Name | Description & Calculation Method | Purpose for Forecasting |
| :--- | :--- | :--- | :--- |
| **Target** | `Sales` | Sum of gross sales revenue in month t | **Target Response Variable (Y_t)** |
| **Time-Based** | `Year` | Four-digit calendar year (`2015`, `2016`, `2017`) | Captures multi-year upward trend |
| **Time-Based** | `Month` | Integer month index (`1` to `12`) | Captures monthly calendar position |
| **Time-Based** | `Quarter` | Integer calendar quarter (`1` to `4`) | Captures quarterly business cycles |
| **Time-Based** | `Is_Q4` | Binary flag (`1` if Quarter == 4, else `0`) | Explicitly highlights Q4 holiday peak |
| **Cyclical** | `Month_Sin`, `Month_Cos` | sin(2πm/12) and cos(2πm/12) | Smooth continuous seasonal encoding |
| **Lags** | `Sales_Lag_1` | Target sales shifted by 1 month (Y_{t-1}) | Most recent month's revenue momentum |
| **Lags** | `Sales_Lag_2` | Target sales shifted by 2 months (Y_{t-2}) | Short-term historical baseline |
| **Lags** | `Sales_Lag_3` | Target sales shifted by 3 months (Y_{t-3}) | Quarterly lag baseline |
| **Lags** | `Sales_Lag_6` | Target sales shifted by 6 months (Y_{t-6}) | Half-year lag baseline |
| **Lags** | `Sales_Lag_12` | Target sales shifted by 12 months (Y_{t-12}) | **Annual YoY seasonality predictor** |
| **Rolling** | `Sales_Rolling_Mean_3` | 3-month moving average on Y_{t-1..t-3} | Short-term trend smoothing |
| **Rolling** | `Sales_Rolling_Std_3` | 3-month rolling standard deviation | Short-term volatility indicator |
| **Rolling** | `Sales_Rolling_Mean_6` | 6-month moving average on Y_{t-1..t-6} | Mid-term trend smoothing |
| **Rolling** | `Sales_Rolling_Std_6` | 6-month rolling standard deviation | Mid-term volatility indicator |
| **Rolling** | `Sales_Rolling_Mean_12` | 12-month moving average on Y_{t-1..t-12} | Long-term annual baseline trend |
| **Rolling** | `Sales_Rolling_Std_12` | 12-month rolling standard deviation | Annual demand variance |
| **YoY Growth** | `Sales_YoY_Growth` | (Y_{t-1} - Y_{t-12}) / Y_{t-12} | YoY growth velocity metric |
| **Exogenous** | `Profit_Lag_1` | Total net profit in month t-1 | Prior month profitability predictor |
| **Exogenous** | `Quantity_Lag_1` | Total units sold in month t-1 | Volume demand momentum |
| **Exogenous** | `Discount_Avg_Lag_1` | Average discount rate in month t-1 | Promotional pricing intensity |
| **Exogenous** | `Order_Count_Lag_1` | Unique orders placed in month t-1 | Transaction volume momentum |
| **Exogenous** | `Cat_Furniture_Sales_Lag_1` | Furniture sales in month t-1 | Category-specific demand lag |
| **Exogenous** | `Cat_OfficeSupplies_Sales_Lag_1` | Office Supplies sales in month t-1 | Category-specific demand lag |
| **Exogenous** | `Cat_Technology_Sales_Lag_1` | Technology sales in month t-1 | Category-specific demand lag |

---

## 4. Missing-Value Treatment (Warmup Period Handling)
- **Problem:** Creating 12-month lag features (`Sales_Lag_12`) and 12-month rolling statistics (`Sales_Rolling_Mean_12`) naturally produces missing (`NaN`) values for the first 12 months of the dataset (calendar year 2014).
- **Treatment Applied:** We dropped the initial 12 warmup months (2014).
- **Justification:** Zero-filling or mean-imputing historical lags for 2014 would distort the feature matrix and introduce false signals to forecasting models. By trimming the 12-month warmup window, the resulting dataset spans **36 continuous months (Jan 2015 – Dec 2017)** with **100% complete, non-null features**.

---

## 5. Strict Data Leakage Prevention
To guarantee strict temporal validity and prevent data leakage:
1. **Past-Only Windowing:** All lag features use explicit `shift(k)` where k >= 1.
2. **Shifted Rolling Windows:** All rolling statistics (`Rolling_Mean`, `Rolling_Std`) are computed strictly on shifted past sales `Sales.shift(1)` to ensure current sales Y_t is never included in its own input features.
3. **Known-at-Prediction-Time Exogenous Predictors:** All exogenous metrics (`Profit`, `Quantity`, `Discount_Avg`, Category Sales) are lagged by t-1.
4. **Target Isolation:** The target variable `Sales` appears exclusively as the final response column Y_t.

---

## 6. Feature Validation & Statistical Correlations

### Dataset Dimensions & Integrity
- **Final Shape:** **36 rows × 27 columns** (36 monthly records from Jan 2015 to Dec 2017).
- **Missing Values:** **0 nulls** across all 27 columns.
- **Duplicate Rows:** **0 duplicate rows**.

### Top Features Correlated with Target `Sales`:

| Feature Name | Pearson Correlation (r) | Relationship Interpretation |
| :--- | :-: | :--- |
| **`Sales_Lag_12`** | **+0.8469** | Strong annual Q4 seasonality predictor |
| **`Month`** | **+0.7502** | Strong monthly calendar progression |
| **`Quarter`** | **+0.6794** | Strong quarterly business cycle correlation |
| **`Is_Q4`** | **+0.6368** | Binary indicator for Q4 demand surge |
| **`Sales_Rolling_Mean_12`** | **+0.5352** | Long-term annual growth baseline |
| **`Quantity_Lag_1`** | **+0.4575** | Volume demand momentum |

---

## 7. Sample Calculation Verification (Jan 2015 Line Item)

| Feature | Value | Verification Notes |
| :--- | :--- | :--- |
| `YearMonth` | `2015-01` | First evaluation month post-warmup |
| `Target Sales (Y_t)` | **$18,174.08** | Actual target sales in Jan 2015 |
| `Sales_Lag_1 (Y_{t-1})` | **$69,545.62** | Actual sales from Dec 2014 |
| `Sales_Lag_12 (Y_{t-12})` | **$14,236.90** | Actual sales from Jan 2014 |
| `Sales_Rolling_Mean_3` | **$59,875.91** | Mean of (Oct, Nov, Dec 2014) |
| `Is_Q4` | `0` | January is in Quarter 1 |

---

## 8. Summary Checklist & Next Steps
- [x] Target variable `Sales` properly specified.
- [x] Selected monthly time granularity.
- [x] Time, lag, rolling, cyclical, and business features constructed.
- [x] Missing values handled by trimming 12-month warmup sequence.
- [x] Data leakage strictly audited and prevented.
- [x] `superstore_features.csv` successfully created.
- [x] `superstore_cleaned.csv` remains **100% UNTOUCHED**.

*Feature engineering complete. System stopped before modeling.*
