"""
Reusable Future Sales Forecasting Script
========================================
Loads the trained final model (final_sales_forecasting_model.pkl) and scaler,
reads the feature dataset, and generates out-of-sample sales predictions.
"""

import os
import joblib
import pandas as pd
import numpy as np

def forecast_sales(feature_csv_path="superstore_features.csv", output_csv_path="future_sales_predictions.csv"):
    workspace_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(workspace_dir, "model_outputs", "final_sales_forecasting_model.pkl")
    scaler_path = os.path.join(workspace_dir, "model_outputs", "scaler.pkl")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")

    model = joblib.load(model_path)
    print(f"Loaded Final Model: {model}")

    full_feature_path = os.path.join(workspace_dir, feature_csv_path)
    if not os.path.exists(full_feature_path):
        raise FileNotFoundError(f"Feature dataset not found at: {full_feature_path}")

    df_feat = pd.read_csv(full_feature_path)
    target_col = 'Sales'
    date_col = 'YearMonth'

    feature_cols = [c for c in df_feat.columns if c not in [target_col, date_col]]
    X = df_feat[feature_cols]

    predictions = model.predict(X)

    out_df = pd.DataFrame({
        'YearMonth': df_feat[date_col],
        'Actual_Sales': df_feat[target_col] if target_col in df_feat.columns else np.nan,
        'Forecasted_Sales': predictions
    })

    out_csv_full = os.path.join(workspace_dir, output_csv_path)
    out_df.to_csv(out_csv_full, index=False)
    print(f"Successfully generated forecasts for {len(out_df)} periods.")
    print(f"Predictions saved to: {out_csv_full}")
    return out_df

if __name__ == '__main__':
    forecast_sales()
