/**
 * Stock field after timelines are flattened
 */
export enum StockFields {
    symbol,
    chartLastUpdated,
    financialsLastUpdated,
    analysisLastUpdated,
    statisticsLastUpdated,
    holdersLastUpdated,
    krfLastUpdated,
    lastReportedQuarter,
    companyName,
    change,
    currentPrice,
    enterpriseValue,
    totalCashPerShareP,
    trailingPE,
    forwardPE,
    priceToSalesTrailing12Months,
    currentPriceToFreeCashFlow,
    priceToFreeCashFlow,
    priceBook,
    enterpriseValueRevenue,
    enterpriseValueEBITDA,
    priceEarningGrowth,
    trailingPriceEarningGrowth,
    week52ChangeP,
    week52AboveLowP,
    week52BelowHighP,
    targetLowPrice,
    belowTargetLowPriceP,
    targetMedianPrice,
    belowTargetMedianPriceP,
    heldByInsidersP,
    heldByInstitutionsP,
    buyPercentInsiderShares,
    sellPercentInsiderShares,
    shortToFloatP,
    sharesShortPrevMonthCompareP,
    exDividendDate,
    fiveYearAvgDividendYield,
    trailingAnnualDividendYield,
    payoutRatioP,
    dividendsGrowth1,
    dividendsGrowth2,
    dividendsGrowth3,

    epsQ1,
    epsQ2,
    eps1,
    eps2,
    eps3,
    epsGrowthQ1,
    epsGrowthQ2,
    epsGrowth1,
    epsGrowth2,
    epsGrowth3,
    bookValuePerShare1,
    bookValuePerShare2,
    bookValuePerShare3,
    bookValuePerShareGrowth1,
    bookValuePerShareGrowth2,
    bookValuePerShareGrowth3,
    freeCashFlowPerShare1,
    freeCashFlowPerShare2,
    freeCashFlowPerShare3,
    freeCashFlowPerShareGrowth1,
    freeCashFlowPerShareGrowth2,
    freeCashFlowPerShareGrowth3,
    peQ1,
    peQ2,
    pe1,
    pe2,
    pe3,
    peGrowthQ1,
    peGrowthQ2,
    peGrowth1,
    peGrowth2,
    peGrowth3,

    revenueQ1,
    revenueQ2,
    revenue1,
    revenue2,
    revenue3,
    revenueGrowthQ1,
    revenueGrowthQ2,
    revenueGrowth1,
    revenueGrowth2,
    revenueGrowth3,
    grossIncomeQ1,
    grossIncomeQ2,
    grossIncome1,
    grossIncome2,
    grossIncome3,
    grossIncomeGrowthQ1,
    grossIncomeGrowthQ2,
    grossIncomeGrowth1,
    grossIncomeGrowth2,
    grossIncomeGrowth3,
    grossMargin1,
    grossMargin2,
    grossMargin3,
    grossMarginGrowth1,
    grossMarginGrowth2,
    grossMarginGrowth3,
    ebitQ1,
    ebitQ2,
    ebit1,
    ebit2,
    ebit3,
    ebitGrowthQ1,
    ebitGrowthQ2,
    ebitGrowth1,
    ebitGrowth2,
    ebitGrowth3,
    interestExpenseToOperativeIncomePQ1,
    interestExpenseToOperativeIncomePQ2,
    interestExpenseToOperativeIncomeP1,
    interestExpenseToOperativeIncomeP2,
    interestExpenseToOperativeIncomeP3,
    interestExpenseToOperativeIncomeGrowthQ1,
    interestExpenseToOperativeIncomeGrowthQ2,
    interestExpenseToOperativeIncomeGrowth1,
    interestExpenseToOperativeIncomeGrowth2,
    interestExpenseToOperativeIncomeGrowth3,
    operatingMargin1,
    operatingMargin2,
    operatingMargin3,
    operatingMarginGrowth1,
    operatingMarginGrowth2,
    operatingMarginGrowth3,
    netIncomeQ1,
    netIncomeQ2,
    netIncome1,
    netIncome2,
    netIncome3,
    netIncomeGrowthQ1,
    netIncomeGrowthQ2,
    netIncomeGrowth1,
    netIncomeGrowth2,
    netIncomeGrowth3,
    profitMarginPQ1,
    profitMarginPQ2,
    profitMarginP1,
    profitMarginP2,
    profitMarginP3,
    profitMarginGrowthQ1,
    profitMarginGrowthQ2,
    profitMarginGrowth1,
    profitMarginGrowth2,
    profitMarginGrowth3,
    operatingCashFlow1,
    operatingCashFlow2,
    operatingCashFlow3,
    operatingCashFlowGrowth1,
    operatingCashFlowGrowth2,
    operatingCashFlowGrowth3,
    freeCashFlowQ1,
    freeCashFlowQ2,
    freeCashFlow1,
    freeCashFlow2,
    freeCashFlow3,
    freeCashFlowGrowthQ1,
    freeCashFlowGrowthQ2,
    freeCashFlowGrowth1,
    freeCashFlowGrowth2,
    freeCashFlowGrowth3,
    cashQ1,
    cashQ2,
    cash1,
    cash2,
    cash3,
    cashGrowthQ1,
    cashGrowthQ2,
    cashGrowth1,
    cashGrowth2,
    cashGrowth3,
    inventoryQ1,
    inventoryQ2,
    inventory1,
    inventory2,
    inventory3,
    inventoryGrowthQ1,
    inventoryGrowthQ2,
    inventoryGrowth1,
    inventoryGrowth2,
    inventoryGrowth3,
    workingCapitalQ1,
    workingCapitalQ2,
    workingCapital1,
    workingCapital2,
    workingCapital3,
    workingCapitalGrowthQ1,
    workingCapitalGrowthQ2,
    workingCapitalGrowth1,
    workingCapitalGrowth2,
    workingCapitalGrowth3,
    currentRatioQ1,
    currentRatioQ2,
    currentRatio1,
    currentRatio2,
    currentRatio3,
    currentRatioGrowthQ1,
    currentRatioGrowthQ2,
    currentRatioGrowth1,
    currentRatioGrowth2,
    currentRatioGrowth3,
    totalLiabilitiesQ1,
    totalLiabilitiesQ2,
    totalDebtToEquityQ1,
    totalDebtToEquityQ2,
    totalDebtToEquity1,
    totalDebtToEquity2,
    totalDebtToEquity3,
    totalDebtToEquityGrowthQ1,
    totalDebtToEquityGrowthQ2,
    totalDebtToEquityGrowth1,
    totalDebtToEquityGrowth2,
    totalDebtToEquityGrowth3,
    nonCurrentLiabilitiesToIncomeQ1,
    nonCurrentLiabilitiesToIncomeQ2,
    nonCurrentLiabilitiesToIncome1,
    nonCurrentLiabilitiesToIncome2,
    nonCurrentLiabilitiesToIncome3,
    nonCurrentLiabilitiesToIncomeGrowthQ1,
    nonCurrentLiabilitiesToIncomeGrowthQ2,
    nonCurrentLiabilitiesToIncomeGrowth1,
    nonCurrentLiabilitiesToIncomeGrowth2,
    nonCurrentLiabilitiesToIncomeGrowth3,
    totalAssetsQ1,
    totalAssetsQ2,
    totalAssets1,
    totalAssets2,
    totalAssets3,
    totalAssetsGrowthQ1,
    totalAssetsGrowthQ2,
    totalAssetsGrowth1,
    totalAssetsGrowth2,
    totalAssetsGrowth3,
    totalShareholdersEquityQ1,
    totalShareholdersEquityQ2,
    totalShareholdersEquity1,
    totalShareholdersEquity2,
    totalShareholdersEquity3,
    totalShareholdersEquityGrowthQ1,
    totalShareholdersEquityGrowthQ2,
    totalShareholdersEquityGrowth1,
    totalShareholdersEquityGrowth2,
    totalShareholdersEquityGrowth3,
    stockRepurchasedQ1,
    stockRepurchasedQ2,
    stockRepurchased1,
    stockRepurchased2,
    stockRepurchased3,
    stockRepurchasedGrowthQ1,
    stockRepurchasedGrowthQ2,
    stockRepurchasedGrowth1,
    stockRepurchasedGrowth2,
    stockRepurchasedGrowth3,
    shares1,
    shares2,
    shares3,
    sharesGrowth1,
    sharesGrowth2,
    sharesGrowth3,
    roicP1,
    roicP2,
    roicP3,

    growthEstimate5y,
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
    futureEPS10Years,
    futurePrice10Years,
    stickerPrice15pcGrowth,
    stickerPrice5pcGrowth,
    belowStickerPrice15P,
    belowStickerPrice5P,
    price,

    score,
    yieldNext5Years,
    yieldNext10Years,
    score1Q,
    score2Q,
    score1Y,
    score4Y,
    scoreRatios,
    scoreStock,
    scoreDividends,
    scoreAnalysts,
    rule1score,
    valueInvestmentScore,
    growthInvestmentScore,
}