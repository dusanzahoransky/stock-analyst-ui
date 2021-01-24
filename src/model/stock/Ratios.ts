import {Stock} from "../Stock";
import {FundamentalsCell} from "../table/FundamentalsCell";
import {StockFields} from "./StockFields";
import {StockData} from "./StockData";

export interface RatiosFields extends StockFields {
    symbol: FundamentalsCell
    marketCap: FundamentalsCell
    enterpriseValue: FundamentalsCell
    totalCashPerShareP: FundamentalsCell
    trailingPE: FundamentalsCell
    forwardPE: FundamentalsCell
    priceToSalesTrailing12Months: FundamentalsCell
    priceBook: FundamentalsCell
    currentPriceToFreeCashFlow: FundamentalsCell
    priceToFreeCashFlow: FundamentalsCell
    enterpriseValueRevenue: FundamentalsCell
    enterpriseValueEBITDA: FundamentalsCell
    priceEarningGrowth: FundamentalsCell

    roicQ1: FundamentalsCell
    roicY1: FundamentalsCell
    roicGrowthQ1: FundamentalsCell
    roicGrowthQ2: FundamentalsCell
    roicGrowth1: FundamentalsCell
    roicGrowth2: FundamentalsCell
    roicGrowth3: FundamentalsCell

    roaQ1: FundamentalsCell
    roaY1: FundamentalsCell
    roaGrowthQ1: FundamentalsCell
    roaGrowthQ2: FundamentalsCell
    roaGrowth1: FundamentalsCell
    roaGrowth2: FundamentalsCell
    roaGrowth3: FundamentalsCell

    roeQ1: FundamentalsCell
    roeY1: FundamentalsCell
    roeGrowthQ1: FundamentalsCell
    roeGrowthQ2: FundamentalsCell
    roeGrowth1: FundamentalsCell
    roeGrowth2: FundamentalsCell
    roeGrowth3: FundamentalsCell

    currentRatioQ1: FundamentalsCell

    equityQ1: FundamentalsCell
    equity1: FundamentalsCell
    equityGrowthQ1: FundamentalsCell
    equityGrowthQ2: FundamentalsCell
    equityGrowth1: FundamentalsCell
    equityGrowth2: FundamentalsCell
    equityGrowth3: FundamentalsCell

    totalDebtToEquityQ1: FundamentalsCell
    totalDebtToEquity1: FundamentalsCell
    totalDebtToEquityGrowthQ1: FundamentalsCell
    totalDebtToEquityGrowthQ2: FundamentalsCell
    totalDebtToEquityGrowth1: FundamentalsCell
    totalDebtToEquityGrowth2: FundamentalsCell
    totalDebtToEquityGrowth3: FundamentalsCell

    nonCurrentLiabilitiesToIncomeQ1: FundamentalsCell
    nonCurrentLiabilitiesToIncome1: FundamentalsCell
    nonCurrentLiabilitiesToIncomeGrowthQ1: FundamentalsCell
    nonCurrentLiabilitiesToIncomeGrowthQ2: FundamentalsCell
    nonCurrentLiabilitiesToIncomeGrowth1: FundamentalsCell
    nonCurrentLiabilitiesToIncomeGrowth2: FundamentalsCell
    nonCurrentLiabilitiesToIncomeGrowth3: FundamentalsCell

    score: FundamentalsCell
}

export class Ratios extends StockData {

    headerData(): FundamentalsCell[] {
        return [];
    }

    labels(): string[] {
        return [
            'symbol',
            'marketCap',
            'EV',
            'totalCashPerShareP',
            'trailingPE',
            'forwardPE',
            'priceToSalesTrailing12Months',
            'priceBook',
            'currentQ PriceToFreeCashFlow',
            'priceToFreeCashFlow',
            'enterpriseValueRevenue',
            'enterpriseValueEBITDA',
            'priceEarningGrowth',

            'ROIC Q1',
            'ROIC Y1',
            'ROIC Q1g',
            'ROIC Q2g',
            'ROIC Y1g',
            'ROIC Y2g',
            'ROIC Y3g',

            'ROA Q1',
            'ROA Y1',
            'ROA Q1g',
            'ROA Q2g',
            'ROA Y1g',
            'ROA Y2g',
            'ROA Y3g',

            'ROE Q1',
            'ROE Y1',
            'ROE Q1g',
            'ROE Q2g',
            'ROE Y1g',
            'ROE Y2g',
            'ROE Y3g',

            'currentRatio Q1',

            'equity Q1',
            'equity Y1',
            'equity Q1g',
            'equity Q2g',
            'equity Y1g',
            'equity Y2g',
            'equity Y3g',

            'totalDebtToEquity Q1',
            'totalDebtToEquity Y1',
            'totalDebtToEquity Q1g',
            'totalDebtToEquity Q2g',
            'totalDebtToEquity 1Yg',
            'totalDebtToEquity 2Yg',
            'totalDebtToEquity 3Yg',

            'nonCurrentLiabilitiesToIncome Q1',
            'nonCurrentLiabilitiesToIncome Y1',
            'nonCurrentLiabilitiesToIncome Q1g',
            'nonCurrentLiabilitiesToIncome Q2g',
            'nonCurrentLiabilitiesToIncome Y1g',
            'nonCurrentLiabilitiesToIncome Y2g',
            'nonCurrentLiabilitiesToIncome Y3g',

            'Score'
        ]
    }

    fromStock(stock: Stock): RatiosFields {
        const ratiosFields = {
            symbol: StockData.toCell(stock.symbol, false, false, `Price: ${StockData.toTitle(StockData.lastEntry(stock.price))}`),
            marketCap: StockData.toCell(StockData.last(stock.marketCap)),
            enterpriseValue: StockData.toCell(StockData.last(stock.enterpriseValue), false),
            totalCashPerShareP: StockData.toCell(StockData.last(stock.totalCashPerShareP), true),
            trailingPE: StockData.toCell(StockData.last(stock.trailingPE), false),
            forwardPE: StockData.toCell(StockData.last(stock.forwardPE), false),
            priceToSalesTrailing12Months: StockData.toCell(StockData.last(stock.priceToSalesTrailing12Months), false),
            priceBook: StockData.toCell(StockData.last(stock.priceBook), false),
            currentPriceToFreeCashFlow: StockData.toCell(StockData.last(stock.currentPriceToFreeCashFlow), false),
            priceToFreeCashFlow: StockData.toCell(StockData.last(stock.priceToFreeCashFlow), false),
            enterpriseValueRevenue: StockData.toCell(StockData.last(stock.enterpriseValueRevenue), false),
            enterpriseValueEBITDA: StockData.toCell(StockData.last(stock.enterpriseValueEBITDA), false),
            priceEarningGrowth: StockData.toCell(StockData.last(stock.priceEarningGrowth), false),

            roicQ1: StockData.toCell(StockData.last(stock.roicPQ), false, false, StockData.toTitle(stock.roicPQ)),
            roicY1: StockData.toCell(StockData.last(stock.roicP), false, false, StockData.toTitle(stock.roicP)),
            roicGrowthQ1: StockData.toCell(StockData.last(stock.roicGrowthQ), true, true),
            roicGrowthQ2: StockData.toCell(StockData.last(stock.roicGrowthQ, 1), true, true),
            roicGrowth1: StockData.toCell(StockData.last(stock.roicGrowth), true, true),
            roicGrowth2: StockData.toCell(StockData.last(stock.roicGrowth, 1), true, true),
            roicGrowth3: StockData.toCell(StockData.last(stock.roicGrowth, 2), true, true),

            roaQ1: StockData.toCell(StockData.last(stock.roaPQ), false, false, StockData.toTitle(stock.roaPQ)),
            roaY1: StockData.toCell(StockData.last(stock.roaP), false, false, StockData.toTitle(stock.roaP)),
            roaGrowthQ1: StockData.toCell(StockData.last(stock.roaGrowthQ), true, true),
            roaGrowthQ2: StockData.toCell(StockData.last(stock.roaGrowthQ, 1), true, true),
            roaGrowth1: StockData.toCell(StockData.last(stock.roaGrowth), true, true),
            roaGrowth2: StockData.toCell(StockData.last(stock.roaGrowth, 1), true, true),
            roaGrowth3: StockData.toCell(StockData.last(stock.roaGrowth, 2), true, true),

            roeQ1: StockData.toCell(StockData.last(stock.roePQ), false, false, StockData.toTitle(stock.roePQ)),
            roeY1: StockData.toCell(StockData.last(stock.roeP), false, false, StockData.toTitle(stock.roeP)),
            roeGrowthQ1: StockData.toCell(StockData.last(stock.roeGrowthQ), true, true),
            roeGrowthQ2: StockData.toCell(StockData.last(stock.roeGrowthQ, 1), true, true),
            roeGrowth1: StockData.toCell(StockData.last(stock.roeGrowth), true, true),
            roeGrowth2: StockData.toCell(StockData.last(stock.roeGrowth, 1), true, true),
            roeGrowth3: StockData.toCell(StockData.last(stock.roeGrowth, 2), true, true),

            currentRatioQ1: StockData.toCell(StockData.last(stock.currentRatioQ), false),

            equityQ1: StockData.toCell(StockData.last(stock.totalShareholdersEquityQ), false, false, StockData.toTitle(stock.totalShareholdersEquityQ)),
            equity1: StockData.toCell(StockData.last(stock.totalShareholdersEquity), false, false, StockData.toTitle(stock.totalShareholdersEquity)),
            equityGrowthQ1: StockData.toCell(StockData.last(stock.totalShareholdersEquityGrowthQ), true, true),
            equityGrowthQ2: StockData.toCell(StockData.last(stock.totalShareholdersEquityGrowthQ, 1), true, true),
            equityGrowth1: StockData.toCell(StockData.last(stock.totalShareholdersEquityGrowth), true, true),
            equityGrowth2: StockData.toCell(StockData.last(stock.totalShareholdersEquityGrowth, 1), true, true),
            equityGrowth3: StockData.toCell(StockData.last(stock.totalShareholdersEquityGrowth, 2), true, true),

            totalDebtToEquityQ1: StockData.toCell(StockData.last(stock.totalDebtToEquityQ), false, false, StockData.toRatioTitle(stock.totalLiabilitiesQ, stock.totalShareholdersEquityQ, stock.totalDebtToEquityQ)),
            totalDebtToEquity1: StockData.toCell(StockData.last(stock.totalDebtToEquity), false, false, StockData.toRatioTitle(stock.totalLiabilities, stock.totalShareholdersEquity, stock.totalDebtToEquity)),
            totalDebtToEquityGrowthQ1: StockData.toCell(StockData.last(stock.totalDebtToEquityGrowthQ), true, true),
            totalDebtToEquityGrowthQ2: StockData.toCell(StockData.last(stock.totalDebtToEquityGrowthQ, 1), true, true),
            totalDebtToEquityGrowth1: StockData.toCell(StockData.last(stock.totalDebtToEquityGrowth), true, true),
            totalDebtToEquityGrowth2: StockData.toCell(StockData.last(stock.totalDebtToEquityGrowth, 1), true, true),
            totalDebtToEquityGrowth3: StockData.toCell(StockData.last(stock.totalDebtToEquityGrowth, 2), true, true),

            nonCurrentLiabilitiesToIncomeQ1: StockData.toCell(StockData.last(stock.nonCurrentLiabilitiesToIncomeQ), false, false, StockData.toTitle(stock.nonCurrentLiabilitiesToIncomeQ)),
            nonCurrentLiabilitiesToIncome1: StockData.toCell(StockData.last(stock.nonCurrentLiabilitiesToIncome), false, false, StockData.toTitle(stock.nonCurrentLiabilitiesToIncome)),
            nonCurrentLiabilitiesToIncomeGrowthQ1: StockData.toCell(StockData.last(stock.nonCurrentLiabilitiesToIncomeGrowthQ), true, true),
            nonCurrentLiabilitiesToIncomeGrowthQ2: StockData.toCell(StockData.last(stock.nonCurrentLiabilitiesToIncomeGrowthQ, 1), true, true),
            nonCurrentLiabilitiesToIncomeGrowth1: StockData.toCell(StockData.last(stock.nonCurrentLiabilitiesToIncomeGrowth), true, true),
            nonCurrentLiabilitiesToIncomeGrowth2: StockData.toCell(StockData.last(stock.nonCurrentLiabilitiesToIncomeGrowth, 1), true, true),
            nonCurrentLiabilitiesToIncomeGrowth3: StockData.toCell(StockData.last(stock.nonCurrentLiabilitiesToIncomeGrowth, 2), true, true),
            score: StockData.toCell(0),
        }


        ratiosFields.enterpriseValue.score = StockData.percentBelow(ratiosFields.enterpriseValue.value, ratiosFields.marketCap.value)
        ratiosFields.totalCashPerShareP.score = ratiosFields.totalCashPerShareP.value > 10 ? 0.1 * ratiosFields.totalCashPerShareP.value : 0
        ratiosFields.trailingPE.score = 3 * StockData.ratioBetterThan(ratiosFields.trailingPE.value, 20, 50)
        ratiosFields.forwardPE.score = 10 * StockData.ratioBetterThan(ratiosFields.forwardPE.value, 20, 50)
        ratiosFields.priceToSalesTrailing12Months.score = 3 * StockData.ratioBetterThan(ratiosFields.priceToSalesTrailing12Months.value, 6, 50)
        ratiosFields.priceBook.score = 2 * StockData.ratioBetterThan(ratiosFields.priceBook.value, 2, 50)
        ratiosFields.currentPriceToFreeCashFlow.score = 5 * StockData.ratioBetterThan(ratiosFields.currentPriceToFreeCashFlow.value, 15, 50)
        ratiosFields.priceToFreeCashFlow.score = 3 * StockData.ratioBetterThan(ratiosFields.priceToFreeCashFlow.value, 15, 50)
        ratiosFields.enterpriseValueRevenue.score = StockData.ratioBetterThan(ratiosFields.enterpriseValueRevenue.value, 5, 10)
        ratiosFields.enterpriseValueEBITDA.score = StockData.ratioBetterThan(ratiosFields.enterpriseValueEBITDA.value, 15, 20)
        ratiosFields.priceEarningGrowth.score = 25 * StockData.ratioBetterThan(ratiosFields.priceEarningGrowth.value, 5, 10)

        ratiosFields.roicQ1.score = 2 * ratiosFields.roicQ1.value
        ratiosFields.roicY1.score = 5 * ratiosFields.roicY1.value
        ratiosFields.roicGrowthQ1.score = StockData.last(stock.roicPQ, 0) * ratiosFields.roicGrowthQ1.value / 100 * 2
        ratiosFields.roicGrowthQ2.score = StockData.last(stock.roicPQ, 1) * ratiosFields.roicGrowthQ2.value / 100
        ratiosFields.roicGrowth1.score = StockData.last(stock.roicP, 0) * ratiosFields.roicGrowth1.value / 100 * 3
        ratiosFields.roicGrowth2.score = StockData.last(stock.roicP, 1) * ratiosFields.roicGrowth2.value / 100 * 2
        ratiosFields.roicGrowth3.score = StockData.last(stock.roicP, 2) * ratiosFields.roicGrowth3.value / 100

        ratiosFields.roaQ1.score = ratiosFields.roaQ1.value
        ratiosFields.roaY1.score = 2 * ratiosFields.roaY1.value
        ratiosFields.roaGrowthQ1.score = StockData.last(stock.roaPQ, 0) * ratiosFields.roaGrowthQ1.value / 100 * 2
        ratiosFields.roaGrowthQ2.score = StockData.last(stock.roaPQ, 1) * ratiosFields.roaGrowthQ2.value / 100
        ratiosFields.roaGrowth1.score = StockData.last(stock.roaP, 0) * ratiosFields.roaGrowth1.value / 100 * 3
        ratiosFields.roaGrowth2.score = StockData.last(stock.roaP, 1) * ratiosFields.roaGrowth2.value / 100 * 2
        ratiosFields.roaGrowth3.score = StockData.last(stock.roaP, 2) * ratiosFields.roaGrowth3.value / 100

        if (ratiosFields.totalDebtToEquity1.value > 3) {
            ratiosFields.roeQ1.classes.push(StockData.CLASS_ADDITIONAL_INFO)
            ratiosFields.roeY1.classes.push(StockData.CLASS_ADDITIONAL_INFO)
        }
        ratiosFields.roeQ1.score = ratiosFields.roeQ1.value
        ratiosFields.roeY1.score = 2 * ratiosFields.roeY1.value
        ratiosFields.roeGrowthQ1.score = StockData.last(stock.roePQ, 0) * ratiosFields.roeGrowthQ1.value / 100 * 2
        ratiosFields.roeGrowthQ2.score = StockData.last(stock.roePQ, 1) * ratiosFields.roeGrowthQ2.value / 100
        ratiosFields.roeGrowth1.score = StockData.last(stock.roeP, 0) * ratiosFields.roeGrowth1.value / 100 * 3
        ratiosFields.roeGrowth2.score = StockData.last(stock.roeP, 1) * ratiosFields.roeGrowth2.value / 100 * 2
        ratiosFields.roeGrowth3.score = StockData.last(stock.roeP, 2) * ratiosFields.roeGrowth3.value / 100


        if (ratiosFields.currentRatioQ1.value < 2) {
            ratiosFields.currentRatioQ1.score = (ratiosFields.currentRatioQ1.value - 2) * 100
        }
        if (ratiosFields.currentRatioQ1.value < 1.25) {
            ratiosFields.currentRatioQ1.classes.push(StockData.CLASS_ADDITIONAL_INFO)
        }

        ratiosFields.equityGrowthQ1.score = ratiosFields.equityGrowthQ1.value
        ratiosFields.equityGrowthQ2.score = ratiosFields.equityGrowthQ2.value
        ratiosFields.equityGrowth1.score = ratiosFields.equityGrowth1.value * 1.5
        ratiosFields.equityGrowth2.score = ratiosFields.equityGrowth2.value
        ratiosFields.equityGrowth3.score = ratiosFields.equityGrowth3.value * 0.5

        ratiosFields.totalDebtToEquityQ1.score = StockData.ratioBetterThan(ratiosFields.totalDebtToEquityQ1.value, 0.8, 10) * 20
        ratiosFields.totalDebtToEquity1.score = StockData.ratioBetterThan(ratiosFields.totalDebtToEquity1.value, 0.8, 10) * 50
        ratiosFields.totalDebtToEquityGrowthQ1.score = -StockData.last(stock.totalDebtToEquityQ, 0) * ratiosFields.totalDebtToEquityGrowthQ1.value * 2
        ratiosFields.totalDebtToEquityGrowthQ2.score = -StockData.last(stock.totalDebtToEquityQ, 1) * ratiosFields.totalDebtToEquityGrowthQ2.value
        ratiosFields.totalDebtToEquityGrowth1.score = -StockData.last(stock.totalDebtToEquity, 0) * ratiosFields.totalDebtToEquityGrowth1.value * 3
        ratiosFields.totalDebtToEquityGrowth2.score = -StockData.last(stock.totalDebtToEquity, 1) * ratiosFields.totalDebtToEquityGrowth2.value * 2
        ratiosFields.totalDebtToEquityGrowth3.score = -StockData.last(stock.totalDebtToEquity, 2) * ratiosFields.totalDebtToEquityGrowth3.value

        ratiosFields.nonCurrentLiabilitiesToIncomeQ1.score = StockData.ratioBetterThan(ratiosFields.nonCurrentLiabilitiesToIncomeQ1.value, 4, 6) * 2
        ratiosFields.nonCurrentLiabilitiesToIncome1.score = StockData.ratioBetterThan(ratiosFields.nonCurrentLiabilitiesToIncome1.value, 4, 6) * 5
        ratiosFields.nonCurrentLiabilitiesToIncomeGrowthQ1.score = -StockData.last(stock.nonCurrentLiabilitiesToIncomeQ, 0) * ratiosFields.nonCurrentLiabilitiesToIncomeGrowthQ1.value * 0.1
        ratiosFields.nonCurrentLiabilitiesToIncomeGrowthQ2.score = -StockData.last(stock.nonCurrentLiabilitiesToIncomeQ, 1) * ratiosFields.nonCurrentLiabilitiesToIncomeGrowthQ2.value * 0.05
        ratiosFields.nonCurrentLiabilitiesToIncomeGrowth1.score = -StockData.last(stock.nonCurrentLiabilitiesToIncome, 0) * ratiosFields.nonCurrentLiabilitiesToIncomeGrowth1.value * 0.15
        ratiosFields.nonCurrentLiabilitiesToIncomeGrowth2.score = -StockData.last(stock.nonCurrentLiabilitiesToIncome, 1) * ratiosFields.nonCurrentLiabilitiesToIncomeGrowth2.value * 0.1
        ratiosFields.nonCurrentLiabilitiesToIncomeGrowth3.score = -StockData.last(stock.nonCurrentLiabilitiesToIncome, 3) * ratiosFields.nonCurrentLiabilitiesToIncomeGrowth3.value * 0.05

        StockData.removeInfinity(ratiosFields)
        StockData.capScoreValues(ratiosFields)
        StockData.buildClasses(ratiosFields)
        StockData.calcTotalScore(ratiosFields)
        ratiosFields.symbol.classes.push('symbol')

        return ratiosFields
    }
}