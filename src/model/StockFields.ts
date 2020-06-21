export enum StockFields {
    date,
    lastReportedQuarter,
    symbol,
    companyName,
    price,
    change,

    enterpriseValue,
    // totalCashPerShare,
    totalCashPerSharePercent,
    totalDebtEquity,

    trailingPE,
    forwardPE,
    priceToSalesTrailing12Months,
    priceBook,
    enterpriseValueRevenue,
    enterpriseValueEBITDA,

    priceEarningGrowth,
    trailingPriceEarningGrowth,

    week52Change,
    // week52Low,
    week52AboveLowPercent,
    // week52High,
    week52BelowHighPercent,

    // targetLowPrice,
    belowTargetLowPricePercent,
    // targetMedianPrice,
    belowTargetMedianPricePercent,

    heldByInsiders,
    heldByInstitutions,
    shortToFloat,
    sharesShortPrevMonthCompare,

    exDividendDate,
    fiveYearAvgDividendYield,
    trailingAnnualDividendYield,
    payoutRatio,

    revenueLastQuarter,
    revenue2QuartersAgo,
    revenue3QuartersAgo,
    revenueLastYear,
    revenue2YearsAgo,
    revenue4YearsAgo,

    revenueGrowthLastQuarter,
    revenueGrowthLast2Quarters,
    revenueGrowthLastYear,
    revenueGrowthLast4Years,


    grossIncomeLastQuarter,
    grossIncome2QuartersAgo,
    grossIncome3QuartersAgo,
    grossIncomeLastYear,
    grossIncome2YearsAgo,
    grossIncome4YearsAgo,

    grossIncomeGrowthLastQuarter,
    grossIncomeGrowthLast2Quarters,
    grossIncomeGrowthLastYear,
    grossIncomeGrowthLast4Years,


    ebitLastQuarter,
    ebit2QuartersAgo,
    ebit3QuartersAgo,
    ebitLastYear,
    ebit2YearsAgo,
    ebit4YearsAgo,

    ebitGrowthLastQuarter,
    ebitGrowthLast2Quarters,
    ebitGrowthLastYear,
    ebitGrowthLast4Years,


    netIncomeLastQuarter,
    netIncome2QuartersAgo,
    netIncome3QuartersAgo,
    netIncomeLastYear,
    netIncome2YearsAgo,
    netIncome4YearsAgo,

    netIncomeGrowthLastQuarter,
    netIncomeGrowthLast2Quarters,
    netIncomeGrowthLastYear,
    netIncomeGrowthLast4Years,


    freeCashFlowLastQuarter,
    freeCashFlow2QuartersAgo,
    freeCashFlow3QuartersAgo,
    freeCashFlowLastYear,
    freeCashFlow2YearsAgo,
    freeCashFlow4YearsAgo,

    freeCashFlowGrowthLastQuarter,
    freeCashFlowGrowthLast2Quarters,
    freeCashFlowGrowthLastYear,
    freeCashFlowGrowthLast4Years,


    cashLastQuarter,
    cash2QuartersAgo,
    cash3QuartersAgo,
    cashLastYear,
    cash2YearsAgo,
    cash4YearsAgo,

    cashGrowthLastQuarter,
    cashGrowthLast2Quarters,
    cashGrowthLastYear,
    cashGrowthLast4Years,

    inventoryLastQuarter,
    inventory2QuartersAgo,
    inventory3QuartersAgo,
    inventoryLastYear,
    inventory2YearsAgo,
    inventory4YearsAgo,

    inventoryGrowthLastQuarter,
    inventoryGrowthLast2Quarters,
    inventoryGrowthLastYear,
    inventoryGrowthLast4Years,


    totalLiabilitiesLastQuarter,
    totalLiabilities2QuartersAgo,
    totalLiabilities3QuartersAgo,
    totalLiabilitiesLastYear,
    totalLiabilities2YearsAgo,
    totalLiabilities3YearsAgo,
    totalLiabilities4YearsAgo,

    totalLiabilitiesGrowthLastQuarter,
    totalLiabilitiesGrowthLast2Quarters,
    totalLiabilitiesGrowthLastYear,
    totalLiabilitiesGrowthLast4Years,


    totalShareholdersEquityLastQuarter,
    totalShareholdersEquity2QuartersAgo,
    totalShareholdersEquity3QuartersAgo,
    totalShareholdersEquityLastYear,
    totalShareholdersEquity2YearsAgo,
    totalShareholdersEquity4YearsAgo,

    totalShareholdersEquityGrowthLastQuarter,
    totalShareholdersEquityGrowthLast2Quarters,
    totalShareholdersEquityGrowthLastYear,
    totalShareholdersEquityGrowthLast4Years,


    totalLiabilitiesToEquityLastQuarter,
    totalLiabilitiesToEquity2QuartersAgo,
    totalLiabilitiesToEquity3QuartersAgo,
    totalLiabilitiesToEquityLastYear,
    totalLiabilitiesToEquity2YearsAgo,
    totalLiabilitiesToEquity4YearsAgo,

    totalLiabilitiesToEquityGrowthLastQuarter,
    totalLiabilitiesToEquityGrowthLast2Quarters,
    totalLiabilitiesToEquityGrowthLastYear,
    totalLiabilitiesToEquityGrowthLast4Years,


    stockRepurchasedLastQuarter,
    stockRepurchased2QuartersAgo,
    stockRepurchased3QuartersAgo,
    stockRepurchasedLastYear,
    stockRepurchased2YearsAgo,
    stockRepurchased4YearsAgo,

    stockRepurchasedGrowthLastQuarter,
    stockRepurchasedGrowthLast2Quarters,
    stockRepurchasedGrowthLastYear,
    stockRepurchasedGrowthLast4Years,


    stockLastQuarter,
    stock2QuartersAgo,
    stock3QuartersAgo,
    stockLastYear,
    stock2YearsAgo,
    stock4YearsAgo,

    stockGrowthLastQuarter,
    stockGrowthLast2Quarters,
    stockGrowthLastYear,
    stockGrowthLast4Years,


    epsCurrentQuarterEstimate,
    epsLastQuarter,
    eps2QuartersAgo,
    eps3QuartersAgo,
    eps4QuartersAgo,
    epsLastYear,
    eps2YearsAgo,
    eps3YearsAgo,
    eps4YearsAgo,

    epsGrowthLastQuarter,
    epsGrowthLast2Quarters,
    epsGrowthLastYear,
    epsGrowthLast4Years,

    // priceLastQuarter,
    // price2QuartersAgo,
    // price3QuartersAgo,
    // price4QuartersAgo,
    // priceGrowthLastQuarter,
    // priceGrowthLast2Quarters,
    // priceGrowthLast3Quarters,

    peLastQuarter,
    pe2QuartersAgo,
    pe3QuartersAgo,
    pe4QuartersAgo,
    peGrowthLastQuarter,
    peGrowthLast2Quarters,
    peGrowthLast3Quarters,

    growthEstimate5y,

    //Rule 1 calc

    roic1Y,
    roic3Y,

    revenue1Y,
    revenue3Y,
    revenue5Y,
    revenue9Y,

    eps1Y,
    eps3Y,
    eps5Y,
    eps9Y,

    bps1Y,
    bps3Y,
    bps5Y,
    bps9Y,

    //free cash flow
    cash1Y,
    cash3Y,
    cash5Y,
    cash9Y,

    pe1Y,
    pe3Y,
    pe5Y,
    pe9Y,

    rule1GrowthRate,
    defaultPE,
    historicalPE,
    rule1PE,
    currentEps,
    // futureEPS10Years,
    futurePrice10Years,

    stickerPrice15pcGrowth,
    // stickerPrice10pcGrowth,
    stickerPrice5pcGrowth,

    belowStickerPrice15pc,
    // belowStickerPrice10pc,
    belowStickerPrice5pc,

    chartData,

    score,
    rule1score,
}