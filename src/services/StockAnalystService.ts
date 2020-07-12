import {EtfsAnalysisResult} from "../model/EtfsAnalysisResult";
import {CellData} from "../model/table/CellData";
import {StockFields} from "../model/StockFields";
import moment from "moment";
import {BackendError} from "../model/BackendError";
import {Stock} from "../model/Stock";
import resultTest from "./Stocks-test.json"
import etfsTest from "./Etfs-test.json"
import {EtfFields} from "../model/EtfFields";
import {ScoreAdditionalInfo} from "../model/table/ScoreAdditionalInfo";
import {CellTag} from "../model/table/CellTag";
import {Etf} from "../model/Etf";
import {StockDisplayableFields} from "../model/StockDisplayableFields";
import {FieldDisplayType} from "../model/FieldDisplayType";
import {Timeline} from "../model/Timeline";

export class StockAnalystService {

    async loadAnalysis(watchlist: string, forceRefresh: boolean, forceRefreshRatios: boolean, mockData: boolean): Promise<Stock[] | BackendError> {
        if (watchlist === 'TEST') {
            return Promise.resolve(resultTest)
        } else {
            return fetch(`http://localhost:3000/stocks/watchlist?watchlist=${watchlist}&refreshDynamicData=${forceRefresh}&refreshFinancials=${forceRefreshRatios}&mockData=${mockData}`)
                .then(r => r.json() as unknown as Stock[]);
        }
    }

    async loadEtfsAnalysis(watchlist: string, forceRefresh: boolean, mockData: boolean): Promise<EtfsAnalysisResult | BackendError> {
        if (watchlist === 'TEST_INDICES') {
            return Promise.resolve(etfsTest)
        } else {
            return fetch(`http://localhost:3000/stocks/etfWatchlist?watchlist=${watchlist}&forceRefresh=${forceRefresh}&mockData=${mockData}`)
                .then(r => r.json() as unknown as EtfsAnalysisResult);
        }
    }

    scoreRow(averages: CellData[], rowValues: CellData[], isEtf: boolean): CellData[] {
        const cellData: CellData[] = []

        rowValues.forEach((toScore, column) => {
            const scoredData = isEtf ?
                StockAnalystService.scoreEtfData(toScore, column, averages) :
                StockAnalystService.scoreStockData(toScore, column, rowValues);
            cellData.push(scoredData)
        })

        const dataToScore = cellData
            .filter((data, index) => index < StockFields.roic1Y)
            .filter(data => data.score && !Number.isNaN(data.score));

        const totalScore = dataToScore.map(data => data.score)
            .reduce((prev, curr) => prev + curr, 0);
        cellData.push({value: totalScore})

        if (!isEtf) {
            const taggedDataToScore = dataToScore.filter(data => data.tags)

            cellData.push({value: StockAnalystService.calcTotal(taggedDataToScore, CellTag.Q1)})
            cellData.push({value: StockAnalystService.calcTotal(taggedDataToScore, CellTag.Q2)})
            cellData.push({value: StockAnalystService.calcTotal(taggedDataToScore, CellTag.Y1)})
            cellData.push({value: StockAnalystService.calcTotal(taggedDataToScore, CellTag.Y3)})
            cellData.push({value: StockAnalystService.calcTotal(taggedDataToScore, CellTag.ratios)})
            cellData.push({value: StockAnalystService.calcTotal(taggedDataToScore, CellTag.stock)})
            cellData.push({value: StockAnalystService.calcTotal(taggedDataToScore, CellTag.dividends)})
            cellData.push({value: StockAnalystService.calcTotal(taggedDataToScore, CellTag.analysts)})

            const rule1Score = cellData.map(data => data.score)
                .filter((score, index) => index >= StockFields.roic1Y)
                .filter(score => score && !Number.isNaN(score))
                .reduce((prev, curr) => prev + curr, 0);

            cellData.push({
                value: rule1Score
            })

            cellData.push({value: StockAnalystService.calcValueScore(cellData)})
        }

        return cellData
    }

    /**
     * Calculate value investing score
     */
    private static calcValueScore(data: CellData[]): number {
        let totalScore = 0

        for (let column = 0; column < data.length; column++) {
            const value = data[column].value as number
            if (!value) {
                continue
            }
            let score = undefined
            switch (column) {
                case StockFields.trailingPE:
                    if (value < 0) {
                        score = -100
                    }
                    score = (10 - value) * 5
                    break;
                case StockFields.priceBook:
                    score = (2 - value) * 3
                    break;
                case StockFields.priceToSalesTrailing12Months:
                    score = (3 - value) * 2
                    break;
                case StockFields.roicP1:
                    score = (value - 10) * 5
                    score = Math.min(score, 100)
                    score = Math.max(score, -100)
                    break;
                case StockFields.roicP2:
                    score = (value - 10) * 3
                    score = Math.min(score, 100)
                    score = Math.max(score, -100)
                    break;
                case StockFields.roicP3:
                    score = (value - 10)
                    score = Math.min(score, 100)
                    score = Math.max(score, -100)
                    break;
            }
            if (score) {
                totalScore += score
                data[column].score = score
            }
        }

        return totalScore
    }

    private static calcTotal(data: CellData[], filterTag: CellTag): number {
        let taggedData = data
            .filter(data => data.tags.includes(filterTag));
        return taggedData
            .map(data => data.score)
            .reduce((prev, curr) => prev + curr, 0)
    }

    private static scoreEtfData(dataToScore: CellData, colEtf: number, averages: CellData[]): CellData {
        if (!dataToScore.value) {
            return dataToScore
        }
        const number: number = dataToScore.value as number
        const avg = averages[colEtf].value as number
        let score

        switch (colEtf) {
            case EtfFields.change: {
                if (number > 5 || number < -5) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break
            }
            case EtfFields.yield: {
                //dividends are already included in the returns
                //dividends are tax deductible, including foreign taxes, which makes them a worse option than gain timelineGrowth
                score = number
                score *= -1
                break;
            }
            case EtfFields.ytdReturn: {
                score = number - avg
                score *= 1
                break;
            }
            case EtfFields.threeYearAverageReturn: {
                score = number - avg
                score *= 5
                break;
            }
            case EtfFields.fiveYearAverageReturn: {
                score = number - avg
                score *= 5
                break;
            }
            case EtfFields.priceToEarnings: {
                score = avg - number
                score *= 10
                break;
            }
            case EtfFields.priceToBook: {
                score = avg - number
                score *= 5
                break;
            }
            case EtfFields.priceToCashflow: {
                score = avg - number
                score *= 3
                break;
            }
            case EtfFields.priceToSales: {
                score = avg - number
                score *= 3
                break;
            }
            case EtfFields.oneMonth: {
                score = number - avg
                score *= 1
                break;
            }
            case EtfFields.threeMonth: {
                score = number - avg
                score *= 1
                break;
            }
            case EtfFields.oneYear: {
                score = number - avg
                score *= 5
                break;
            }
            case EtfFields.threeYear: {
                score = number - avg
                score *= 10
                break;
            }
            case EtfFields.fiveYear: {
                score = number - avg
                score *= 10
                break;
            }
            case EtfFields.tenYear: {
                score = number - avg
                score *= 10
                break;
            }


            case EtfFields.averageDailyVolume3Month: {
                score = number - avg
                score *= 0.00001
                score = this.absLessThan(score, 2)
                break;
            }
            case EtfFields.averageDailyVolume10Day: {
                score = number - avg
                score *= 0.00001
                score = this.absLessThan(score, 2)
                break;
            }
        }
        dataToScore.score = score
        return dataToScore
    }

    private static scoreStockData(dataToScore: CellData, colEtf: number, rowValues: CellData[]): CellData {

        if (!dataToScore.value) {
            return dataToScore
        }
        const number: number = dataToScore.value as number
        const string: string = dataToScore.value as string

        const lastQuarterCoefficient = 3
        const last2QuartersCoefficient = 2
        const lastYearCoefficient = 5
        const last2YearCoefficient = 2
        const last3YearCoefficient = 1

        const revenueGrowthCoefficient = 0.5
        const grossIncomeGrowthCoefficient = 0.1
        const grossMarginGrowthCoefficient = 5
        const netIncomeGrowthCoefficient = 0.5
        const profitMarginGrowthCoefficient = 5
        const ebitGrowthCoefficient = 0.2
        const operatingIncomeGrowthCoefficient = 0.2
        const operatingMarginGrowthCoefficient = 1
        const freeCashFlowGrowthCoefficient = 0.5
        const operatingCashFlowGrowthCoefficient = 1


        const cashGrowthCoefficient = 0.05
        const inventoryGrowthCoefficient = 0.05

        const currentRatioGrowthCoefficient = 1

        const totalShareholdersEquityGrowthCoefficient = 0.1

        const totalDebtToEquityCoefficient = 10
        const totalDebtToEquityGrowthCoefficient = 0.2
        const nonCurrentLiabilitiesToIncomeCoefficient = 20
        const nonCurrentLiabilitiesToIncomeGrowthCoefficient = 0.2

        const stockGrowthCoefficient = 0.5
        const stockRepurchaseGrowthCoefficient = 1

        const epsGrowthCoefficient = 2
        const bpsGrowthCoefficient = 1
        const fcpsGrowthCoefficient = 3

        const roicCoefficient = 15

        let score

        let latestCurrentRatio = rowValues[StockFields.currentRatioQ1].value ?
            rowValues[StockFields.currentRatioQ1].value as number :
            rowValues[StockFields.currentRatio1].value as number
        if (Number.isNaN(latestCurrentRatio) || latestCurrentRatio == 0) {
            latestCurrentRatio = 1
        }

        switch (colEtf) {
            case StockFields.change: {
                if (number > 5 || number < -5) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break
            }
            case StockFields.enterpriseValue: {
                if (number < 300000000) { //300 mil - MicroCap company
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break
            }
            case StockFields.totalCashPerShareP:
                score = number * 0.1
                break
            case StockFields.trailingPE:
                score = this.ratioBetterThan(number, 20, 100);
                score *= 10
                break;
            case StockFields.forwardPE:
                score = this.ratioBetterThan(number, 20, 100);
                score *= 8
                break;
            case StockFields.priceToSalesTrailing12Months:
                score = this.ratioBetterThan(number, 10, 100);
                score *= 5
                break;
            case StockFields.currentPriceToFreeCashFlow:
                score = this.ratioBetterThan(number, 15, 100);
                score *= 10
                break;
            case StockFields.priceToFreeCashFlow:
                score = this.ratioBetterThan(number, 15, 100);
                score *= 5
                break;
            case StockFields.priceBook:
                score = this.ratioBetterThan(number, 2, 20)
                score *= 5
                break;
            case StockFields.enterpriseValueRevenue:
                score = this.ratioBetterThan(number, 5, 10)
                score *= 1
                break;
            case StockFields.enterpriseValueEBITDA:
                score = this.ratioBetterThan(number, 20, 20)
                score *= 3
                break;
            case StockFields.priceEarningGrowth:
                score = this.ratioBetterThan(number, 5, 10)
                score *= 10
                break;
            case StockFields.trailingPriceEarningGrowth:
                score = this.ratioBetterThan(number, 5, 10)
                score *= 2
                break;
            case StockFields.belowTargetLowPriceP:
                score = number * 0.1
                break;
            case StockFields.belowTargetMedianPriceP:
                score = number * 5
                break;
            case StockFields.exDividendDate:
                const daysToExDividend = -moment().diff(string, 'days')
                const fiveYearAvgDividendYield = rowValues[StockFields.fiveYearAvgDividendYield] as number
                score = daysToExDividend > 0 && daysToExDividend < 30 ? fiveYearAvgDividendYield : 0
                break;
            case StockFields.fiveYearAvgDividendYield:
                score = number * 5
                break;
            case StockFields.trailingAnnualDividendYield:
                score = number * 10
                break;
            case StockFields.payoutRatioP:
                score = 60 - number
                const trailingAnnualDividendYield = rowValues[StockFields.trailingAnnualDividendYield] as number
                score *= trailingAnnualDividendYield / 3
                score = Math.max(score, 0)
                break;
            case StockFields.heldByInsidersP:
                score = number * 0.5
                break;
            case StockFields.heldByInstitutionsP:
                score = -number * 0.05
                break;
            case StockFields.buyPercentInsiderShares:
                const sellPercentInsiderShares = rowValues[StockFields.sellPercentInsiderShares].value as number
                score = (number - sellPercentInsiderShares) * 50
                break;
            case StockFields.sellPercentInsiderShares:
                if (number > 2) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break;
            case StockFields.shortToFloatP:
                score = 10 - number
                if (number > 20) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break;
            case StockFields.sharesShortPrevMonthCompareP:
                if (number > 100) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break;

            case StockFields.revenueGrowthQ1:
                score = number * revenueGrowthCoefficient * lastQuarterCoefficient
                break
            case StockFields.revenueGrowthQ2:
                score = number * revenueGrowthCoefficient * last2QuartersCoefficient
                break
            case StockFields.revenueGrowth1:
                score = number * revenueGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.revenueGrowth2:
                score = number * revenueGrowthCoefficient * last2YearCoefficient
                break

            case StockFields.revenueGrowth3:
                score = number * revenueGrowthCoefficient * last3YearCoefficient
                break

            case StockFields.grossIncomeGrowthQ1:
                score = number * grossIncomeGrowthCoefficient * lastQuarterCoefficient
                break
            case StockFields.grossIncomeGrowthQ2:
                score = number * grossIncomeGrowthCoefficient * last2QuartersCoefficient
                break
            case StockFields.grossIncomeGrowth1:
                score = number * grossIncomeGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.grossIncomeGrowth2:
                score = number * grossIncomeGrowthCoefficient * last2YearCoefficient
                break

            case StockFields.grossIncomeGrowth3:
                score = number * grossIncomeGrowthCoefficient * last3YearCoefficient
                break


            case StockFields.grossMargin1:
                score = (number - 40) * lastYearCoefficient
                break
            case StockFields.grossMargin2:
                score = (number - 40) * last2YearCoefficient
                break
            case StockFields.grossMargin3:
                score = (number - 40) * last3YearCoefficient
                break
            case StockFields.grossMarginGrowth1:
                score = number * grossMarginGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.grossMarginGrowth2:
                score = number * grossMarginGrowthCoefficient * last2YearCoefficient
                break
            case StockFields.grossMarginGrowth3:
                score = number * grossMarginGrowthCoefficient * last3YearCoefficient
                break

            case StockFields.ebitGrowthQ1:
                score = number * ebitGrowthCoefficient * lastQuarterCoefficient
                break
            case StockFields.ebitGrowthQ2:
                score = number * ebitGrowthCoefficient * last2QuartersCoefficient
                break
            case StockFields.ebitGrowth1:
                score = number * ebitGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.ebitGrowth2:
                score = number * ebitGrowthCoefficient * last2YearCoefficient
                break

            case StockFields.ebitGrowth3:
                score = number * ebitGrowthCoefficient * last3YearCoefficient
                break

            case StockFields.operatingIncomeGrowth1:
                score = number * operatingIncomeGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.operatingIncomeGrowth2:
                score = number * operatingIncomeGrowthCoefficient * last2YearCoefficient
                break

            case StockFields.operatingIncomeGrowth3:
                score = number * operatingIncomeGrowthCoefficient * last3YearCoefficient
                break


            case StockFields.operatingMargin1:
                score = (number - 20) * lastYearCoefficient
                break
            case StockFields.operatingMargin2:
                score = (number - 20) * last2YearCoefficient
                break
            case StockFields.operatingMargin3:
                score = (number - 20) * last3YearCoefficient
                break
            case StockFields.operatingMarginGrowth1:
                score = number * operatingMarginGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.operatingMarginGrowth2:
                score = number * operatingMarginGrowthCoefficient * last2YearCoefficient
                break
            case StockFields.operatingMarginGrowth3:
                score = number * operatingMarginGrowthCoefficient * last3YearCoefficient
                break

            case StockFields.netIncomeGrowthQ1:
                score = number * netIncomeGrowthCoefficient * lastQuarterCoefficient
                break
            case StockFields.netIncomeGrowthQ2:
                score = number * netIncomeGrowthCoefficient * last2QuartersCoefficient
                break
            case StockFields.netIncomeGrowth1:
                score = number * netIncomeGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.netIncomeGrowth2:
                score = number * netIncomeGrowthCoefficient * last2YearCoefficient
                break

            case StockFields.netIncomeGrowth3:
                score = number * netIncomeGrowthCoefficient * last3YearCoefficient
                break

            case StockFields.profitMarginPQ1:
                score = (number - 15) * lastQuarterCoefficient
                break
            case StockFields.profitMarginPQ2:
                score = (number - 15) * last2QuartersCoefficient
                break
            case StockFields.profitMarginP1:
                score = (number - 15) * lastYearCoefficient
                break
            case StockFields.profitMarginP2:
                score = (number - 15) * last2YearCoefficient
                break
            case StockFields.profitMarginP3:
                score = (number - 15) * last3YearCoefficient
                break
            case StockFields.profitMarginGrowthQ1:
                score = number * profitMarginGrowthCoefficient * lastQuarterCoefficient
                break
            case StockFields.profitMarginGrowthQ2:
                score = number * profitMarginGrowthCoefficient * last2QuartersCoefficient
                break
            case StockFields.profitMarginGrowth1:
                score = number * profitMarginGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.profitMarginGrowth2:
                score = number * profitMarginGrowthCoefficient * last2YearCoefficient
                break
            case StockFields.profitMarginGrowth3:
                score = number * profitMarginGrowthCoefficient * last3YearCoefficient
                break

            case StockFields.freeCashFlowGrowthQ1:
                score = number * freeCashFlowGrowthCoefficient * lastQuarterCoefficient
                break
            case StockFields.freeCashFlowGrowthQ2:
                score = number * freeCashFlowGrowthCoefficient * last2QuartersCoefficient
                break
            case StockFields.freeCashFlowGrowth1:
                score = number * freeCashFlowGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.freeCashFlowGrowth2:
                score = number * freeCashFlowGrowthCoefficient * last2YearCoefficient
                break

            case StockFields.freeCashFlowGrowth3:
                score = number * freeCashFlowGrowthCoefficient * last3YearCoefficient
                break

            case StockFields.operatingCashFlowGrowth1:
                score = number * operatingCashFlowGrowthCoefficient * lastYearCoefficient
                break
            case StockFields.operatingCashFlowGrowth2:
                score = number * operatingCashFlowGrowthCoefficient * last2YearCoefficient
                break

            case StockFields.operatingCashFlowGrowth3:
                score = number * freeCashFlowGrowthCoefficient * last3YearCoefficient
                break


            case StockFields.cashGrowthQ1:
                score = number * cashGrowthCoefficient * lastQuarterCoefficient
                break;


            case StockFields.currentRatioQ1:
                score = (number - 2) * 100
                if (number < 2) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break;
            case StockFields.currentRatio1:
                score = (number - 2) * 50
                if (number < 2) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break;
            case StockFields.currentRatioGrowthQ1:
                score = score = number * currentRatioGrowthCoefficient * lastQuarterCoefficient * (1 / latestCurrentRatio)
                break;
            case StockFields.currentRatioGrowthQ2:
                score = score = number * currentRatioGrowthCoefficient * last2QuartersCoefficient * (1 / latestCurrentRatio)
                break;
            case StockFields.currentRatioGrowth1:
                score = score = number * currentRatioGrowthCoefficient * lastYearCoefficient * (1 / latestCurrentRatio)
                break;
            case StockFields.currentRatioGrowth2:
                score = score = number * currentRatioGrowthCoefficient * last2YearCoefficient * (1 / latestCurrentRatio)
                break;

            case StockFields.currentRatioGrowth3:
                score = score = number * currentRatioGrowthCoefficient * last3YearCoefficient * (1 / latestCurrentRatio)
                break;


            case StockFields.inventoryGrowthQ1:
                score = number * lastQuarterCoefficient * inventoryGrowthCoefficient
                break;
            case StockFields.totalShareholdersEquityGrowthQ1:
                score = number * lastQuarterCoefficient * totalShareholdersEquityGrowthCoefficient
                break;
            case StockFields.totalShareholdersEquityGrowthQ2:
                score = number * last2QuartersCoefficient * totalShareholdersEquityGrowthCoefficient
                break;
            case StockFields.totalShareholdersEquityGrowth1:
                score = number * lastYearCoefficient * totalShareholdersEquityGrowthCoefficient
                break;
            case StockFields.totalShareholdersEquityGrowth2:
                score = number * last2YearCoefficient * totalShareholdersEquityGrowthCoefficient
                break;

            case StockFields.totalShareholdersEquityGrowth3:
                score = number * last3YearCoefficient * totalShareholdersEquityGrowthCoefficient
                break;


            case StockFields.totalDebtToEquityQ1:
                score = (0.5 - number) * lastQuarterCoefficient * totalDebtToEquityCoefficient
                break;
            case StockFields.totalDebtToEquity1:
                score = (0.5 - number) * lastYearCoefficient * totalDebtToEquityCoefficient
                break;

            case StockFields.totalDebtToEquityGrowthQ1:
                score = -number * lastQuarterCoefficient * totalDebtToEquityGrowthCoefficient
                break;
            case StockFields.totalDebtToEquityGrowthQ2:
                score = -number * last2QuartersCoefficient * totalDebtToEquityGrowthCoefficient
                break;
            case StockFields.totalDebtToEquityGrowth1:
                score = -number * lastYearCoefficient * totalDebtToEquityGrowthCoefficient
                break;
            case StockFields.totalDebtToEquityGrowth2:
                score = -number * last2YearCoefficient * totalDebtToEquityGrowthCoefficient
                break;

            case StockFields.totalDebtToEquityGrowth3:
                score = -number * last3YearCoefficient * totalDebtToEquityGrowthCoefficient
                break;


            case StockFields.nonCurrentLiabilitiesToIncomeQ1:
                score = (4 - number) * lastQuarterCoefficient * nonCurrentLiabilitiesToIncomeCoefficient
                break;
            case StockFields.nonCurrentLiabilitiesToIncomeQ2:
                score = (4 - number) * last2QuartersCoefficient * nonCurrentLiabilitiesToIncomeCoefficient
                break;
            case StockFields.nonCurrentLiabilitiesToIncome1:
                score = (4 - number) * lastYearCoefficient * nonCurrentLiabilitiesToIncomeCoefficient
                break;
            case StockFields.nonCurrentLiabilitiesToIncome2:
                score = (4 - number) * last2YearCoefficient * nonCurrentLiabilitiesToIncomeCoefficient
                break;
            case StockFields.nonCurrentLiabilitiesToIncome3:
                score = (4 - number) * last3YearCoefficient * nonCurrentLiabilitiesToIncomeCoefficient
                break;

            case StockFields.nonCurrentLiabilitiesToIncomeGrowthQ1:
                score = -number * lastQuarterCoefficient * nonCurrentLiabilitiesToIncomeGrowthCoefficient
                break;
            case StockFields.nonCurrentLiabilitiesToIncomeGrowthQ2:
                score = -number * last2QuartersCoefficient * nonCurrentLiabilitiesToIncomeGrowthCoefficient
                break;
            case StockFields.nonCurrentLiabilitiesToIncomeGrowth1:
                score = -number * lastYearCoefficient * nonCurrentLiabilitiesToIncomeGrowthCoefficient
                break;
            case StockFields.nonCurrentLiabilitiesToIncomeGrowth2:
                score = -number * last2YearCoefficient * nonCurrentLiabilitiesToIncomeGrowthCoefficient
                break;

            case StockFields.nonCurrentLiabilitiesToIncomeGrowth3:
                score = -number * last3YearCoefficient * nonCurrentLiabilitiesToIncomeGrowthCoefficient
                break;

            case StockFields.sharesGrowth1:
                score = -number
                score *= lastYearCoefficient * stockGrowthCoefficient
                break;
            case StockFields.sharesGrowth2:
                score = -number
                score *= 0.5 * last3YearCoefficient * stockGrowthCoefficient
                break;
            case StockFields.stockRepurchasedGrowthQ1:
                score = number * lastQuarterCoefficient * stockRepurchaseGrowthCoefficient
                if (number > 50) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break;
            case StockFields.stockRepurchasedGrowthQ2:
                score = number * last2QuartersCoefficient * stockRepurchaseGrowthCoefficient
                if (number > 50) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break;
            case StockFields.stockRepurchasedGrowth1:
                score = number * lastYearCoefficient * stockRepurchaseGrowthCoefficient
                if (number > 50) {
                    dataToScore.additionalInfo = ScoreAdditionalInfo.ManualCheckRequired
                }
                break;
            case StockFields.stockRepurchasedGrowth2:
                score = number * last2YearCoefficient * stockRepurchaseGrowthCoefficient
                break;

            case StockFields.stockRepurchasedGrowth3:
                score = number * last3YearCoefficient * stockRepurchaseGrowthCoefficient
                break;

            case StockFields.epsGrowthQ1:
                score = number * lastQuarterCoefficient * epsGrowthCoefficient
                break;
            case StockFields.epsGrowthQ2:
                score = number * last2QuartersCoefficient * epsGrowthCoefficient
                break;
            case StockFields.epsGrowth1:
                score = number * lastYearCoefficient * epsGrowthCoefficient
                break;
            case StockFields.epsGrowth2:
                score = number * last2YearCoefficient * epsGrowthCoefficient
                break;
            case StockFields.epsGrowth3:
                score = number * last3YearCoefficient * epsGrowthCoefficient
                break;

            case StockFields.bookValuePerShareGrowth1:
                score = number * lastYearCoefficient * bpsGrowthCoefficient
                break;
            case StockFields.bookValuePerShareGrowth2:
                score = number * last2YearCoefficient * bpsGrowthCoefficient
                break;
            case StockFields.bookValuePerShareGrowth3:
                score = number * last3YearCoefficient * bpsGrowthCoefficient
                break;

            case StockFields.freeCashFlowPerShareGrowth1:
                score = number * lastYearCoefficient * fcpsGrowthCoefficient
                break;
            case StockFields.freeCashFlowPerShareGrowth2:
                score = number * last2YearCoefficient * fcpsGrowthCoefficient
                break;
            case StockFields.freeCashFlowPerShareGrowth3:
                score = number * last3YearCoefficient * fcpsGrowthCoefficient
                break;

            case StockFields.peQ1:
                score = this.ratioBetterThan(number, 20, 100);
                score *= 10
                break;
            case StockFields.growthEstimate5y:
                score = this.signPow(number, 2)
                break;
            case StockFields.roic1Y:
                score = StockAnalystService.rule1Score(number, 10)
                break;
            case StockFields.roic3Y:
                score = StockAnalystService.rule1Score(number, 8)
                break;
            case StockFields.revenue1Y:
                score = StockAnalystService.rule1Score(number, 3)
                break;
            case StockFields.revenue3Y:
                score = StockAnalystService.rule1Score(number, 2)
                break;
            case StockFields.revenue5Y:
                score = StockAnalystService.rule1Score(number, 1)
                break;
            case StockFields.revenue9Y:
                score = StockAnalystService.rule1Score(number, 0.5)
                break;
            case StockFields.eps1Y:
                score = StockAnalystService.rule1Score(number, 3)
                break;
            case StockFields.eps3Y:
                score = StockAnalystService.rule1Score(number, 2)
                break;
            case StockFields.eps5Y:
                score = StockAnalystService.rule1Score(number, 1)
                break;
            case StockFields.eps9Y:
                score = StockAnalystService.rule1Score(number, 0.5)
                break;
            case StockFields.bps1Y:
                score = StockAnalystService.rule1Score(number, 1)
                break;
            case StockFields.bps3Y:
                score = StockAnalystService.rule1Score(number, 0.7)
                break;
            case StockFields.bps5Y:
                score = StockAnalystService.rule1Score(number, 0.5)
                break;
            case StockFields.bps9Y:
                score = StockAnalystService.rule1Score(number, 0.25)
                break;
            case StockFields.cash1Y:
                score = StockAnalystService.rule1Score(number, 1)
                break;
            case StockFields.cash3Y:
                score = StockAnalystService.rule1Score(number, 0.7)
                break;
            case StockFields.cash5Y:
                score = StockAnalystService.rule1Score(number, 0.5)
                break;
            case StockFields.cash9Y:
                score = StockAnalystService.rule1Score(number, 0.25)
                break;
            case StockFields.belowStickerPrice15P:
                score = number * 10
                break;
            case StockFields.belowStickerPrice5P:
                score = number
                break;
        }

        dataToScore.score = score
        return dataToScore
    }

    static rule1Score(number?: number, weight?: number) {
        let minusExpectedGrowth = number - 10;
        minusExpectedGrowth = Math.max(-50, minusExpectedGrowth)
        minusExpectedGrowth = Math.min(50, minusExpectedGrowth)
        return minusExpectedGrowth * weight;
    }

    static ratioBetterThan(number?: number, positiveLimit?: number, maxThreshold: number = 50) {
        let score: number
        if (number > 0) {

            if (number <= positiveLimit + maxThreshold) {
                score = positiveLimit - number
            } else {
                score = -maxThreshold * 2
            }

        } else {
            score = -maxThreshold * 3 + ((1 / number) * 100)
        }
        return score;
    }

    static ratioScore(number?: number, maxThreshold: number = 50) {
        return this.ratioBetterThan(number, 0, maxThreshold)
    }

    /**
     * Number to the exponent power, keeping the sign.
     * E.g. signPow(-2, 2) == -4
     */
    private static signPow(number: number, exponent: number) {
        let absPow = Math.pow(Math.abs(number), exponent);
        return absPow * Math.sign(number);
    }

    filterDisplayableEtfStats(etf: Etf): Etf {
        const colNames = []
        for (const enumMember in EtfFields) {
            if (Number.isNaN(Number.parseInt(enumMember))) {
                colNames.push(enumMember)
            }
        }
        for (const statName of Object.keys(etf)) {
            if (!colNames.find(colName => colName === statName)) {
                delete etf[statName]
            }
        }
        return etf
    }

    filterDisplayableStockStats(stock: Stock): Stock {
        const colNames = []
        for (const enumMember in StockDisplayableFields) {
            if (Number.isNaN(Number.parseInt(enumMember))) {
                colNames.push(enumMember)
            }
        }

        for (const statName of Object.keys(stock)) {
            if (!colNames.find(colName => colName === statName)) {
                delete stock[statName]
            }
        }
        return stock
    }

    getScoreLabels(isEtf: boolean): string[] {
        const labels = []
        labels.push('Score')
        if (!isEtf) {
            labels.push('1Q Score')
            labels.push('2Q Score')
            labels.push('1Y Score')
            labels.push('3Y Score')
            labels.push('Ratios Score')
            labels.push('Stocks Score')
            labels.push('Dividends Score')
            labels.push('Analysts Score')
            labels.push('Rule 1 Score')
            labels.push('Value Investment Score')
            labels.push('Growth Investment Score')
        }
        return labels;
    }


    flattenStockData(stock: Stock): { [stat: string]: string | number } {
        const quartersToDisplay = 2
        const yearsToDisplay = 3
        const flatten = {}

        const stockFields = Object.keys(stock);
        for (const field of stockFields) {
            switch (StockAnalystService.getFieldDisplayType(field)) {
                case FieldDisplayType.SingleValue:
                    //copy a simple value
                    flatten[field] = stock[field]
                    break
                case FieldDisplayType.LatestOnly:
                    //get the latest value only
                    const value = stock[field] as Timeline
                    flatten[field] = Object.values(value).reverse()[0]
                    break
                case FieldDisplayType.Quarter:
                    //get the latest quartersToDisplay quarterly values
                    const quarters = stock[field] as Timeline
                    const quartersLatestFirst = Object.values(quarters).reverse();
                    for(let i = 0; i < quartersToDisplay; i++){
                        const fieldName = `${field.substr(0, field.length-1)} Q${i + 1}`
                        flatten[fieldName] = quartersLatestFirst[i]
                    }
                    break
                case FieldDisplayType.Year:
                    //get the latest yearsToDisplay yearly values
                    const years = stock[field] as Timeline
                    const yearsLatestFirst = Object.values(years)
                        .reverse();
                    for(let i = 0; i < yearsToDisplay; i++){
                        const fieldName = `${field} Y${i + 1}`
                        flatten[fieldName] = yearsLatestFirst[i]
                    }
                    break
                case FieldDisplayType.WholeTimeline:
                    //copy the whole timeline
                    const timeline = stock[field] as Timeline
                    flatten[field] = timeline
                    break
            }
        }

        //uncomment to dump the current stock fields
        // console.log(Object.keys(flatten).join(',\n'))

        return flatten
    }

    private static getFieldDisplayType(field: string): FieldDisplayType {
        switch (field) {
            case "symbol":
                return FieldDisplayType.SingleValue
            case "exchange":
                return FieldDisplayType.SingleValue
            case "chartLastUpdated":
                return FieldDisplayType.SingleValue
            case "financialsLastUpdated":
                return FieldDisplayType.SingleValue
            case "analysisLastUpdated":
                return FieldDisplayType.SingleValue
            case "statisticsLastUpdated":
                return FieldDisplayType.SingleValue
            case "holdersLastUpdated":
                return FieldDisplayType.SingleValue
            case "krfLastUpdated":
                return FieldDisplayType.SingleValue
            case "lastReportedQuarter":
                return FieldDisplayType.SingleValue
            case "companyName":
                return FieldDisplayType.SingleValue
            case "change":
                return FieldDisplayType.SingleValue
            case "currentPrice":
                return FieldDisplayType.SingleValue
            case "enterpriseValue":
                return FieldDisplayType.LatestOnly
            case "totalCashPerShareP":
                return FieldDisplayType.LatestOnly
            case "trailingPE":
                return FieldDisplayType.LatestOnly
            case "forwardPE":
                return FieldDisplayType.LatestOnly
            case "priceToSalesTrailing12Months":
                return FieldDisplayType.LatestOnly
            case "priceToFreeCashFlow":
                return FieldDisplayType.LatestOnly
            case "currentPriceToFreeCashFlow":
                return FieldDisplayType.LatestOnly
            case "priceBook":
                return FieldDisplayType.LatestOnly
            case "enterpriseValueRevenue":
                return FieldDisplayType.LatestOnly
            case "enterpriseValueEBITDA":
                return FieldDisplayType.LatestOnly
            case "priceEarningGrowth":
                return FieldDisplayType.LatestOnly
            case "trailingPriceEarningGrowth":
                return FieldDisplayType.LatestOnly
            case "week52ChangeP":
                return FieldDisplayType.LatestOnly
            case "week52AboveLowP":
                return FieldDisplayType.LatestOnly
            case "week52BelowHighP":
                return FieldDisplayType.LatestOnly
            case "targetLowPrice":
                return FieldDisplayType.LatestOnly
            case "belowTargetLowPriceP":
                return FieldDisplayType.LatestOnly
            case "targetMedianPrice":
                return FieldDisplayType.LatestOnly
            case "belowTargetMedianPriceP":
                return FieldDisplayType.LatestOnly
            case "heldByInsidersP":
                return FieldDisplayType.LatestOnly
            case "heldByInstitutionsP":
                return FieldDisplayType.LatestOnly
            case "buyPercentInsiderShares":
                return FieldDisplayType.LatestOnly
            case "sellPercentInsiderShares":
                return FieldDisplayType.LatestOnly
            case "shortToFloatP":
                return FieldDisplayType.LatestOnly
            case "sharesShortPrevMonthCompareP":
                return FieldDisplayType.LatestOnly
            case "exDividendDate":
                return FieldDisplayType.LatestOnly
            case "fiveYearAvgDividendYield":
                return FieldDisplayType.LatestOnly
            case "trailingAnnualDividendYield":
                return FieldDisplayType.LatestOnly
            case "payoutRatioP":
                return FieldDisplayType.LatestOnly
            case "dividendsGrowth":
                return FieldDisplayType.Year
            case "revenue":
                return FieldDisplayType.Year
            case "revenueQ":
                return FieldDisplayType.Quarter
            case "revenueGrowth":
                return FieldDisplayType.Year
            case "revenueGrowthQ":
                return FieldDisplayType.Quarter
            case "grossIncome":
                return FieldDisplayType.Year
            case "grossIncomeQ":
                return FieldDisplayType.Quarter
            case "grossIncomeGrowth":
                return FieldDisplayType.Year
            case "grossIncomeGrowthQ":
                return FieldDisplayType.Quarter
            case "ebit":
                return FieldDisplayType.Year
            case "ebitQ":
                return FieldDisplayType.Quarter
            case "ebitGrowth":
                return FieldDisplayType.Year
            case "ebitGrowthQ":
                return FieldDisplayType.Quarter
            case "netIncome":
                return FieldDisplayType.Year
            case "netIncomeQ":
                return FieldDisplayType.Quarter
            case "netIncomeGrowth":
                return FieldDisplayType.Year
            case "netIncomeGrowthQ":
                return FieldDisplayType.Quarter
            case "profitMarginP":
                return FieldDisplayType.Year
            case "profitMarginPQ":
                return FieldDisplayType.Quarter
            case "profitMarginGrowth":
                return FieldDisplayType.Year
            case "profitMarginGrowthQ":
                return FieldDisplayType.Quarter
            case "totalCashFromOperatingActivities":
                return FieldDisplayType.Year
            case "totalCashFromOperatingActivitiesQ":
                return FieldDisplayType.Quarter
            case "totalCashFromOperatingActivitiesGrowth":
                return FieldDisplayType.Year
            case "totalCashFromOperatingActivitiesGrowthQ":
                return FieldDisplayType.Quarter
            case "capitalExpenditures":
                return FieldDisplayType.Year
            case "capitalExpendituresQ":
                return FieldDisplayType.Quarter
            case "capitalExpendituresGrowth":
                return FieldDisplayType.Year
            case "capitalExpendituresGrowthQ":
                return FieldDisplayType.Quarter
            case "freeCashFlow":
                return FieldDisplayType.Year
            case "freeCashFlowQ":
                return FieldDisplayType.Quarter
            case "freeCashFlowGrowth":
                return FieldDisplayType.Year
            case "freeCashFlowGrowthQ":
                return FieldDisplayType.Quarter
            case "cash":
                return FieldDisplayType.Year
            case "cashQ":
                return FieldDisplayType.Quarter
            case "cashGrowth":
                return FieldDisplayType.Year
            case "cashGrowthQ":
                return FieldDisplayType.Quarter
            case "inventory":
                return FieldDisplayType.Year
            case "inventoryQ":
                return FieldDisplayType.Quarter
            case "inventoryGrowth":
                return FieldDisplayType.Year
            case "inventoryGrowthQ":
                return FieldDisplayType.Quarter
            case "currentAssets":
                return FieldDisplayType.Year
            case "currentAssetsQ":
                return FieldDisplayType.Quarter
            case "currentAssetsGrowth":
                return FieldDisplayType.Year
            case "currentAssetsGrowthQ":
                return FieldDisplayType.Quarter
            case "currentLiabilities":
                return FieldDisplayType.Year
            case "currentLiabilitiesQ":
                return FieldDisplayType.Quarter
            case "currentLiabilitiesGrowth":
                return FieldDisplayType.Year
            case "currentLiabilitiesGrowthQ":
                return FieldDisplayType.Quarter
            case "currentRatio":
                return FieldDisplayType.Year
            case "currentRatioQ":
                return FieldDisplayType.Quarter
            case "currentRatioGrowth":
                return FieldDisplayType.Year
            case "currentRatioGrowthQ":
                return FieldDisplayType.Quarter
            case "totalLiabilities":
                return FieldDisplayType.Year
            case "totalLiabilitiesQ":
                return FieldDisplayType.Quarter
            case "totalLiabilitiesGrowth":
                return FieldDisplayType.Year
            case "totalLiabilitiesGrowthQ":
                return FieldDisplayType.Quarter
            case "totalDebtToEquity":
                return FieldDisplayType.Year
            case "totalDebtToEquityQ":
                return FieldDisplayType.Quarter
            case "totalDebtToEquityGrowth":
                return FieldDisplayType.Year
            case "totalDebtToEquityGrowthQ":
                return FieldDisplayType.Quarter
            case "nonCurrentLiabilitiesToIncome":
                return FieldDisplayType.Year
            case "nonCurrentLiabilitiesToIncomeQ":
                return FieldDisplayType.Quarter
            case "nonCurrentLiabilitiesToIncomeGrowth":
                return FieldDisplayType.Year
            case "nonCurrentLiabilitiesToIncomeGrowthQ":
                return FieldDisplayType.Quarter
            case "totalAssets":
                return FieldDisplayType.Year
            case "totalAssetsQ":
                return FieldDisplayType.Quarter
            case "totalAssetsGrowth":
                return FieldDisplayType.Year
            case "totalAssetsGrowthQ":
                return FieldDisplayType.Quarter
            case "totalShareholdersEquity":
                return FieldDisplayType.Year
            case "totalShareholdersEquityQ":
                return FieldDisplayType.Quarter
            case "totalShareholdersEquityGrowth":
                return FieldDisplayType.Year
            case "totalShareholdersEquityGrowthQ":
                return FieldDisplayType.Quarter
            case "stockRepurchased":
                return FieldDisplayType.Year
            case "stockRepurchasedQ":
                return FieldDisplayType.Quarter
            case "stockRepurchasedGrowth":
                return FieldDisplayType.Year
            case "stockRepurchasedGrowthQ":
                return FieldDisplayType.Quarter
            case "eps":
                return FieldDisplayType.Year
            case "epsQ":
                return FieldDisplayType.Quarter
            case "epsGrowth":
                return FieldDisplayType.Year
            case "epsGrowthQ":
                return FieldDisplayType.Quarter
            case "pe":
                return FieldDisplayType.Year
            case "peQ":
                return FieldDisplayType.Quarter
            case "peGrowth":
                return FieldDisplayType.Year
            case "peGrowthQ":
                return FieldDisplayType.Quarter
            case "bookValuePerShare":
                return FieldDisplayType.Year
            case "bookValuePerShareGrowth":
                return FieldDisplayType.Year
            case "capSpending":
                return FieldDisplayType.Year
            case "capSpendingGrowth":
                return FieldDisplayType.Year
            case "freeCashFlowPerShare":
                return FieldDisplayType.Year
            case "freeCashFlowPerShareGrowth":
                return FieldDisplayType.Year
            case "grossMargin":
                return FieldDisplayType.Year
            case "grossMarginGrowth":
                return FieldDisplayType.Year
            case "operatingCashFlow":
                return FieldDisplayType.Year
            case "operatingCashFlowGrowth":
                return FieldDisplayType.Year
            case "operatingIncome":
                return FieldDisplayType.Year
            case "operatingIncomeGrowth":
                return FieldDisplayType.Year
            case "operatingMargin":
                return FieldDisplayType.Year
            case "operatingMarginGrowth":
                return FieldDisplayType.Year
            case "shares":
                return FieldDisplayType.Year
            case "sharesGrowth":
                return FieldDisplayType.Year
            case "workingCapital":
                return FieldDisplayType.Year
            case "workingCapitalQ":
                return FieldDisplayType.Quarter
            case "workingCapitalGrowth":
                return FieldDisplayType.Year
            case "workingCapitalGrowthQ":
                return FieldDisplayType.Quarter
            case "growthEstimate5y":
                return FieldDisplayType.LatestOnly
            case "roicP":
                return FieldDisplayType.Year
            case "roic1Y":
                return FieldDisplayType.LatestOnly
            case "roic3Y":
                return FieldDisplayType.LatestOnly
            case "revenue1Y":
                return FieldDisplayType.LatestOnly
            case "revenue3Y":
                return FieldDisplayType.LatestOnly
            case "revenue5Y":
                return FieldDisplayType.LatestOnly
            case "revenue9Y":
                return FieldDisplayType.LatestOnly
            case "eps1Y":
                return FieldDisplayType.LatestOnly
            case "eps3Y":
                return FieldDisplayType.LatestOnly
            case "eps5Y":
                return FieldDisplayType.LatestOnly
            case "eps9Y":
                return FieldDisplayType.LatestOnly
            case "bps1Y":
                return FieldDisplayType.LatestOnly
            case "bps3Y":
                return FieldDisplayType.LatestOnly
            case "bps5Y":
                return FieldDisplayType.LatestOnly
            case "bps9Y":
                return FieldDisplayType.LatestOnly
            case "cash1Y":
                return FieldDisplayType.LatestOnly
            case "cash3Y":
                return FieldDisplayType.LatestOnly
            case "cash5Y":
                return FieldDisplayType.LatestOnly
            case "cash9Y":
                return FieldDisplayType.LatestOnly
            case "pe1Y":
                return FieldDisplayType.LatestOnly
            case "pe3Y":
                return FieldDisplayType.LatestOnly
            case "pe5Y":
                return FieldDisplayType.LatestOnly
            case "pe9Y":
                return FieldDisplayType.LatestOnly
            case "rule1GrowthRate":
                return FieldDisplayType.LatestOnly
            case "defaultPE":
                return FieldDisplayType.LatestOnly
            case "historicalPE":
                return FieldDisplayType.LatestOnly
            case "rule1PE":
                return FieldDisplayType.LatestOnly
            case "currentEps":
                return FieldDisplayType.LatestOnly
            case "futureEPS10Years":
                return FieldDisplayType.LatestOnly
            case "futurePrice10Years":
                return FieldDisplayType.LatestOnly
            case "stickerPrice15pcGrowth":
                return FieldDisplayType.LatestOnly
            case "stickerPrice5pcGrowth":
                return FieldDisplayType.LatestOnly
            case "belowStickerPrice15P":
                return FieldDisplayType.LatestOnly
            case "belowStickerPrice5P":
                return FieldDisplayType.LatestOnly
            case "price":
                return FieldDisplayType.WholeTimeline
            default:
                throw new Error(`Unsupported field display type ${field}`)
        }
    }

    private static absLessThan(value: number, absValueThreshold: number) {
        if (value > absValueThreshold) {
            return absValueThreshold
        } else if (value < absValueThreshold) {
            return absValueThreshold
        } else {
            return value
        }
    }
}