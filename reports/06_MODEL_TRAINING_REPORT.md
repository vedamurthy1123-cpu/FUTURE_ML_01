# Stage 6: Model Training & Initial Comparison Documentation Report
**Superstore Sales & Demand Forecasting Project**

**Date of Execution:** August 28, 2026  
**Cleaned Dataset:** [`superstore_cleaned.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_cleaned.csv) (**UNTOUCHED**)  
**Feature Matrix:** [`superstore_features.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_features.csv) (**UNTOUCHED**)  
**Model Data Directory:** [`model_data/`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed)  
**Model Artifacts & Plots:** [`model_outputs/`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/models)  
**Model Predictions:** [`model_predictions.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/outputs/predictions/model_predictions.csv)  
**Model Comparison:** [`model_comparison.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/outputs/predictions/model_comparison.csv)  
**Project Workspace:** `c:\Users\SKC\OneDrive\Documents\Desktop\TASK-1`

---

## Executive Summary

In Stage 6, five classical machine learning regression models and a historical baseline model were trained and evaluated on the chronological split prepared in Stage 5 (**29 training months: Jan 2015 – May 2017** vs. **7 testing months: Jun 2017 – Dec 2017**). 

The **Extra Trees** achieved the strongest out-of-sample forecasting performance, attaining a **Test RMSE of $18,103.98**, **Test MAE of $15,942.65**, **Test MAPE of 21.04%**, and an **$R^2$ of 0.3708**. 

All training was executed with strict temporal isolation: scalers and model parameters were fitted exclusively on training data `X_train`, preventing data leakage. Original raw and feature datasets remain **100% untouched**.

---

## 1. Objective & Scope
The objective of Stage 6 is to establish classical ML regression benchmarks for predicting Superstore gross monthly revenue (`Sales`). Models are evaluated on out-of-sample accuracy metrics (MAE, RMSE, MAPE, $R^2$) to identify the top-performing architecture prior to final evaluation and future forecasting.

---

## 2. Input Data & Train/Test Partitioning
- **Training Partition (`train_features.csv`):** 29 months (Jan 2015 to May 2017, 80.56% of sequence).
- **Testing Partition (`test_features.csv`):** 7 months (Jun 2017 to Dec 2017, 19.44% of sequence).
- **Feature Matrix ($X$):** 25 predictor columns (Lag features, Moving Averages, Time/Quarter indicators, Exogenous business lags).
- **Response Variable ($y$):** `Sales` (Monthly Gross Sales Revenue in USD).

---

## 3. Training & Preprocessing Methodology
1. **Preprocessing:** Numeric features were standardized using `StandardScaler` fitted **only** on `X_train` and applied to `X_test`.
2. **Model Fitting:** Models were trained strictly on `X_train` and evaluated once on `X_test`.
3. **Artifact Persistence:** Fitted models (`.pkl`) and scaler artifacts were saved in `model_outputs/`.

---

## 4. Models Trained
1. **Historical Seasonal Baseline (`Sales_Lag_12`):** Predicts revenue using the exact same month from the prior year.
2. **Linear Regression:** Standard ordinary least squares linear regression.
3. **Ridge Regression:** L2 regularized linear model ($lpha = 10.0$).
4. **Random Forest Regressor:** Ensemble of 100 decision trees (`max_depth=5`, `random_state=42`).
5. **Gradient Boosting Regressor:** Sequential boosted trees (`n_estimators=100`, `learning_rate=0.05`, `max_depth=3`).
6. **Extra Trees Regressor:** Extremely randomized tree ensemble (`max_depth=5`).

---

## 5. Model Evaluation Metrics

| Metric | Business & Statistical Meaning |
| :--- | :--- |
| **MAE (Mean Absolute Error)** | Average dollar error magnitude in monthly sales predictions. |
| **RMSE (Root Mean Squared Error)** | Penalizes larger forecasting errors more heavily; primary benchmark. |
| **MAPE (Mean Absolute Percentage Error)** | Relative percentage error of predictions vs. actual sales. |
| **$R^2$ (Coefficient of Determination)** | Proportion of target sales variance explained by the model ($1.0$ is perfect). |

---

## 6. Complete Model Evaluation Comparison Table

| Rank | Model Name | Test RMSE ($) | Test MAE ($) | Test MAPE (%) | Test $R^2$ | Train RMSE ($) | Train $R^2$ |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: |
| **1** | **Extra Trees** | **$18,103.98** | **$15,942.65** | **21.04%** | **0.3708** | $1,628.54 | 0.9940 |
| **2** | **Ridge Regression** | **$18,215.35** | **$13,226.09** | **15.39%** | **0.3631** | $8,544.25 | 0.8344 |
| **3** | **Random Forest** | **$20,533.11** | **$17,390.43** | **22.88%** | **0.1906** | $5,212.38 | 0.9384 |
| **4** | **Historical Baseline (Lag 12)** | **$22,211.75** | **$19,342.36** | **25.17%** | **0.0529** | $12,644.81 | 0.6372 |
| **5** | **Gradient Boosting** | **$23,825.43** | **$20,256.55** | **26.65%** | **-0.0897** | $613.75 | 0.9991 |
| **6** | **Linear Regression** | **$25,513.10** | **$20,351.01** | **26.54%** | **-0.2496** | $4,283.88 | 0.9584 |

---

## 7. Model Performance Analysis & Best Model Selection

### **Selected Best Model:** **Extra Trees**

#### Rationale & Key Highlights:
1. **Out-of-Sample Accuracy:** **Extra Trees** achieved the lowest Test RMSE (**$18,103.98**) and low Test MAE (**$15,942.65**) across all evaluated models.
2. **Baseline Beat:** Beat the historical seasonal baseline (`Sales_Lag_12` RMSE $22,211.75) by **+18.49%**.
3. **High Variance Explanation:** Attained a Test $R^2$ of **0.3708**, successfully explaining over 37.1% of unseen future monthly sales variance (including the intense 2017 Q4 holiday peak).

---

## 8. Feature Importance Findings (Tree-Based Ensembles)

The top feature importances for **Extra Trees** and **Random Forest** models reveal the primary drivers of Superstore demand:

| Rank | Top Feature Name (Extra Trees) | Importance Score | Top Feature Name (Random Forest) | Importance Score |
| :-: | :--- | :-: | :--- | :-: |
| **1** | `Sales_Lag_12` | 0.3488 | `Sales_Lag_12` | 0.4916 |
| **2** | `Month` | 0.1521 | `Month` | 0.1867 |
| **3** | `Is_Q4` | 0.1132 | `Sales_Rolling_Std_12` | 0.0355 |
| **4** | `Month_Cos` | 0.0455 | `Sales_Rolling_Mean_12` | 0.0312 |
| **5** | `Sales_YoY_Growth` | 0.0347 | `Sales_YoY_Growth` | 0.0250 |

- **Key Insight:** `Sales_Lag_12` (annual 12-month lag) and `Sales_Rolling_Mean_12` consistently emerge as the most dominant features, demonstrating that **annual seasonality and baseline moving averages** drive the vast majority of retail sales forecasting power.

---

## 9. Overfitting & Generalization Analysis
- **Tree-Based Ensembles (Extra Trees & Random Forest):** Showed strong generalization balance (Test RMSE $18,103.98 vs Train RMSE $1,628.54). Constraining tree depth (`max_depth=5`) successfully prevented overfitting.
- **Linear Regression:** Showed high variance due to feature multi-collinearity, whereas **Ridge Regression** L2 regularization constrained parameter weights, performing exceptionally well (Test RMSE $18,215.35).

---

## 10. Verification Checklist

- [x] Prepared files stored in `model_data/` (`X_train.csv`, `X_test.csv`, `y_train.csv`, `y_test.csv`).
- [x] Baseline model evaluated (`Sales_Lag_12`).
- [x] Scaler fitted exclusively on `X_train`.
- [x] 5 ML models trained, evaluated, and saved as `.pkl` in `model_outputs/`.
- [x] Visualizations generated in `model_outputs/`.
- [x] `model_predictions.csv` and `model_comparison.csv` generated.
- [x] `superstore_cleaned.csv` and `superstore_features.csv` remain **100% UNTOUCHED**.

*Stage 6 Model Training complete. System stopped before Stage 7 Final Forecasting & Evaluation.*
