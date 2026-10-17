# Superstore Sales & Demand Forecasting

Welcome to the **Superstore Sales & Demand Forecasting** machine learning repository. This project builds an end-to-end forecasting pipeline to predict monthly retail revenue in **Indian Rupees (₹ / INR)** (Exchange Rate: 1 USD = ₹83.50 INR), evaluate 6 machine learning models, and generate 2018 future sales forecasts.

---

## 📁 Repository Structure

```text
TASK-1/
├── README.md                              <-- Project Overview & Quickstart Guide
├── data/                                  <-- Datasets (Raw & Processed)
│   ├── raw/                               <-- Original unmodified raw CSV dataset
│   │   └── Sample - Superstore.csv
│   └── processed/                         <-- Cleaned & engineered feature CSVs
│       ├── superstore_cleaned.csv
│       ├── superstore_features.csv
│       ├── train_features.csv
│       ├── test_features.csv
│       ├── X_train.csv, y_train.csv
│       └── X_test.csv, y_test.csv
│
├── src/                                   <-- Sequential Pipeline Python Scripts
│   ├── 01_analyze_dataset.py              <-- Stage 1: Data Understanding & Quality Check
│   ├── 02_run_data_cleaning.py            <-- Stage 2: Preprocessing & Cleaning
│   ├── 03_run_eda.py                      <-- Stage 3: Exploratory Data Analysis & Visualizations
│   ├── 04_run_feature_engineering.py      <-- Stage 4: Monthly Aggregation & Feature Creation
│   ├── 05_run_train_test_split.py         <-- Stage 5: Chronological Train/Test Partitioning
│   ├── 06_run_model_training.py           <-- Stage 6: Benchmarking 6 Regression Models
│   ├── 07_run_final_forecasting.py        <-- Stage 7: Evaluation of Final Selected Model
│   ├── 08_run_future_forecast.py          <-- Stage 8: 2018 Full-Year Future Forecast Generation
│   └── forecast_future_sales.py           <-- Standalone Reusable CLI Inference Script
│
├── models/                                <-- Saved Model Artifacts & Evaluation Charts
│   ├── final_sales_forecasting_model.pkl  <-- Selected Final Extra Trees Model
│   ├── scaler.pkl                         <-- Standard Scaler object
│   ├── final_model_metadata.json          <-- Hyperparameters & Metrics
│   └── *.png                              <-- Residuals & Model Evaluation Charts
│
├── outputs/                               <-- Generated Visualizations, Predictions & Summaries
│   ├── eda_charts/                        <-- 10 High-DPI Exploratory Charts
│   ├── predictions/                       <-- Model Comparison & Forecast CSV Outputs (in ₹ INR)
│   └── summaries/                         <-- Stage JSON Metadata Summaries
│
└── reports/                               <-- Detailed Stage Markdown Documentation
    ├── 01_DATA_UNDERSTANDING_AND_QUALITY_REPORT.md
    ├── 02_DATA_CLEANING_REPORT.md
    ├── 03_EDA_REPORT.md
    ├── 04_FEATURE_ENGINEERING_REPORT.md
    ├── 05_TRAIN_TEST_SPLIT_REPORT.md
    ├── 06_MODEL_TRAINING_REPORT.md
    ├── 07_FINAL_FORECASTING_AND_EVALUATION_REPORT.md
    ├── 08_FUTURE_FORECAST_REPORT.md
    ├── STAGE8_VERIFICATION_REPORT.md
    └── PROJECT_FINAL_SUMMARY.md
```

---

## 🚀 Execution Order (Pipeline Workflow)

To re-run the entire pipeline from scratch, execute the python scripts in order inside the `src/` directory:

```bash
# Stage 1: Data Quality Analysis
python src/01_analyze_dataset.py

# Stage 2: Data Cleaning
python src/02_run_data_cleaning.py

# Stage 3: Exploratory Data Analysis
python src/03_run_eda.py

# Stage 4: Feature Engineering
python src/04_run_feature_engineering.py

# Stage 5: Chronological Train/Test Split
python src/05_run_train_test_split.py

# Stage 6: Model Benchmarking & Training
python src/06_run_model_training.py

# Stage 7: Final Out-of-Sample Forecasting
python src/07_run_final_forecasting.py

# Stage 8: Future Sales Prediction (2018 Full Year)
python src/08_run_future_forecast.py
```

---

## 🏆 Final Model Benchmark Results (in ₹ INR & USD)

The pipeline evaluated 6 machine learning models on an out-of-sample test set (June 2017 – December 2017):

| Rank | Model Name | Test RMSE (₹ INR) | Test MAE (₹ INR) | Test MAPE (%) | Test $R^2$ | Status |
| :-: | :--- | :-: | :-: | :-: | :-: | :--- |
| 🥇 **1** | **Extra Trees Regressor** | **₹15,11,682.33** ($18.1k) | **₹13,31,211.28** ($15.9k) | **21.04%** | **0.3708** | **SELECTED FINAL MODEL** |
| 🥈 **2** | **Ridge Regression** | ₹15,20,981.73 ($18.2k) | ₹11,04,378.52 ($13.2k) | 15.39% | 0.3631 | Top Linear Model |
| 🥉 **3** | **Random Forest Regressor** | ₹17,14,514.42 ($20.5k) | ₹14,52,090.73 ($17.4k) | 22.88% | 0.1906 | Evaluated |
| **4** | **Historical Baseline (Lag 12)** | ₹18,54,681.13 ($22.2k) | ₹16,15,087.08 ($19.3k) | 25.17% | 0.0529 | Seasonal Benchmark Rule |
| **5** | **Gradient Boosting Regressor** | ₹19,89,423.34 ($23.8k) | ₹16,91,421.65 ($20.3k) | 26.65% | -0.0897 | Evaluated |
| **6** | **Linear Regression (OLS)** | ₹21,30,343.62 ($25.5k) | ₹16,99,309.46 ($20.4k) | 26.54% | -0.2496 | Evaluated |

---

## 📅 Full 2018 Forecast Overview (in ₹ INR)

- **Total 2018 Projected Revenue:** **₹5,70,65,382.66** (~**₹5.71 Crore**)
- **Average Monthly Revenue:** **₹47,55,448.56** (~**₹47.55 Lakh**)
- **Peak Sales Month (Dec 2018):** **₹80,22,682.50** (~**₹80.23 Lakh**)

---

## 📄 Stage Reports & Documentation

For detailed analysis, methodologies, and visualizations, refer to the documents in [`reports/`](file:///c:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/reports/):
- [`PROJECT_FINAL_SUMMARY.md`](file:///c:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/reports/PROJECT_FINAL_SUMMARY.md): Executive summary of business impact and recommendations.
- [`STAGE8_VERIFICATION_REPORT.md`](file:///c:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/reports/STAGE8_VERIFICATION_REPORT.md): Audit and verification report ensuring reproducibility.
