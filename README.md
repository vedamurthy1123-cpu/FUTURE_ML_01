# 📈 Superstore Sales & Demand Forecasting

[![Future Interns ML Task 1](https://img.shields.io/badge/Future_Interns-ML_Task_1-4f8cff?style=for-the-badge)](https://futureinterns.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

An end-to-end Machine Learning Demand Forecasting system built for the **Future Interns Machine Learning Task 1: Sales & Demand Forecasting for Businesses**.

This repository covers the complete data lifecycle: raw transactional preprocessing, time-series feature engineering, benchmarking 6 ML regression architectures, out-of-sample holiday surge evaluation, full 2018 forward sales projections, and an interactive **Next.js Executive Web Dashboard**.

---

## 🌟 Executive Highlights

* **🏆 Top-Performing Architecture:** **Extra Trees Regressor** achieved out-of-sample **Test RMSE of $18,103.98** and **Test R² of 0.3708**, beating the seasonal baseline by **+18.49%**.
* **🎄 Holiday Surge Analysis:** Deep-dive analysis of Q4 demand (37.6% of annual volume, +112.4% surge over baseline, November record of ₹98.90L).
* **🔮 2018 Revenue Projections:** Projected annual sales of **₹5.71 Crore** ($683.4k) across 12 forward months.
* **💻 Executive Web Dashboard:** Fully responsive interactive dashboard built with Next.js & Recharts for non-technical stakeholders.

---

## 📁 Repository Structure

```text
FUTURE_ML_01/
├── dashboard/                             <-- Interactive Next.js 16 Web Dashboard
│   ├── src/
│   │   ├── app/                           <-- Next.js App Router (Layout & Pages)
│   │   ├── components/                    <-- Recharts Components (Holiday Surge, Forecast, KPIs)
│   │   └── lib/                           <-- Data fixtures & formatting utilities
│   └── package.json
│
├── data/                                  <-- Datasets (Raw & Processed)
│   ├── raw/                               <-- Original unmodified raw CSV dataset
│   │   └── Sample - Superstore.csv
│   └── processed/                         <-- Cleaned & engineered feature CSVs
│       ├── superstore_cleaned.csv
│       ├── superstore_features.csv
│       ├── train_features.csv, test_features.csv
│       └── X_train.csv, X_test.csv, y_train.csv, y_test.csv
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
│   └── stage7/                            <-- Diagnostic plots (Residuals, Q4 Holiday highlight)
│
├── outputs/                               <-- Generated Visualizations, Predictions & Summaries
│   ├── eda_charts/                        <-- 10 High-DPI Exploratory Charts
│   ├── predictions/                       <-- Model Comparison & Forecast CSV Outputs
│   └── summaries/                         <-- Stage JSON Metadata Summaries
│
├── reports/                               <-- Comprehensive Markdown Documentation
│   ├── 01_DATA_UNDERSTANDING_AND_QUALITY_REPORT.md
│   ├── 02_DATA_CLEANING_REPORT.md
│   ├── 03_EDA_REPORT.md
│   ├── 04_FEATURE_ENGINEERING_REPORT.md
│   ├── 05_TRAIN_TEST_SPLIT_REPORT.md
│   ├── 06_MODEL_TRAINING_REPORT.md
│   ├── 07_FINAL_FORECASTING_AND_EVALUATION_REPORT.md
│   ├── 08_FUTURE_FORECAST_REPORT.md
│   └── PROJECT_FINAL_SUMMARY.md
│
├── requirements.txt                       <-- Python Dependencies
└── .gitignore
```

---

## 📊 Model Benchmark Results

Evaluated on unseen out-of-sample data (June 2017 – December 2017):

| Rank | Model Name | Test RMSE ($) | Test MAE ($) | Test MAPE (%) | Test R² | Status |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| 🥇 **1** | **Extra Trees Regressor** | **$18,103.98** | **$15,942.65** | **21.04%** | **0.3708** | **SELECTED FINAL MODEL** |
| 🥈 **2** | Ridge Regression | $18,215.35 | $13,226.09 | 15.39% | 0.3631 | Top Linear Model |
| 🥉 **3** | Random Forest Regressor | $20,533.11 | $17,390.43 | 22.88% | 0.1906 | Evaluated |
| **4** | Historical Baseline (Lag 12) | $22,211.75 | $19,342.36 | 25.17% | 0.0529 | Seasonal Benchmark Rule |
| **5** | Gradient Boosting Regressor | $23,825.43 | $20,256.55 | 26.65% | -0.0897 | Evaluated |
| **6** | Linear Regression (OLS) | $25,513.10 | $20,351.01 | 26.54% | -0.2496 | Evaluated |

---

## ⚡ Quickstart Guide

### 1. Run the Python ML Pipeline
```bash
# Clone the repository
git clone https://github.com/vedamurthy1123-cpu/FUTURE_ML_01.git
cd FUTURE_ML_01

# Install requirements
pip install -r requirements.txt

# Run the full pipeline sequentially
python src/01_analyze_dataset.py
python src/02_run_data_cleaning.py
python src/03_run_eda.py
python src/04_run_feature_engineering.py
python src/05_run_train_test_split.py
python src/06_run_model_training.py
python src/07_run_final_forecasting.py
python src/08_run_future_forecast.py
```

### 2. Launch the Web Dashboard
```bash
cd dashboard
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 💡 Strategic Business Action Plan

1. **Q4 Peak Season Inventory Buffer:** November & December generate 37.6% of annual volume. Lock supplier procurement by August 15th with a +40% buffer.
2. **High-Margin Bundling:** Technology yields highest profit margins (17.4%). Bundle accessories to lift order baskets above ₹25,000.
3. **Q1 Working Capital Management:** January–February is the annual trough (16.8% share). Reserve liquidity to fund Q3 procurement.
4. **Corporate Fiscal Cycles:** March and September show institutional refresh surges. Deploy B2B outreach 45 days prior.
5. **2018 Target Realization:** Maintain an average monthly run-rate of ₹47.55 Lakhs to hit the projected ₹5.71 Cr annual target.
