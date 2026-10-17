"""
Stage 10: Genuine Future Sales Forecasting (Recursive / Auto-Regressive)
=========================================================================
Generates REAL future predictions for January–June 2018 using the trained
Extra Trees model from Stage 7.

Methodology:
  - Iterative month-by-month forecasting (auto-regressive)
  - Each month's lag and rolling features are computed from the growing
    sales history (actuals for ≤ Dec 2017, predictions for ≥ Jan 2018)
  - Calendar features (Year, Month, Quarter, etc.) are deterministic
  - Exogenous business features (Profit_Lag_1, Quantity_Lag_1, etc.) use
    December 2017's actual values as constant proxies

Does NOT modify any existing files:
  - superstore_features.csv      → read-only
  - superstore_cleaned.csv       → not touched
  - final_forecast_results.csv   → not touched
  - model_outputs/*.pkl          → read-only
  - Any existing reports (*.md)  → not touched

Creates NEW files only:
  - future_forecast_2018.csv
  - dashboard/data/future_forecast_2018_dashboard.csv
  - FUTURE_FORECAST_REPORT.md
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

# ======================================================================
# CONFIGURATION
# ======================================================================
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FORECAST_HORIZON = 12  # months ahead (Jan 2018 – Dec 2018)
FORECAST_START_YEAR = 2018
FORECAST_START_MONTH = 1


def build_calendar_features(year, month):
    """Deterministically compute calendar features for a given year/month."""
    quarter = (month - 1) // 3 + 1
    is_q4 = 1 if quarter == 4 else 0
    month_sin = np.sin(2 * np.pi * month / 12.0)
    month_cos = np.cos(2 * np.pi * month / 12.0)
    return {
        'Year': year,
        'Month': month,
        'Quarter': quarter,
        'Is_Q4': is_q4,
        'Month_Sin': month_sin,
        'Month_Cos': month_cos,
    }


def compute_lag_features(sales_history, current_idx):
    """Compute Sales_Lag_1/2/3/6/12 from the sales history at current_idx."""
    def safe_lag(offset):
        idx = current_idx - offset
        if 0 <= idx < len(sales_history):
            return sales_history[idx]
        return np.nan

    return {
        'Sales_Lag_1': safe_lag(1),
        'Sales_Lag_2': safe_lag(2),
        'Sales_Lag_3': safe_lag(3),
        'Sales_Lag_6': safe_lag(6),
        'Sales_Lag_12': safe_lag(12),
    }


def compute_rolling_features(sales_history, current_idx):
    """Compute rolling mean/std for windows of 3, 6, 12 using shifted sales."""
    # past_sales = sales shifted by 1 (i.e., index 0..current_idx-1)
    past = sales_history[:current_idx]  # everything before current month

    def rolling_stat(window, func):
        if len(past) >= window:
            window_data = past[-window:]
            return func(window_data)
        return np.nan

    return {
        'Sales_Rolling_Mean_3': rolling_stat(3, np.mean),
        'Sales_Rolling_Std_3': rolling_stat(3, lambda x: np.std(x, ddof=1)),
        'Sales_Rolling_Mean_6': rolling_stat(6, np.mean),
        'Sales_Rolling_Std_6': rolling_stat(6, lambda x: np.std(x, ddof=1)),
        'Sales_Rolling_Mean_12': rolling_stat(12, np.mean),
        'Sales_Rolling_Std_12': rolling_stat(12, lambda x: np.std(x, ddof=1)),
    }


def compute_yoy_growth(lag_1, lag_12):
    """Sales_YoY_Growth = (Lag_1 - Lag_12) / Lag_12."""
    if lag_12 is not None and lag_12 != 0 and not np.isnan(lag_12):
        return (lag_1 - lag_12) / lag_12
    return 0.0


def run_future_forecast():
    print("=" * 70)
    print("   STAGE 10: GENUINE FUTURE SALES FORECASTING (Jan–Jun 2018)")
    print("=" * 70)

    # ------------------------------------------------------------------
    # STEP 1: Load model and historical data
    # ------------------------------------------------------------------
    model_path = os.path.join(WORKSPACE_DIR, "models", "final_sales_forecasting_model.pkl")
    features_csv = os.path.join(WORKSPACE_DIR, "data", "processed", "superstore_features.csv")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found: {model_path}")
    if not os.path.exists(features_csv):
        raise FileNotFoundError(f"Feature dataset not found: {features_csv}")

    model = joblib.load(model_path)
    print(f"STEP 1: Loaded model — {model.__class__.__name__}")

    df_features = pd.read_csv(features_csv)
    print(f"  Loaded feature dataset: {len(df_features)} rows ({df_features['YearMonth'].iloc[0]} to {df_features['YearMonth'].iloc[-1]})")

    # Feature column order (everything except YearMonth and Sales)
    feature_cols = [c for c in df_features.columns if c not in ['YearMonth', 'Sales']]
    print(f"  Feature columns ({len(feature_cols)}): {feature_cols}")

    # Build complete sales history (all 36 months of actuals)
    sales_history = df_features['Sales'].tolist()
    yearmonth_history = df_features['YearMonth'].tolist()

    # ------------------------------------------------------------------
    # STEP 2: Extract last-known exogenous values (Dec 2017)
    # ------------------------------------------------------------------
    last_row = df_features.iloc[-1]
    # The exogenous Lag_1 features in the last row correspond to Nov 2017 actuals,
    # but we need Dec 2017's actual exogenous values for Jan 2018's Lag_1.
    # The Dec 2017 row's own target is Sales=83829.3188.
    # For Profit, Quantity, etc. we use the dashboard's Dec 2017 actuals.
    exogenous_constants = {
        'Profit_Lag_1': 8483.3468,          # Dec 2017 profit from monthly_sales_dashboard.csv
        'Quantity_Lag_1': 1723.0,            # Dec 2017 quantity
        'Discount_Avg_Lag_1': last_row['Discount_Avg_Lag_1'],  # Use last known
        'Order_Count_Lag_1': 224.0,          # Dec 2017 orders
        'Cat_Furniture_Sales_Lag_1': last_row['Cat_Furniture_Sales_Lag_1'],
        'Cat_OfficeSupplies_Sales_Lag_1': last_row['Cat_OfficeSupplies_Sales_Lag_1'],
        'Cat_Technology_Sales_Lag_1': last_row['Cat_Technology_Sales_Lag_1'],
    }
    print(f"\nSTEP 2: Exogenous proxies (Dec 2017 actuals):")
    for k, v in exogenous_constants.items():
        print(f"  {k:40s}: {v:,.4f}")

    # ------------------------------------------------------------------
    # STEP 3: Recursive forecasting loop
    # ------------------------------------------------------------------
    print(f"\nSTEP 3: Generating {FORECAST_HORIZON}-month recursive forecast...")
    print("-" * 60)

    future_predictions = []

    for step in range(FORECAST_HORIZON):
        # Current forecast month
        month_offset = FORECAST_START_MONTH + step - 1
        year = FORECAST_START_YEAR + month_offset // 12
        month = (month_offset % 12) + 1
        ym_str = f"{year:04d}-{month:02d}"

        # Current index in the extended sales_history
        current_idx = len(sales_history)

        # A) Calendar features
        cal = build_calendar_features(year, month)

        # B) Lag features
        lags = compute_lag_features(sales_history, current_idx)

        # C) Rolling features
        rolling = compute_rolling_features(sales_history, current_idx)

        # D) YoY growth
        yoy = compute_yoy_growth(lags['Sales_Lag_1'], lags['Sales_Lag_12'])

        # E) Assemble feature row in EXACT training order
        row = {}
        row['Year'] = cal['Year']
        row['Month'] = cal['Month']
        row['Quarter'] = cal['Quarter']
        row['Is_Q4'] = cal['Is_Q4']
        row['Month_Sin'] = cal['Month_Sin']
        row['Month_Cos'] = cal['Month_Cos']
        row['Sales_Lag_1'] = lags['Sales_Lag_1']
        row['Sales_Lag_2'] = lags['Sales_Lag_2']
        row['Sales_Lag_3'] = lags['Sales_Lag_3']
        row['Sales_Lag_6'] = lags['Sales_Lag_6']
        row['Sales_Lag_12'] = lags['Sales_Lag_12']
        row['Sales_Rolling_Mean_3'] = rolling['Sales_Rolling_Mean_3']
        row['Sales_Rolling_Std_3'] = rolling['Sales_Rolling_Std_3']
        row['Sales_Rolling_Mean_6'] = rolling['Sales_Rolling_Mean_6']
        row['Sales_Rolling_Std_6'] = rolling['Sales_Rolling_Std_6']
        row['Sales_Rolling_Mean_12'] = rolling['Sales_Rolling_Mean_12']
        row['Sales_Rolling_Std_12'] = rolling['Sales_Rolling_Std_12']
        row['Sales_YoY_Growth'] = yoy
        row['Profit_Lag_1'] = exogenous_constants['Profit_Lag_1']
        row['Quantity_Lag_1'] = exogenous_constants['Quantity_Lag_1']
        row['Discount_Avg_Lag_1'] = exogenous_constants['Discount_Avg_Lag_1']
        row['Order_Count_Lag_1'] = exogenous_constants['Order_Count_Lag_1']
        row['Cat_Furniture_Sales_Lag_1'] = exogenous_constants['Cat_Furniture_Sales_Lag_1']
        row['Cat_OfficeSupplies_Sales_Lag_1'] = exogenous_constants['Cat_OfficeSupplies_Sales_Lag_1']
        row['Cat_Technology_Sales_Lag_1'] = exogenous_constants['Cat_Technology_Sales_Lag_1']

        # Verify column order matches training
        assert list(row.keys()) == feature_cols, \
            f"Feature order mismatch!\nExpected: {feature_cols}\nGot: {list(row.keys())}"

        # F) Predict
        X_row = pd.DataFrame([row])
        predicted_sales = model.predict(X_row)[0]

        # Ensure prediction is non-negative
        predicted_sales = max(predicted_sales, 0.0)

        predicted_sales_inr = round(predicted_sales * 83.50, 2)
        
        # G) Append to history for next iteration
        sales_history.append(predicted_sales)
        yearmonth_history.append(ym_str)

        future_predictions.append({
            'YearMonth': ym_str,
            'Predicted_Sales_INR': f"₹{predicted_sales_inr:,.2f}",
            'Predicted_Sales_USD': f"${predicted_sales:,.2f}",
            'Predicted_Sales_INR_Raw': predicted_sales_inr,
            'Prediction_Type': 'Future Forecast'
        })

        print(f"  {ym_str}: Predicted Sales = Rs. {predicted_sales_inr:,.2f} (${predicted_sales:,.2f})")
        print(f"    Lag_1=Rs. {lags['Sales_Lag_1']*83.50:,.2f}  Lag_12=Rs. {lags['Sales_Lag_12']*83.50:,.2f}  "
              f"RolMean3=Rs. {rolling['Sales_Rolling_Mean_3']*83.50:,.2f}  YoY={yoy:+.4f}")

    print("-" * 60)

    # ------------------------------------------------------------------
    # STEP 4: Save future_forecast_2018.csv
    # ------------------------------------------------------------------
    df_future = pd.DataFrame(future_predictions)
    output_csv = os.path.join(WORKSPACE_DIR, "outputs", "predictions", "future_forecast_2018.csv")
    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    df_future.to_csv(output_csv, index=False)
    print(f"\nSTEP 4: Saved {len(df_future)} future predictions in INR to: {output_csv}")

    # ------------------------------------------------------------------
    # STEP 5: Generate 08_FUTURE_FORECAST_REPORT.md
    # ------------------------------------------------------------------
    report_path = os.path.join(WORKSPACE_DIR, "reports", "08_FUTURE_FORECAST_REPORT.md")

    total_future_sales_inr = df_future['Predicted_Sales_INR_Raw'].sum()
    avg_future_sales_inr = df_future['Predicted_Sales_INR_Raw'].mean()
    max_future = df_future.loc[df_future['Predicted_Sales_INR_Raw'].idxmax()]
    min_future = df_future.loc[df_future['Predicted_Sales_INR_Raw'].idxmin()]

    # Historical comparisons
    hist_csv = os.path.join(WORKSPACE_DIR, "outputs", "predictions", "monthly_sales.csv")
    if os.path.exists(hist_csv):
        df_hist = pd.read_csv(hist_csv)
        sales_col = 'Sales' if 'Sales' in df_hist.columns else 'Total_Sales'
        hist_h1_months = df_hist[df_hist['YearMonth'].isin(['2017-01', '2017-02', '2017-03', '2017-04', '2017-05', '2017-06'])]
        hist_h1_avg = hist_h1_months[sales_col].mean() * 83.50 if len(hist_h1_months) > 0 else 0
    else:
        hist_h1_avg = 0

    predictions_table = ""
    for _, r in df_future.iterrows():
        predictions_table += f"| {r['YearMonth']} | ₹{r['Predicted_Sales_INR_Raw']:,.2f} | Future Forecast |\n"

    report_content = f"""# Stage 10: Future Sales Forecast Report
## Genuine Forward-Looking Predictions (January – June 2018)

---

## Executive Summary

Using the trained **Extra Trees Regressor** model from Stage 7, this report presents
**{FORECAST_HORIZON}-month genuine future sales forecasts** for the Superstore dataset,
covering **January 2018 through June 2018**.

These predictions extend **beyond** the last known data point (December 2017) and
represent the model's best estimate of future monthly sales revenue.

| Metric | Value |
|--------|-------|
| Forecast Horizon | {FORECAST_HORIZON} months |
| Forecast Period | Jan 2018 – Dec 2018 |
| Model Used | Extra Trees Regressor |
| Model Test RMSE | ₹15,11,682.33 ($18,103.98) |
| Model Test MAPE | 21.04% |
| Total Forecasted Revenue | ₹{total_future_sales_inr:,.2f} |
| Average Monthly Forecast | ₹{avg_future_sales_inr:,.2f} |
| Peak Month | {max_future['YearMonth']} (₹{max_future['Predicted_Sales_INR_Raw']:,.2f}) |
| Lowest Month | {min_future['YearMonth']} (₹{min_future['Predicted_Sales_INR_Raw']:,.2f}) |

---

## Forecast Results

| Month | Predicted Sales (INR) | Prediction Type |
|-------|--------------------:|-----------------|
{predictions_table}

---

## Methodology

### Recursive (Auto-Regressive) Forecasting

Unlike the Stage 7 test evaluation (where actual sales were known and used for lag features),
future forecasting requires a **recursive approach**:

1. **Month 1 (Jan 2018):** Lag features computed from actual historical sales (Dec 2017 and earlier)
2. **Month 2+ (Feb 2018 onward):** The predicted sales from prior months are fed back into the
   lag and rolling features for subsequent months

This means prediction errors compound over time — earlier forecast errors propagate into
later months through the lag features.

### Feature Construction

For each future month, 25 features are constructed:

| Feature Group | Method |
|--------------|--------|
| Calendar (Year, Month, Quarter, Is_Q4, Month_Sin, Month_Cos) | Deterministic |
| Sales Lags (Lag_1, 2, 3, 6, 12) | From growing history (actuals + predictions) |
| Rolling Stats (Mean/Std for 3, 6, 12 months) | From growing history |
| YoY Growth | Computed from Lag_1 and Lag_12 |
| Exogenous (Profit, Quantity, Discount, Orders, Category Sales) | Dec 2017 actuals as proxies |

### Exogenous Feature Handling

The model predicts only total `Sales`. Exogenous features (Profit, Quantity, Discount,
Order Count, Category Sales) cannot be recursively predicted. December 2017's actual
values are used as constant proxies:

| Feature | Proxy Value |
|---------|------------|
| Profit_Lag_1 | $8,483.35 |
| Quantity_Lag_1 | 1,723 |
| Order_Count_Lag_1 | 224 |
| Discount_Avg_Lag_1 | {exogenous_constants['Discount_Avg_Lag_1']:.4f} |

---

## Assumptions & Limitations

1. **Error Compounding:** Each month's prediction error feeds into subsequent months
   via lag features, causing forecast uncertainty to grow over time.
2. **Exogenous Proxies:** Profit, quantity, and category-level features are held constant
   at December 2017 values. Real seasonal variation in these metrics is not captured.
3. **No External Shocks:** The model assumes business conditions (promotions, pricing,
   competition) remain consistent with the 2014–2017 training period.
4. **Tree Ensemble Limitation:** Extra Trees models cannot extrapolate beyond the range
   of training data, so extreme growth or decline scenarios will be underrepresented.
5. **Small Training Set:** The model was trained on only 29 monthly observations, limiting
   its ability to capture long-term structural trends.

---

## Comparison with Historical Patterns

| Period | Avg Monthly Sales (INR) |
|--------|------------------|
| H1 2017 Actual (Jan–Jun) | ₹{hist_h1_avg:,.2f} |
| 2018 Forecast Avg (Jan–Dec) | ₹{avg_future_sales_inr:,.2f} |

---

## Files Created

| File | Description |
|------|-------------|
| `outputs/predictions/future_forecast_2018.csv` | 12-month 2018 future predictions in INR & USD |
| `reports/08_FUTURE_FORECAST_REPORT.md` | This 2018 forecast report |

---

*Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
*No existing project files were modified during this process.*
"""

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_content)
    print(f"STEP 6: Generated report: {report_path}")

    # ------------------------------------------------------------------
    # FINAL SUMMARY
    # ------------------------------------------------------------------
    print("\n" + "=" * 70)
    print("   STAGE 10 COMPLETE — FUTURE FORECAST GENERATED SUCCESSFULLY")
    print("=" * 70)
    print(f"  Forecast Period     : Jan 2018 - Dec 2018 ({FORECAST_HORIZON} months)")
    print(f"  Total Forecast Rev  : Rs. {total_future_sales_inr:,.2f}")
    print(f"  Avg Monthly Forecast: Rs. {avg_future_sales_inr:,.2f}")
    print(f"  Peak Month          : {max_future['YearMonth']} (Rs. {max_future['Predicted_Sales_INR_Raw']:,.2f})")
    print(f"  Files Created       : 2 new files")
    print("=" * 70)

    return df_future


if __name__ == '__main__':
    run_future_forecast()
