import {PriceEpsData} from "./PriceEpsData";
import {PriceEpsDataRaw} from "./PriceEpsDataRaw";

export interface StockInfo {
    id?: String,
    date?: String,
    symbol?: String,
    exchange?: String,
    companyName?: String,
    price?: String,
    change?: String,
    enterpriseValue?: String,
    totalCashPerShare?: String,
    totalCashPerSharePercent?: String,
    totalDebtEquity?: String,
    trailingPE?: String,
    forwardPE?: String,
    priceToSalesTrailing12Months?: String,
    priceBook?: String,
    enterpriseValueRevenue?: String,
    enterpriseValueEBITDA?: String,
    quarterlyRevenueGrowth?: String,
    quarterlyEarningsGrowth?: String,
    priceEarningGrowth?: String,
    trailingPriceEarningGrowth?: String,
    week52Change?: String,
    week52Low?: String,
    week52AboveLowPercent?: String,
    week52High?: String,
    week52BelowHighPercent?: String,
    exDividendDate?: String,
    fiveYearAvgDividendYield?: String,
    trailingAnnualDividendYield?: String,
    periodValuationMeasures?: String,
    chartData?: PriceEpsDataRaw[],
}