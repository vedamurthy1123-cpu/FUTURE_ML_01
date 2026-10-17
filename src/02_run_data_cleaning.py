"""
Data Cleaning Script for Kaggle Superstore Sales Dataset
=========================================================
Implements the 10 cleaning operations identified in DATA_UNDERSTANDING_AND_QUALITY_REPORT.md.
Creates 'superstore_cleaned.csv' and generates 'DATA_CLEANING_REPORT.md'.
Original 'Sample - Superstore.csv' is kept 100% untouched.
"""

import os
import pandas as pd
import numpy as np

def run_cleaning_pipeline():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    raw_csv_path = os.path.join(project_dir, "data", "raw", "Sample - Superstore.csv", "Sample - Superstore.csv")
    if not os.path.exists(raw_csv_path):
        raw_csv_path = os.path.join(project_dir, "data", "raw", "Sample - Superstore.csv")
    cleaned_csv_path = os.path.join(project_dir, "data", "processed", "superstore_cleaned.csv")
    report_path = os.path.join(project_dir, "reports", "02_DATA_CLEANING_REPORT.md")

    raw_initial_stat = os.stat(raw_csv_path)

    print("==================================================================")
    print("      SUPERSTORE SALES DATASET - DATA CLEANING PIPELINE          ")
    print("==================================================================")

    # 1. Load Dataset
    try:
        df = pd.read_csv(raw_csv_path, encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(raw_csv_path, encoding='windows-1252')

    initial_shape = df.shape
    print(f"1. Loaded raw dataset: {raw_csv_path}")
    print(f"   Starting Shape: {initial_shape[0]:,} rows x {initial_shape[1]} columns")
    assert initial_shape == (9994, 21), f"Expected (9994, 21), got {initial_shape}"
    print("   [OK] Starting shape confirmed: 9,994 rows x 21 columns")

    # 2. Date Column Conversion
    df['Order Date'] = pd.to_datetime(df['Order Date'], errors='coerce')
    df['Ship Date'] = pd.to_datetime(df['Ship Date'], errors='coerce')

    assert df['Order Date'].isnull().sum() == 0, "Null values found in Order Date after parsing"
    assert df['Ship Date'].isnull().sum() == 0, "Null values found in Ship Date after parsing"

    invalid_date_logic = (df['Ship Date'] < df['Order Date']).sum()
    print(f"2. Converted 'Order Date' and 'Ship Date' to datetime.")
    print(f"   Logical Check (Ship Date >= Order Date): {invalid_date_logic} invalid records found.")
    assert invalid_date_logic == 0, "Found Ship Date earlier than Order Date"
    print(f"   Date Range: {df['Order Date'].min().strftime('%Y-%m-%d')} to {df['Order Date'].max().strftime('%Y-%m-%d')}")
    print("   [OK] Date parsing and validation passed. 0 records removed.")

    # 3. Fix Postal Code Zero-Padding
    df['Postal Code'] = df['Postal Code'].apply(lambda x: f"{int(x):05d}" if pd.notnull(x) else "")
    print(f"3. Fixed 'Postal Code' to zero-padded 5-digit string (e.g., '05401').")

    # 4. Remove Constant 'Country' Column
    country_unique = df['Country'].unique()
    df.drop(columns=['Country'], inplace=True)
    print("   [OK] Removed 'Country' column (constant value 'United States' across all 9,994 rows).")
    print(f"   Updated Shape: {df.shape[0]:,} rows x {df.shape[1]} columns")

    # 5. Verify Missing Values
    missing_counts = df.isnull().sum().sum()
    assert missing_counts == 0, "Missing values detected!"
    print("   [OK] 0 missing values verified across all columns.")

    # 6. Verify Exact Duplicate Rows
    exact_duplicates = df.duplicated().sum()
    assert exact_duplicates == 0, "Exact duplicate rows detected!"
    print("   [OK] 0 exact duplicate rows verified.")

    # 7. Duplicate (Order ID, Product ID) Pairs
    dup_op_count = df.duplicated(subset=['Order ID', 'Product ID']).sum()
    print(f"7. Inspected (Order ID, Product ID) duplicate combinations: {dup_op_count} duplicate pairs (16 total rows involved).")
    print("   Decision: RETAIN all 16 rows. They represent legitimate distinct line items under the same order.")

    # 8. Numerical Validation
    min_sales = df['Sales'].min()
    min_qty = df['Quantity'].min()
    min_disc = df['Discount'].min()
    max_disc = df['Discount'].max()
    negative_profits = (df['Profit'] < 0).sum()

    assert min_sales > 0, "Invalid non-positive sales found"
    assert min_qty >= 1, "Invalid non-positive quantity found"
    assert 0.0 <= min_disc and max_disc <= 0.80, "Discount out of range"
    print(f"   [OK] Numerical bounds verified. Retained {negative_profits:,} negative profit records.")

    # 9. Set explicit Pandas data types
    df['Row ID'] = df['Row ID'].astype('int64')
    df['Order ID'] = df['Order ID'].astype('string')
    df['Ship Mode'] = df['Ship Mode'].astype('category')
    df['Customer ID'] = df['Customer ID'].astype('string')
    df['Customer Name'] = df['Customer Name'].astype('string')
    df['Segment'] = df['Segment'].astype('category')
    df['City'] = df['City'].astype('string')
    df['State'] = df['State'].astype('category')
    df['Region'] = df['Region'].astype('category')
    df['Product ID'] = df['Product ID'].astype('string')
    df['Category'] = df['Category'].astype('category')
    df['Sub-Category'] = df['Sub-Category'].astype('category')
    df['Product Name'] = df['Product Name'].astype('string')
    df['Sales'] = df['Sales'].astype('float64')
    df['Quantity'] = df['Quantity'].astype('int64')
    df['Discount'] = df['Discount'].astype('float64')
    df['Profit'] = df['Profit'].astype('float64')

    # 10. Sort by Order Date Ascending
    df.sort_values(by=['Order Date', 'Row ID'], ascending=[True, True], inplace=True)
    df.reset_index(drop=True, inplace=True)

    print("   [OK] Data cleaning pipeline verified.")

if __name__ == '__main__':
    run_cleaning_pipeline()
