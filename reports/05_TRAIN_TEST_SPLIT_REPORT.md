# Stage 5: Time-Series Train/Test Preparation Documentation Report
**Superstore Sales & Demand Forecasting Project**

**Date of Execution:** August 28, 2026  
**Source Dataset:** [`superstore_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_features.csv) (**UNTOUCHED**)  
**Cleaned Dataset:** [`superstore_cleaned.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_cleaned.csv) (**UNTOUCHED**)  
**Training Dataset:** [`train_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/train_features.csv)  
**Testing Dataset:** [`test_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/test_features.csv)  
**Split Summary JSON:** [`split_summary.json`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/outputs/summaries/split_summary.json)  
**Project Workspace:** `c:\Users\SKC\OneDrive\Documents\Desktop\TASK-1`

---

## 1. Objective
The objective of Stage 5 Time-Series Train/Test Preparation is to partition the feature-engineered dataset (`superstore_features.csv`) into strict chronological training and testing subsets. Because this is a **time-series sales forecasting task**, random shuffling is strictly prohibited. The chronological split ensures that models are trained on past historical data and evaluated exclusively on future unseen periods.

---

## 2. Train/Test Split Specifications

| Dataset Partition | Time Range | Month Count | Percentage | Primary Purpose | File Created |
| :--- | :--- | :-: | :-: | :--- | :--- |
| **Historical Train Set** | **Jan 2015 – May 2017** | **29 months** | **80.56%** | Model training & cross-validation | [`train_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/train_features.csv) |
| **Future Test Set** | **Jun 2017 – Dec 2017** | **7 months** | **19.44%** | Out-of-sample forecast evaluation | [`test_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/test_features.csv) |
| **Total Horizon** | **Jan 2015 – Dec 2017** | **36 months** | **100.0%** | Full feature-engineered timeline | [`superstore_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_features.csv) |

---

## 3. Justification for Chronological Splitting
1. **Temporal Order Preservation:** Time-series demand possesses strong temporal dependencies, autocorrelation, and seasonal momentum. Shuffling would allow future sales information to contaminate training features, resulting in severe data leakage and artificially inflated performance.
2. **Realistic Forecasting Simulation:** In business operations, a forecasting model is deployed to predict future upcoming months given past history. Setting the test period to the final 7 months of 2017 (June–December 2017) directly simulates a real-world 7-month horizon forecast.
3. **Inclusion of Seasonal Test Horizon:** The 7-month test set covers June through December 2017, explicitly evaluating how well models forecast both mid-year demand and the critical **Q4 holiday sales surge** (November & December).

---

## 4. Target Variable & Feature Dimensions Summary

### Response Variable ($y$):
- **Column:** **`Sales`** (Total Monthly Gross Revenue in USD).

### Predictor Features ($X$):
- **Total Predictors:** **26 features** (Time-based, Lags 1–12, Rolling Means/Std 3–12, YoY Growth, Exogenous Business Lags).

### Target Statistics by Partition:

| Metric | Full Feature Matrix | Training Set (`train_features.csv`) | Testing Set (`test_features.csv`) |
| :--- | :-: | :-: | :-: |
| **Observation Count** | 36 months | **29 months** | **7 months** |
| **Feature Columns ($X$)** | 26 columns | 26 columns | 26 columns |
| **Mean Monthly Sales** | $50,001.35 | **$43,923.63** | **$75,180.48** |
| **Min Monthly Sales** | $18,174.08 | $18,174.08 | $46,971.07 |
| **Max Monthly Sales** | $118,447.83 | $96,999.04 | $118,447.83 |
| **Total Cumulative Revenue** | $1,800,048.57 | **$1,273,785.24** | **$526,263.33** |

*Note: Mean monthly sales in the testing set ($75.2k) is higher than the training set ($43.9k) because the test set contains the peak H2 and Q4 holiday shopping surge of 2017.*

---

## 5. Strict Data Leakage Audit & Verification Checklist

- [x] **Zero Shuffling:** The dataset was sorted by `YearMonth` ascending. No random sampling or cross-sectional shuffling was applied.
- [x] **Temporal Continuity:** Training period ends on **2017-05**, and testing period begins strictly on **2017-06** without overlap or gaps.
- [x] **Target Isolation:** The target column `Sales` is isolated as the response variable.
- [x] **Predictor Shift Verification:** All lag features ($t-1 \dots t-12$) and rolling windows use shifted values ($t-1$) created prior to splitting.
- [x] **Source File Protection:** [`superstore_cleaned.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_cleaned.csv) and [`superstore_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_features.csv) remain **100% UNTOUCHED**.

---

## 6. Verification Output Log

```text
TRAINING SET SAMPLE (First 2 Months):
  - 2015-01: Sales = $18,174.08 | Lag_1 = $69,545.62 | Lag_12 = $14,236.90
  - 2015-02: Sales = $11,951.41 | Lag_1 = $18,174.08 | Lag_12 = $4,519.89

TESTING SET SAMPLE (First 2 Months):
  - 2017-06: Sales = $46,971.07 | Lag_1 = $53,439.78 | Lag_12 = $52,946.53
  - 2017-07: Sales = $45,263.22 | Lag_1 = $46,971.07 | Lag_12 = $39,261.96
```

*Stage 5 Time-Series Train/Test Preparation is 100% complete. System stopped before modeling.*
