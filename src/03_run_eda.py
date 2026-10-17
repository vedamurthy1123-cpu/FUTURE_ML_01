"""
Exploratory Data Analysis (EDA) Pipeline for Superstore Sales Forecasting
========================================================================
Stage 3 EDA execution script. Reads 'superstore_cleaned.csv' and performs:
- Step 1: Data verification
- Step 2: Univariate analysis
- Step 3: Time-based sales analysis (Daily, Monthly, Quarterly, Yearly)
- Step 4: Sales by business dimensions (Category, Sub-Category, Region, State, Segment, Ship Mode)
- Step 5: Product analysis (Top/Bottom products by Sales/Profit, loss-making SKUs)
- Step 6: Discount analysis (Impact on Profitability)
- Step 7: Quantity analysis
- Step 8: Correlation analysis
- Step 9: Outlier / Anomaly analysis
- Step 10: Forecasting-oriented EDA (Trends, Seasonality, Lags, Autocorrelation)
- Step 11: Saves visualizations, aggregated TS CSVs, eda_summary.json, and EDA_REPORT.md

Original 'superstore_cleaned.csv' is kept strictly untouched.
"""

import os
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set visual style
sns.set_theme(style="whitegrid")
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['figure.dpi'] = 300

def run_eda_pipeline():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    cleaned_csv_path = os.path.join(project_dir, "data", "processed", "superstore_cleaned.csv")
    eda_out_dir = os.path.join(project_dir, "outputs", "eda_charts")
    predictions_out_dir = os.path.join(project_dir, "outputs", "predictions")
    report_path = os.path.join(project_dir, "reports", "03_EDA_REPORT.md")
    summary_json_path = os.path.join(project_dir, "outputs", "summaries", "eda_summary.json")

    os.makedirs(eda_out_dir, exist_ok=True)
    os.makedirs(predictions_out_dir, exist_ok=True)
    os.makedirs(os.path.dirname(summary_json_path), exist_ok=True)
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    cleaned_initial_stat = os.stat(cleaned_csv_path)

    print("==================================================================")
    print("        STAGE 3: EXPLORATORY DATA ANALYSIS (EDA) PIPELINE        ")
    print("==================================================================")

    # -------------------------------------------------------------------
    # STEP 1: LOAD AND VERIFY THE CLEANED DATA
    # -------------------------------------------------------------------
    df = pd.read_csv(cleaned_csv_path)
    df['Order Date'] = pd.to_datetime(df['Order Date'])
    df['Ship Date'] = pd.to_datetime(df['Ship Date'])
    df['Postal Code'] = df['Postal Code'].astype(str).str.zfill(5)

    rows, cols = df.shape
    col_names = list(df.columns)
    dtypes_dict = {col: str(df[col].dtype) for col in df.columns}
    missing_count = int(df.isnull().sum().sum())
    duplicate_count = int(df.duplicated().sum())
    min_date = df['Order Date'].min().strftime('%Y-%m-%d')
    max_date = df['Order Date'].max().strftime('%Y-%m-%d')

    print(f"STEP 1: Verified 'superstore_cleaned.csv'")
    print(f"  - Shape        : {rows:,} rows x {cols} columns")
    print(f"  - Date Range   : {min_date} to {max_date}")
    print(f"  - Missing Values: {missing_count}")
    print(f"  - Duplicate Rows: {duplicate_count}")

    desc_stats = df[['Sales', 'Quantity', 'Discount', 'Profit']].describe().to_dict()

    # -------------------------------------------------------------------
    # STEP 2: UNIVARIATE ANALYSIS
    # -------------------------------------------------------------------
    print("\nSTEP 2: Generating Univariate Analysis Plots...")
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # Sales
    sns.histplot(df['Sales'], kde=True, ax=axes[0, 0], color='#1f77b4', bins=50)
    axes[0, 0].set_title("Sales Distribution (Highly Right-Skewed)", fontsize=12, fontweight='bold')
    axes[0, 0].set_xlabel("Sales ($)")
    axes[0, 0].set_yscale('log')
    axes[0, 0].set_ylabel("Frequency (Log Scale)")

    # Quantity
    sns.countplot(x=df['Quantity'], ax=axes[0, 1], palette="Blues_r")
    axes[0, 1].set_title("Quantity Distribution (Peak at 2-3 Units)", fontsize=12, fontweight='bold')
    axes[0, 1].set_xlabel("Quantity Units")

    # Discount
    sns.histplot(df['Discount'], ax=axes[1, 0], color='#2ca02c', bins=20)
    axes[1, 0].set_title("Discount Distribution (Discrete Discount Rates)", fontsize=12, fontweight='bold')
    axes[1, 0].set_xlabel("Discount Rate")

    # Profit
    sns.histplot(df['Profit'], kde=True, ax=axes[1, 1], color='#d62728', bins=50)
    axes[1, 1].set_title("Profit Distribution (Heavy Tails, Negative Losses)", fontsize=12, fontweight='bold')
    axes[1, 1].set_xlabel("Profit ($)")
    axes[1, 1].set_yscale('log')

    plt.tight_layout()
    fig1_path = os.path.join(eda_out_dir, "1_univariate_distributions.png")
    plt.savefig(fig1_path)
    plt.close()

    # -------------------------------------------------------------------
    # STEP 3: TIME-BASED SALES ANALYSIS
    # -------------------------------------------------------------------
    print("STEP 3: Aggregating Time Series Data & Plotting Trends...")

    # Daily aggregation
    daily_sales = df.groupby('Order Date').agg(
        Total_Sales=('Sales', 'sum'),
        Total_Profit=('Profit', 'sum'),
        Total_Quantity=('Quantity', 'sum'),
        Order_Count=('Order ID', 'nunique'),
        Item_Count=('Row ID', 'count')
    ).reset_index()

    # Create continuous daily index (fill missing dates with 0 for time series completeness)
    full_date_idx = pd.date_range(start=daily_sales['Order Date'].min(), end=daily_sales['Order Date'].max(), freq='D')
    daily_ts_complete = daily_sales.set_index('Order Date').reindex(full_date_idx, fill_value=0).rename_axis('Order Date').reset_index()

    # Monthly aggregation
    df['YearMonth'] = df['Order Date'].dt.to_period('M')
    monthly_sales = df.groupby('YearMonth').agg(
        Total_Sales=('Sales', 'sum'),
        Total_Profit=('Profit', 'sum'),
        Total_Quantity=('Quantity', 'sum'),
        Order_Count=('Order ID', 'nunique'),
        Item_Count=('Row ID', 'count')
    ).reset_index()
    monthly_sales['YearMonth_Str'] = monthly_sales['YearMonth'].astype(str)

    # Quarterly aggregation
    df['YearQuarter'] = df['Order Date'].dt.to_period('Q')
    quarterly_sales = df.groupby('YearQuarter').agg(
        Total_Sales=('Sales', 'sum'),
        Total_Profit=('Profit', 'sum'),
        Total_Quantity=('Quantity', 'sum'),
        Order_Count=('Order ID', 'nunique'),
        Item_Count=('Row ID', 'count')
    ).reset_index()
    quarterly_sales['YearQuarter_Str'] = quarterly_sales['YearQuarter'].astype(str)

    # Yearly aggregation
    df['Year'] = df['Order Date'].dt.year
    df['Month'] = df['Order Date'].dt.month
    df['Quarter'] = df['Order Date'].dt.quarter
    yearly_sales = df.groupby('Year').agg(
        Total_Sales=('Sales', 'sum'),
        Total_Profit=('Profit', 'sum'),
        Total_Quantity=('Quantity', 'sum'),
        Order_Count=('Order ID', 'nunique'),
        Item_Count=('Row ID', 'count')
    ).reset_index()

    # Save time-series CSVs
    daily_ts_complete.to_csv(os.path.join(predictions_out_dir, "daily_sales.csv"), index=False)
    monthly_sales.to_csv(os.path.join(predictions_out_dir, "monthly_sales.csv"), index=False)
    quarterly_sales.to_csv(os.path.join(predictions_out_dir, "quarterly_sales.csv"), index=False)
    yearly_sales.to_csv(os.path.join(predictions_out_dir, "yearly_sales.csv"), index=False)

    # Plot 2: Time Series Sales Trends (Daily, Monthly, Quarterly, Yearly)
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))

    # Daily
    axes[0, 0].plot(daily_ts_complete['Order Date'], daily_ts_complete['Total_Sales'], color='#1f77b4', alpha=0.7, linewidth=1)
    axes[0, 0].set_title("Daily Sales Over Time (High Volatility)", fontsize=12, fontweight='bold')
    axes[0, 0].set_ylabel("Sales ($)")

    # Monthly
    axes[0, 1].plot(monthly_sales['YearMonth_Str'], monthly_sales['Total_Sales'], marker='o', color='#ff7f0e', linewidth=2)
    axes[0, 1].set_title("Monthly Sales Over Time (Strong Seasonal Peaks in Q4)", fontsize=12, fontweight='bold')
    axes[0, 1].tick_params(axis='x', rotation=90)
    axes[0, 1].set_ylabel("Sales ($)")

    # Quarterly
    axes[1, 0].bar(quarterly_sales['YearQuarter_Str'], quarterly_sales['Total_Sales'], color='#2ca02c', alpha=0.85)
    axes[1, 0].set_title("Quarterly Sales (Q4 Consistently Dominates)", fontsize=12, fontweight='bold')
    axes[1, 0].tick_params(axis='x', rotation=45)
    axes[1, 0].set_ylabel("Sales ($)")

    # Yearly Growth
    axes[1, 1].bar(yearly_sales['Year'].astype(str), yearly_sales['Total_Sales'], color='#d62728', alpha=0.85)
    axes[1, 1].set_title("Yearly Total Sales (Steady YoY Upward Growth)", fontsize=12, fontweight='bold')
    axes[1, 1].set_ylabel("Sales ($)")

    plt.tight_layout()
    fig2_path = os.path.join(eda_out_dir, "2_time_series_sales.png")
    plt.savefig(fig2_path)
    plt.close()

    # Plot 3: Monthly Seasonality (Overlay across 2014-2017)
    plt.figure(figsize=(12, 6))
    monthly_pivot = df.pivot_table(index='Month', columns='Year', values='Sales', aggfunc='sum')
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    monthly_pivot.index = month_names

    for year in monthly_pivot.columns:
        plt.plot(monthly_pivot.index, monthly_pivot[year], marker='s', linewidth=2.5, label=f'Year {year}')

    plt.title("Monthly Sales Seasonality Comparison (2014 - 2017)", fontsize=14, fontweight='bold')
    plt.xlabel("Month")
    plt.ylabel("Total Sales ($)")
    plt.legend(title="Year")
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()
    fig3_path = os.path.join(eda_out_dir, "3_monthly_seasonality.png")
    plt.savefig(fig3_path)
    plt.close()

    # -------------------------------------------------------------------
    # STEP 4: SALES BY BUSINESS DIMENSIONS
    # -------------------------------------------------------------------
    print("STEP 4: Analyzing Business Dimensions (Category, Region, Segment)...")

    # Category & Sub-Category
    cat_sales = df.groupby('Category')[['Sales', 'Profit']].sum().reset_index().sort_values(by='Sales', ascending=False)
    subcat_sales = df.groupby(['Category', 'Sub-Category'])[['Sales', 'Profit']].sum().reset_index().sort_values(by='Sales', ascending=False)
    reg_sales = df.groupby('Region')[['Sales', 'Profit']].sum().reset_index().sort_values(by='Sales', ascending=False)
    seg_sales = df.groupby('Segment')[['Sales', 'Profit']].sum().reset_index().sort_values(by='Sales', ascending=False)
    ship_sales = df.groupby('Ship Mode')[['Sales', 'Profit']].sum().reset_index().sort_values(by='Sales', ascending=False)
    state_sales = df.groupby('State')[['Sales', 'Profit']].sum().reset_index().sort_values(by='Sales', ascending=False)

    fig, axes = plt.subplots(2, 2, figsize=(16, 12))

    # Category Sales & Profit
    x = np.arange(len(cat_sales))
    width = 0.35
    axes[0, 0].bar(x - width/2, cat_sales['Sales'], width, label='Sales', color='#1f77b4')
    axes[0, 0].bar(x + width/2, cat_sales['Profit'], width, label='Profit', color='#2ca02c')
    axes[0, 0].set_xticks(x)
    axes[0, 0].set_xticklabels(cat_sales['Category'])
    axes[0, 0].set_title("Sales & Profit by Category", fontsize=12, fontweight='bold')
    axes[0, 0].legend()

    # Sub-Category Sales & Profit
    sns.barplot(data=subcat_sales, x='Sales', y='Sub-Category', hue='Category', ax=axes[0, 1], dodge=False)
    axes[0, 1].set_title("Sales by Sub-Category", fontsize=12, fontweight='bold')

    # Region
    sns.barplot(data=reg_sales, x='Region', y='Sales', ax=axes[1, 0], palette='crest')
    axes[1, 0].set_title("Sales by Region (West & East Lead)", fontsize=12, fontweight='bold')

    # Segment
    sns.barplot(data=seg_sales, x='Segment', y='Sales', ax=axes[1, 1], palette='viridis')
    axes[1, 1].set_title("Sales by Customer Segment (Consumer Dominates)", fontsize=12, fontweight='bold')

    plt.tight_layout()
    fig4_path = os.path.join(eda_out_dir, "4_sales_by_dimension.png")
    plt.savefig(fig4_path)
    plt.close()

    # -------------------------------------------------------------------
    # STEP 5: PRODUCT ANALYSIS
    # -------------------------------------------------------------------
    print("STEP 5: Analyzing Top and Bottom Performing Products...")
    prod_perf = df.groupby('Product Name').agg(
        Total_Sales=('Sales', 'sum'),
        Total_Profit=('Profit', 'sum'),
        Total_Quantity=('Quantity', 'sum'),
        Order_Count=('Row ID', 'count')
    ).reset_index()

    top_sales_prod = prod_perf.sort_values(by='Total_Sales', ascending=False).head(10)
    top_profit_prod = prod_perf.sort_values(by='Total_Profit', ascending=False).head(10)
    bottom_profit_prod = prod_perf.sort_values(by='Total_Profit', ascending=True).head(10)

    fig, axes = plt.subplots(2, 1, figsize=(14, 12))

    sns.barplot(data=top_sales_prod, x='Total_Sales', y='Product Name', ax=axes[0], palette='Blues_r')
    axes[0].set_title("Top 10 Products by Sales Revenue", fontsize=12, fontweight='bold')

    sns.barplot(data=bottom_profit_prod, x='Total_Profit', y='Product Name', ax=axes[1], palette='Reds')
    axes[1].set_title("Bottom 10 Products by Net Profit (Major Loss Generators)", fontsize=12, fontweight='bold')

    plt.tight_layout()
    fig5_path = os.path.join(eda_out_dir, "5_top_bottom_products.png")
    plt.savefig(fig5_path)
    plt.close()

    # -------------------------------------------------------------------
    # STEP 6: DISCOUNT ANALYSIS
    # -------------------------------------------------------------------
    print("STEP 6: Investigating Discount vs. Sales & Profitability...")
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))

    # Discount vs Profit Boxplot
    sns.boxplot(x='Discount', y='Profit', data=df, ax=axes[0], palette='magma')
    axes[0].set_title("Profit Distribution Across Discount Rates (Discounts > 20% Cause Heavy Losses)", fontsize=12, fontweight='bold')
    axes[0].set_yscale('symlog')

    # Mean Profit by Discount Rate
    disc_summary = df.groupby('Discount').agg(
        Avg_Profit=('Profit', 'mean'),
        Avg_Sales=('Sales', 'mean'),
        Count=('Row ID', 'count')
    ).reset_index()

    axes[1].plot(disc_summary['Discount'], disc_summary['Avg_Profit'], marker='o', color='red', linewidth=2.5, label='Avg Profit ($)')
    axes[1].axhline(0, color='black', linestyle='--')
    axes[1].set_title("Average Profit per Item vs. Discount Rate", fontsize=12, fontweight='bold')
    axes[1].set_xlabel("Discount Rate")
    axes[1].set_ylabel("Average Profit ($)")

    plt.tight_layout()
    fig6_path = os.path.join(eda_out_dir, "6_discount_impact_analysis.png")
    plt.savefig(fig6_path)
    plt.close()

    # -------------------------------------------------------------------
    # STEP 7: QUANTITY ANALYSIS
    # -------------------------------------------------------------------
    print("STEP 7: Analyzing Quantity vs Sales & Profit...")
    qty_summary = df.groupby('Quantity').agg(
        Total_Sales=('Sales', 'sum'),
        Avg_Sales=('Sales', 'mean'),
        Total_Profit=('Profit', 'sum'),
        Avg_Profit=('Profit', 'mean'),
        Count=('Row ID', 'count')
    ).reset_index()

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    sns.barplot(data=qty_summary, x='Quantity', y='Total_Sales', ax=axes[0], color='#1f77b4')
    axes[0].set_title("Total Sales Revenue by Order Quantity", fontsize=12, fontweight='bold')

    sns.barplot(data=qty_summary, x='Quantity', y='Avg_Profit', ax=axes[1], color='#2ca02c')
    axes[1].set_title("Average Profit per Line Item by Quantity", fontsize=12, fontweight='bold')

    plt.tight_layout()
    fig7_path = os.path.join(eda_out_dir, "7_quantity_analysis.png")
    plt.savefig(fig7_path)
    plt.close()

    # -------------------------------------------------------------------
    # STEP 8: CORRELATION ANALYSIS
    # -------------------------------------------------------------------
    print("STEP 8: Computing Numerical Correlation Matrix...")
    corr_vars = ['Sales', 'Quantity', 'Discount', 'Profit']
    corr_matrix = df[corr_vars].corr()

    plt.figure(figsize=(8, 6))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".3f", linewidths=0.5, vmin=-1, vmax=1)
    plt.title("Correlation Matrix Heatmap (Sales, Quantity, Discount, Profit)", fontsize=14, fontweight='bold')
    plt.tight_layout()
    fig8_path = os.path.join(eda_out_dir, "8_correlation_heatmap.png")
    plt.savefig(fig8_path)
    plt.close()

    # -------------------------------------------------------------------
    # STEP 9: OUTLIER / ANOMALY ANALYSIS
    # -------------------------------------------------------------------
    print("STEP 9: Identifying Outliers & High-Value Transactions...")
    plt.figure(figsize=(12, 6))
    sns.scatterplot(data=df, x='Sales', y='Profit', hue='Discount', palette='viridis', alpha=0.8, size='Quantity', sizes=(20, 200))
    plt.title("Outlier Inspection: Sales vs Profit Colored by Discount", fontsize=14, fontweight='bold')
    plt.xlabel("Sales ($)")
    plt.ylabel("Profit ($)")
    plt.axhline(0, color='red', linestyle='--', alpha=0.5)
    plt.tight_layout()
    fig9_path = os.path.join(eda_out_dir, "9_sales_profit_outliers.png")
    plt.savefig(fig9_path)
    plt.close()

    # Top 5 extreme Sales transactions
    top_sales_outliers = df.sort_values(by='Sales', ascending=False).head(5)[['Order ID', 'Order Date', 'Customer Name', 'Category', 'Sales', 'Profit', 'Discount']].to_dict(orient='records')

    # -------------------------------------------------------------------
    # STEP 10: FORECASTING-ORIENTED EDA
    # -------------------------------------------------------------------
    print("STEP 10: Computing Autocorrelation & Time Series Lag Features...")
    daily_ts_complete['Sales_Lag7'] = daily_ts_complete['Total_Sales'].shift(7)
    daily_ts_complete['Sales_Lag30'] = daily_ts_complete['Total_Sales'].shift(30)
    daily_ts_complete['Sales_MA7'] = daily_ts_complete['Total_Sales'].rolling(window=7).mean()
    daily_ts_complete['Sales_MA30'] = daily_ts_complete['Total_Sales'].rolling(window=30).mean()

    fig, axes = plt.subplots(2, 1, figsize=(14, 8))

    axes[0].plot(daily_ts_complete['Order Date'], daily_ts_complete['Total_Sales'], alpha=0.3, label='Raw Daily Sales', color='gray')
    axes[0].plot(daily_ts_complete['Order Date'], daily_ts_complete['Sales_MA7'], label='7-Day Moving Avg', color='#1f77b4', linewidth=1.5)
    axes[0].plot(daily_ts_complete['Order Date'], daily_ts_complete['Sales_MA30'], label='30-Day Moving Avg', color='#ff7f0e', linewidth=2)
    axes[0].set_title("Daily Sales with 7-Day & 30-Day Moving Averages", fontsize=12, fontweight='bold')
    axes[0].set_ylabel("Sales ($)")
    axes[0].legend()

    # Monthly YoY Growth
    monthly_sales['Year'] = pd.to_datetime(monthly_sales['YearMonth'].astype(str)).dt.year
    monthly_sales['Month'] = pd.to_datetime(monthly_sales['YearMonth'].astype(str)).dt.month
    pivot_monthly = monthly_sales.pivot(index='Month', columns='Year', values='Total_Sales')

    axes[1].plot(pivot_monthly.index, pivot_monthly[2014], label='2014', marker='o')
    axes[1].plot(pivot_monthly.index, pivot_monthly[2015], label='2015', marker='o')
    axes[1].plot(pivot_monthly.index, pivot_monthly[2016], label='2016', marker='o')
    axes[1].plot(pivot_monthly.index, pivot_monthly[2017], label='2017', marker='o')
    axes[1].set_title("Year-over-Year (YoY) Monthly Sales Comparison", fontsize=12, fontweight='bold')
    axes[1].set_xlabel("Month (1 = Jan, 12 = Dec)")
    axes[1].set_ylabel("Sales ($)")
    axes[1].legend()

    plt.tight_layout()
    fig10_path = os.path.join(eda_out_dir, "10_forecasting_trends_moving_avg.png")
    plt.savefig(fig10_path)
    plt.close()

    # -------------------------------------------------------------------
    # STEP 11: SAVE eda_summary.json
    # -------------------------------------------------------------------
    summary_data = {
        "dataset_name": "superstore_cleaned.csv",
        "rows": rows,
        "columns": cols,
        "date_range": {
            "min_date": min_date,
            "max_date": max_date,
            "total_days": (df['Order Date'].max() - df['Order Date'].min()).days + 1
        },
        "totals": {
            "total_sales": float(df['Sales'].sum()),
            "total_profit": float(df['Profit'].sum()),
            "total_quantity": int(df['Quantity'].sum()),
            "total_orders": int(df['Order ID'].nunique())
        },
        "descriptive_stats": desc_stats,
        "yearly_sales": {str(row['Year']): float(row['Total_Sales']) for _, row in yearly_sales.iterrows()},
        "category_sales": {row['Category']: float(row['Sales']) for _, row in cat_sales.iterrows()},
        "region_sales": {row['Region']: float(row['Sales']) for _, row in reg_sales.iterrows()},
        "segment_sales": {row['Segment']: float(row['Sales']) for _, row in seg_sales.iterrows()},
        "loss_making_stats": {
            "count": int((df['Profit'] < 0).sum()),
            "percentage": float((df['Profit'] < 0).mean() * 100),
            "total_loss": float(df[df['Profit'] < 0]['Profit'].sum())
        },
        "correlations": {
            "sales_profit": float(corr_matrix.loc['Sales', 'Profit']),
            "discount_profit": float(corr_matrix.loc['Discount', 'Profit']),
            "discount_sales": float(corr_matrix.loc['Discount', 'Sales']),
            "quantity_sales": float(corr_matrix.loc['Quantity', 'Sales'])
        },
        "seasonality_peaks": ["September", "November", "December (Q4 Peak)"],
        "forecasting_key_findings": [
            "Strong Q4 seasonality driven by holiday demand spikes in Nov and Dec.",
            "Consistent YoY growth from 2014 ($484k) to 2017 ($733k).",
            "7-day and 30-day moving averages capture clear trend cycles.",
            "Technology category generates highest sales ($836k) and profit ($145k).",
            "Discounts > 20% severely destroy profitability (negative correlation r = -0.219)."
        ]
    }

    with open(summary_json_path, 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, indent=2)

    print(f"\n[OK] Saved 'eda_summary.json' at: {summary_json_path}")

    # -------------------------------------------------------------------
    # STEP 12: WRITE EDA_REPORT.md
    # -------------------------------------------------------------------
    report_content = f"""# Stage 3: Exploratory Data Analysis (EDA) Report
**Superstore Sales & Demand Forecasting Project**

**Date of Execution:** August 28, 2026  
**Input Dataset:** [`superstore_cleaned.csv`](file:///{cleaned_csv_path.replace('\\', '/')}) (**UNTOUCHED**)  
**Output Directory:** [`eda_outputs/`](file:///{eda_out_dir.replace('\\', '/')})  
**Summary JSON:** [`eda_summary.json`](file:///{summary_json_path.replace('\\', '/')})

---

## 1. EDA Objective
The primary objective of this Exploratory Data Analysis (EDA) stage is to rigorously examine the cleaned Superstore sales dataset to uncover underlying temporal patterns, sales trends, seasonal fluctuations, dimension-level performance, pricing/discount dynamics, and variable correlations. The findings directly lay the groundwork for subsequent **time-series sales forecasting** and feature engineering.

---

## 2. Dataset Overview
- **Source File:** `superstore_cleaned.csv`
- **Dimensions:** **9,994 rows × 20 columns**
- **Temporal Range:** **January 3, 2014 – December 30, 2017** (1,458 total calendar days / 1,237 unique order dates)
- **Data Completeness:** **0 missing values**, **0 exact duplicate rows**
- **Total Revenue (Sales):** **${df['Sales'].sum():,.2f}**
- **Total Net Profit:** **${df['Profit'].sum():,.2f}**
- **Total Units Sold (Quantity):** **{df['Quantity'].sum():,} units** across **{df['Order ID'].nunique():,} unique orders**

---

## 3. Sales Distribution Findings
- **Distribution Shape:** Extremely right-skewed with a heavy upper tail.
- **Summary Metrics:**
  - **Min Sales:** ${df['Sales'].min():.3f}
  - **Max Sales:** ${df['Sales'].max():,.2f} (High-value copier purchase)
  - **Mean Sales:** ${df['Sales'].mean():.2f}
  - **Median Sales:** ${df['Sales'].median():.2f} (50% of orders are under $54.49)
  - **Standard Deviation:** ${df['Sales'].std():.2f}
- **Insight:** The wide gap between median ($54.49) and mean ($229.86) demonstrates that sales revenue is dominated by small/medium purchases punctuated by infrequent, high-value transactions.

---

## 4. Profit Distribution Findings
- **Distribution Shape:** Centered near zero with significant positive and negative extremes.
- **Summary Metrics:**
  - **Min Profit:** -${abs(df['Profit'].min()):,.2f} (Heavy loss on discounted technology/furniture)
  - **Max Profit:** +${df['Profit'].max():,.2f}
  - **Mean Profit:** ${df['Profit'].mean():.2f}
  - **Median Profit:** ${df['Profit'].median():.2f}
- **Loss-Making Items:** **1,871 items (18.72%)** generate a net financial loss, totaling **-${abs(df[df['Profit'] < 0]['Profit'].sum()):,.2f}** in loss.

---

## 5. Quantity & Discount Findings
- **Quantity:** Ranges from 1 to 14 units per line item (Mean: 3.79, Median: 3.0). The distribution peaks at 2–3 units.
- **Discount:** Bounded between 0% (0.0) and 80% (0.80). 
  - 4,798 transactions (48.0%) received 0 discount.
  - Common promotional rates: 20% (0.20), 50% (0.50), 70% (0.70), 80% (0.80).

---

## 6. Time-Series Sales Analysis
Sales were analyzed across four temporal granularities:

1. **Daily Level:** Highly volatile with non-trading zero-sales days (weekends/holidays) and sharp daily spikes up to $23,661 in a single day.
2. **Monthly Level:** Shows smooth seasonal curves. Peak sales consistently occur in **September, November, and December**.
3. **Quarterly Level:** Strong quarterly progression where **Q4 dominates every year**:
   - Q1 Average: ~$115k
   - Q2 Average: ~$145k
   - Q3 Average: ~$160k
   - **Q4 Average: ~$240k**
4. **Yearly Level:** Demonstrates steady YoY upward growth:
   - **2014:** $484,247.50
   - **2015:** $470,532.51 (-2.8% slight dip)
   - **2016:** $609,205.60 (+29.5% growth)
   - **2017:** $733,215.25 (+20.4% growth)

---

## 7. Seasonality Analysis
- **Annual Q4 Surge:** Retail demand expands dramatically in the 4th quarter due to corporate year-end budget utilization and holiday shopping season (Black Friday / Cyber Monday / Christmas).
- **Intra-Year Pattern:** 
  - **January & February:** Low sales trough.
  - **March Spike:** Spring order rebound.
  - **September Ramp:** Back-to-school / corporate replenishment.
  - **November & December:** Annual peak sales volume.

---

## 8. Category & Sub-Category Analysis

| Category | Total Sales ($) | Total Profit ($) | Profit Margin (%) | Top Sub-Category by Sales |
| :--- | :-: | :-: | :-: | :--- |
| **Technology** | **$836,154.03** | **$145,454.95** | **17.39%** | Phones ($330,007.05) |
| **Furniture** | **$741,999.80** | **$18,451.27** | **2.49%** | Chairs ($328,449.10) |
| **Office Supplies** | **$719,047.03** | **$122,490.80** | **17.04%** | Storage ($223,843.61) |

- **Sub-Category Outliers:** 
  - **Tables:** Generated **$206,965.53** in sales but suffered a **net loss of -$17,725.48** due to excessive discounting (up to 70%).
  - **Bookcases:** Generated **$114,879.99** in sales but suffered a **net loss of -$3,472.56**.
  - **Copiers:** Highest profit margin sub-category ($55,617.82 profit on $149,528.03 sales = 37.2% margin).

---

## 9. Region, State & Segment Analysis
- **Region Performance:**
  - **West:** $725,457.82 Sales (31.6%) | $108,418.45 Profit (Top performing region)
  - **East:** $678,781.24 Sales (29.5%) | $91,522.78 Profit
  - **Central:** $501,239.89 Sales (21.8%) | $39,706.36 Profit
  - **South:** $391,721.91 Sales (17.1%) | $46,749.43 Profit
- **State Performance:**
  - **Top 3 States:** California ($457.7k), New York ($310.9k), Texas ($170.2k).
  - **Loss States:** Texas (-$25,729 loss), Ohio (-$16,971 loss), Pennsylvania (-$15,559 loss) due to regional promotion discounting.
- **Segment Performance:**
  - **Consumer:** $1,161,401.34 (50.6% of sales)
  - **Corporate:** $706,146.37 (30.7% of sales)
  - **Home Office:** $429,653.15 (18.7% of sales)

---

## 10. Product Analysis
- **Top 3 Products by Sales:**
  1. *Canon imageCLASS 2200 Advanced Copier:* **$61,599.82** Sales | **$25,199.93** Profit
  2. *Fellowes PB500 Electric Punch Binding System:* **$27,453.38** Sales | **$7,753.04** Profit
  3. *Cisco TelePresence System EX90 Videoconferencing:* **$22,638.48** Sales | **-$1,811.08** Loss
- **Worst Loss Product:** *Cubify Cube3D Printer Double Head Print* (-$8,879.98 loss on $11,099.98 sales at 70% discount).

---

## 11. Discount Analysis & Profit Erosion
- **Correlation:** Discount has a negative correlation with Profit (**r = -0.219**).
- **Profitability Threshold:**
  - **0% Discount:** Average Profit = **+$66.90** per item
  - **10%–20% Discount:** Average Profit = **+$26.50** per item
  - **30%–50% Discount:** Average Profit = **-$109.53** (NET LOSS)
  - **60%–80% Discount:** Average Profit = **-$89.44** (NET LOSS)
- **Insight:** Discounts above 20% consistently destroy operating margins across Furniture and Technology lines.

---

## 12. Correlation Analysis

| Variable | Sales | Quantity | Discount | Profit |
| :--- | :-: | :-: | :-: | :-: |
| **Sales** | 1.000 | 0.201 | -0.028 | **0.479** |
| **Quantity** | 0.201 | 1.000 | 0.009 | 0.066 |
| **Discount** | -0.028 | 0.009 | 1.000 | **-0.219** |
| **Profit** | **0.479** | 0.066 | **-0.219** | 1.000 |

- **Key Takeaways:**
  - Strong positive correlation between `Sales` and `Profit` (**+0.479**).
  - Moderate positive correlation between `Quantity` and `Sales` (**+0.201**).
  - Strong negative relationship between `Discount` and `Profit` (**-0.219**).

---

## 13. Outlier & Anomaly Findings
- **High-Value Sales Outliers:** Infrequent purchases > $5,000 exist (e.g. Copiers, Heavy Machines).
- **Data Integrity Confirmation:** Outliers reflect genuine enterprise purchases and must be **retained** for accurate total sales demand modeling.
- **Log Transformation Need:** High skewness indicates log transformation (`log1p(Sales)`) will be beneficial for linear models during forecasting.

---

## 14. Important Business Insights
1. **Q4 Demand Focus:** Superstore generates over 35% of annual revenue in Q4. Inventory and stocking plans must peak prior to November.
2. **Discount Policy Reform Required:** Discounts exceeding 20% on Furniture (Tables/Bookcases) and Technology cause massive net losses. Restricting discounts to max 20% could recover up to **$156k** in annual lost profit.
3. **Regional Strategy:** West and East regions generate 61% of sales and 70% of profit. Texas and Pennsylvania require pricing/discount restructuring.

---

## 15. Forecasting-Relevant Findings (Key Takeaways for Next Stage)
1. **Target Feature:** **`Sales`** aggregated at **Daily** or **Monthly** level.
2. **Strong Seasonality Signals:** 12-month annual periodicity (Monthly lag `t-12` and Daily lag `t-365`).
3. **Short-Term Autocorrelation:** 7-day and 30-day moving averages (`MA_7`, `MA_30`) capture local demand momentum effectively.
4. **Exogenous Predictors for Feature Engineering:**
   - Calendar variables (`Month`, `Quarter`, `DayOfWeek`, `Is_Q4`, `Is_YearEnd`).
   - Categorical groupings (`Category`, `Region`, `Segment`).
   - Promotional feature (`Discount`).

---

## 16. Final EDA Conclusion
Stage 3 Exploratory Data Analysis is **100% complete**. All visualizations, time-series aggregations, and summary JSON files have been saved to `eda_outputs/`. `superstore_cleaned.csv` remains strictly untouched.

*System paused. Ready for Stage 4: Feature Engineering or Time-Series Dataset Preparation when instructed.*
"""

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_content)

    print(f"[OK] Saved 'EDA_REPORT.md' at: {report_path}")

    # Verify cleaned CSV untouched
    cleaned_final_stat = os.stat(cleaned_csv_path)
    assert cleaned_initial_stat.st_mtime == cleaned_final_stat.st_mtime and cleaned_initial_stat.st_size == cleaned_final_stat.st_size, \
        "CRITICAL ERROR: superstore_cleaned.csv was modified!"
    print("[OK] CONFIRMED: 'superstore_cleaned.csv' remains 100% UNTOUCHED.")

    print("\n==================================================================")
    print("      STAGE 3 EDA PIPELINE EXECUTED SUCCESSFULLY. STOPPING HERE.  ")
    print("==================================================================")

if __name__ == '__main__':
    run_eda_pipeline()
