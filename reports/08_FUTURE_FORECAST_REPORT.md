# Stage 10: Future Sales Forecast Report
## Genuine Forward-Looking Predictions (January – June 2018)

---

## Executive Summary

Using the trained **Extra Trees Regressor** model from Stage 7, this report presents
**12-month genuine future sales forecasts** for the Superstore dataset,
covering **January 2018 through June 2018**.

These predictions extend **beyond** the last known data point (December 2017) and
represent the model's best estimate of future monthly sales revenue.

| Metric | Value |
|--------|-------|
| Forecast Horizon | 12 months |
| Forecast Period | Jan 2018 – Dec 2018 |
| Model Used | Extra Trees Regressor |
| Model Test RMSE | ₹15,11,682.33 ($18,103.98) |
| Model Test MAPE | 21.04% |
| Total Forecasted Revenue | ₹57,065,382.66 |
| Average Monthly Forecast | ₹4,755,448.56 |
| Peak Month | 2018-12 (₹8,022,682.50) |
| Lowest Month | 2018-02 (₹2,630,548.15) |

---

## Forecast Results

| Month | Predicted Sales (INR) | Prediction Type |
|-------|--------------------:|-----------------|
| 2018-01 | ₹3,264,128.62 | Future Forecast |
| 2018-02 | ₹2,630,548.15 | Future Forecast |
| 2018-03 | ₹4,111,573.78 | Future Forecast |
| 2018-04 | ₹3,385,915.70 | Future Forecast |
| 2018-05 | ₹3,632,552.32 | Future Forecast |
| 2018-06 | ₹3,747,787.87 | Future Forecast |
| 2018-07 | ₹3,542,206.66 | Future Forecast |
| 2018-08 | ₹4,622,765.38 | Future Forecast |
| 2018-09 | ₹6,079,551.55 | Future Forecast |
| 2018-10 | ₹6,330,065.88 | Future Forecast |
| 2018-11 | ₹7,695,604.25 | Future Forecast |
| 2018-12 | ₹8,022,682.50 | Future Forecast |


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
| Discount_Avg_Lag_1 | 0.1610 |

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
| H1 2017 Actual (Jan–Jun) | ₹3,575,320.15 |
| 2018 Forecast Avg (Jan–Dec) | ₹4,755,448.56 |

---

## Files Created

| File | Description |
|------|-------------|
| `outputs/predictions/future_forecast_2018.csv` | 12-month 2018 future predictions in INR & USD |
| `reports/08_FUTURE_FORECAST_REPORT.md` | This 2018 forecast report |

---

*Report generated: 2026-09-25 23:39:23*
*No existing project files were modified during this process.*
