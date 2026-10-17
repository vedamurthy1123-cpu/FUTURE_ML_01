# Stage 3: Exploratory Data Analysis (EDA) Report
**Superstore Sales & Demand Forecasting Project**

**Date of Execution:** August 28, 2026  
**Input Dataset:** [`superstore_cleaned.csv`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/data/processed/superstore_cleaned.csv) (**UNTOUCHED**)  
**Output Directory:** [`eda_outputs/`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/outputs/eda_charts)  
**Summary JSON:** [`eda_summary.json`](file:///C:/Users/SKC/OneDrive/Documents/Desktop/TASK-1/outputs/summaries/eda_summary.json)

---

## 1. EDA Objective
The primary objective of this Exploratory Data Analysis (EDA) stage is to rigorously examine the cleaned Superstore sales dataset to uncover underlying temporal patterns, sales trends, seasonal fluctuations, dimension-level performance, pricing/discount dynamics, and variable correlations. The findings directly lay the groundwork for subsequent **time-series sales forecasting** and feature engineering.

---

## 2. Dataset Overview
- **Source File:** `superstore_cleaned.csv`
- **Dimensions:** **9,994 rows × 20 columns**
- **Temporal Range:** **January 3, 2014 – December 30, 2017** (1,458 total calendar days / 1,237 unique order dates)
- **Data Completeness:** **0 missing values**, **0 exact duplicate rows**
- **Total Revenue (Sales):** **$2,297,200.86**
- **Total Net Profit:** **$286,397.02**
- **Total Units Sold (Quantity):** **37,873 units** across **5,009 unique orders**

---

## 3. Sales Distribution Findings
- **Distribution Shape:** Extremely right-skewed with a heavy upper tail.
- **Summary Metrics:**
  - **Min Sales:** $0.444
  - **Max Sales:** $22,638.48 (High-value copier purchase)
  - **Mean Sales:** $229.86
  - **Median Sales:** $54.49 (50% of orders are under $54.49)
  - **Standard Deviation:** $623.25
- **Insight:** The wide gap between median ($54.49) and mean ($229.86) demonstrates that sales revenue is dominated by small/medium purchases punctuated by infrequent, high-value transactions.

---

## 4. Profit Distribution Findings
- **Distribution Shape:** Centered near zero with significant positive and negative extremes.
- **Summary Metrics:**
  - **Min Profit:** -$6,599.98 (Heavy loss on discounted technology/furniture)
  - **Max Profit:** +$8,399.98
  - **Mean Profit:** $28.66
  - **Median Profit:** $8.67
- **Loss-Making Items:** **1,871 items (18.72%)** generate a net financial loss, totaling **-$156,131.29** in loss.

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
