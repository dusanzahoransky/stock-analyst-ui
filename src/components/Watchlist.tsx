import React from "react"
import {WatchlistTable} from "./WatchlistTable"
import {EtfsAnalysisResult} from "../model/EtfsAnalysisResult"
import {StockAnalystService} from "../services/StockAnalystService"
import {PriceEpsChart} from "./PriceEpsChart"
import {PriceEpsData} from "../model/PriceEpsData"
import "./Watchlist.css"
import 'font-awesome/css/font-awesome.min.css'
import moment from "moment"
import {EtfsChartData} from "../model/EtfsChartData"
import {EtfsPriceChart} from "./EtfsPriceChart"
import {RatioChart} from "./RatioChart"
import {RatioChartData} from "../model/RatioChartData"
import {FinancialChartRatios} from "../model/FinancialChartRatios"
import {StockTaggingService} from "../services/StockTaggingService"
import {CellData} from "../model/table/CellData"
import {OtherChartRatios} from "../model/OtherChartRatios"
import {CellTag} from "../model/table/CellTag"
import {StocksAnalysisResult} from "../model/StocksAnalysisResult"
import {Etf} from "../model/Etf"
import {Stock} from "../model/Stock";
import {Timeline} from "../model/Timeline";


export interface WatchlistProps {
    watchlist: string
    etfsResult?: EtfsAnalysisResult,
    stocksResult?: StocksAnalysisResult,
    onRefreshYahooHandler?: (watchlist: string) => void,
    onRefreshMorningstarClickHandler?: (watchlist: string) => void,
    /**
     * On show/hide click
     */
    onShowClickHandler?: (watchlist: string) => void,
    /**
     * preset watchlist stored in DB or a custom on the fly created watchlist
     */
    isPreset: boolean
    /**
     * an ETF index or normal stock
     */
    isEtf: boolean
    /**
     * show the watchlist - render it as expanded, showing all the stocks
     */
    isExpanded: boolean
}

export interface WatchlistState {
    selectedStock?: Stock
    /**
     * Remove outliers which would otherwise deform the chart, e.g. an EP which is extremely high in a single quarter
     */
    priceEpsChartRemoveOutliers?: boolean
    etfsChartSymbols?: string[]
    visibleTags: CellTag[]
}

export class Watchlist extends React.Component<WatchlistProps, WatchlistState> {

    private readonly stockAnalystService: StockAnalystService
    private readonly stockTaggingService: StockTaggingService

    public static readonly VISIBILITY_TOGGLES = [CellTag.price, CellTag.ratios, CellTag.stock, CellTag.dividends, CellTag.timelineGrowth, CellTag.rule1, CellTag.value, CellTag.growth, CellTag.financials]
    public static readonly VISIBLE_DEFAULTS = [CellTag.price, CellTag.ratios, CellTag.stock, CellTag.dividends, CellTag.timelineGrowth, CellTag.rule1, CellTag.value, CellTag.growth]

    constructor(props: Readonly<WatchlistProps>) {
        super(props)
        this.state = {
            selectedStock: this.props.stocksResult ? this.props.stocksResult.stocks[0] : undefined,
            etfsChartSymbols: [],
            priceEpsChartRemoveOutliers: true,
            // visibleTags: []
            // visibleTags: Watchlist.VISIBLE_DEFAULTS
            visibleTags: Watchlist.VISIBILITY_TOGGLES
        }
        this.stockAnalystService = new StockAnalystService()
        this.stockTaggingService = new StockTaggingService()
    }

    render() {
        const {watchlist, isPreset, isExpanded, isEtf, onRefreshMorningstarClickHandler} = this.props

        //ETF rendering
        if (isEtf) {
            return <div
                className="Watchlist"
                key={watchlist}>
                <h2 className={"WatchlistName Etf"}>
                    {this.renderShowLink()} {Watchlist.toWatchlistLabel(watchlist)}{this.renderRefreshLink()}</h2>
                {this.renderTable()}
                {this.renderEtfsChart()}
            </div>
        }

        //Stock rendering
        const refreshRatiosLink = isPreset && isExpanded ?
            <span className="refresh">
                <i className="fa fa-refresh refreshRatios"
                   onClick={() => onRefreshMorningstarClickHandler(watchlist)}/> MorningStar
            </span> : ''

        let checkboxesSpan
        if (isExpanded) {
            const visibleTags = Watchlist.VISIBILITY_TOGGLES.map(tag => this.toVisibleTagCheckbox(tag))
            checkboxesSpan = <span className="VisibleTags">Display: {visibleTags}</span>
        }

        return <div
            className="Watchlist"
            key={watchlist}>
            <h2 className={"WatchlistName Stock"}>
                {this.renderShowLink()} {Watchlist.toWatchlistLabel(watchlist)}{this.renderRefreshLink()}{refreshRatiosLink} {checkboxesSpan}</h2>
            {this.renderTable()}
            {this.renderCompanyCharts()}
        </div>
    }

    renderTable() {
        if (!this.props.isExpanded) {
            return ''
        } else {
            const {data, headerData, headerLabels} = this.prepareData()

            return <WatchlistTable
                data={data}
                isEtf={this.props.isEtf}
                headerLabels={headerLabels}
                headerData={headerData}
                visibleTags={this.state.visibleTags}
                onStockClickHandler={this.stockOnClickHandler}
            />
        }
    }

    private renderShowLink() {
        return this.props.isPreset ?
            <i className="fa fa-caret-down" onClick={() => this.props.onShowClickHandler(this.props.watchlist)}/> : ''
    }

    private renderRefreshLink() {
        return this.props.isPreset && this.props.isExpanded ?
            <span className="refresh">
                <i className="fa fa-refresh" onClick={() => this.props.onRefreshYahooHandler(this.props.watchlist)}/> Yahoo
            </span> : ''
    }

    private prepareData(): { data: CellData[][], headerData: CellData[], headerLabels: string[] } {

        let data: CellData[][] = []
        let headerData: CellData[] = []
        let headerLabels: string[] = []

        if (this.props.isEtf) {

            const etfs = this.props.etfsResult.etfs
            let averages = {...this.props.etfsResult.averages}

            averages = this.stockAnalystService.filterDisplayableEtfStats(averages)

            headerLabels = Object.keys(averages)
            headerData = Object.keys(averages).map(key => {
                return {value: averages[key]}
            })

            const labels = this.stockAnalystService.getScoreLabels(this.props.isEtf)
            labels.forEach(label => this.addHeader(headerLabels, headerData, label))

            for (const etf of etfs) {
                let etfClone = {...etf}
                etfClone = this.stockAnalystService.filterDisplayableEtfStats(etfClone)
                const rowData = Object.keys(etfClone).map(key => {
                    return {value: etfClone[key]}
                })
                data.push(rowData)
            }
        } else {
            const stocks = this.props.stocksResult.stocks
            let flattenStockData

            for (const stock of stocks) {
                let stockClone = {...stock}
                stockClone = this.stockAnalystService.filterDisplayableStockStats(stockClone)
                flattenStockData = this.stockAnalystService.flattenStockData(stockClone)
                const rowData = Object.keys(flattenStockData).map(key => {
                    return {value: flattenStockData[key]}
                })
                data.push(rowData)
            }

            headerLabels = Object.keys(flattenStockData)

            const labels = this.stockAnalystService.getScoreLabels(this.props.isEtf)
            labels.forEach(label => this.addHeader(headerLabels, headerData, label))

        }

        data = data.map(row => this.stockTaggingService.tagRow(row, this.props.isEtf))
        data = data.map(row => this.stockAnalystService.scoreRow(headerData, row, this.props.isEtf))

        return {data, headerData, headerLabels}
    }


    addHeader(headerLabels: string[], headerData: CellData[], label: string) {
        headerLabels.push(label)
        headerData.push({value: 0})
    }

    private toVisibleTagCheckbox(tag: CellTag) {
        let tagName = CellTag[tag]
        return <span className="VisibleTag" key={tagName}>{tagName} <input
            name={tagName}
            type="checkbox"
            checked={this.state.visibleTags.includes(tag)}
            onChange={() => {
                this.setState((prevState) => {
                    let newHiddenTags
                    if (prevState.visibleTags.includes(tag)) {
                        newHiddenTags = prevState.visibleTags.filter(hiddenTag => hiddenTag !== tag)
                    } else {
                        newHiddenTags = prevState.visibleTags.concat(tag)
                    }
                    return {visibleTags: newHiddenTags}
                })
            }}/>
            </span>
    }

    renderEtfsChart() {
        if (!this.props.isExpanded || this.state.etfsChartSymbols.length === 0) {
            return ''
        }
        const chartData = this.prepareEtfsChartData(this.props.etfsResult.etfs)
        return <div className={!chartData ? 'hidden' : ''}>
            <EtfsPriceChart
                data={chartData}
                symbols={this.state.etfsChartSymbols}
                label={`Etf price chart`}/>
        </div>
    }

    renderCompanyCharts() {
        const stock = this.state.selectedStock;
        if (!this.props.isExpanded || !stock) {
            return ''
        }

        const peRatio = 15
        const pbRatio = 3
        const pfcRatio = 20
        const chartData = this.prepareEpsChartData(stock, peRatio, pbRatio, pfcRatio)
        const priceEpsChart = <PriceEpsChart
            data={chartData}
            description={`Price to earnings, book value and free cash flow per share ${stock.companyName}. [Scales: PE=${peRatio} PB=${pbRatio} PFC=${pfcRatio}]`}/>

        let financialRatiosCharts
        let otherRatiosCharts

        const yearsToDisplay = 10

        financialRatiosCharts = Watchlist.getChartFinancialRatios().map(ratio => {
            const multiplyQuarters = FinancialChartRatios[ratio] !== FinancialChartRatios.operatingMargin
                && FinancialChartRatios[ratio] !== FinancialChartRatios.profitMarginP
                && FinancialChartRatios[ratio] !== FinancialChartRatios.workingCapital
            const chartData = Watchlist.prepareRatiosData(stock, ratio, false, multiplyQuarters, yearsToDisplay)
            return <RatioChart
                key={ratio}
                data={chartData}
                label={`${FinancialChartRatios[ratio]}`}/>
        })

        otherRatiosCharts = Watchlist.getChartOtherRatios().map(ratio => {
            const percentage = OtherChartRatios[ratio] === OtherChartRatios.totalDebtToEquity
                || OtherChartRatios[ratio] === OtherChartRatios.nonCurrentLiabilitiesToIncome
            const chartData = Watchlist.prepareRatiosData(stock, ratio, percentage, false, yearsToDisplay)
            return <RatioChart
                key={ratio}
                data={chartData}
                label={`${OtherChartRatios[ratio]}`}/>
        })


        return <div>
            <div>{priceEpsChart}</div>
            <div className={"RatiosCharts"}>
                <div className={'RatiosChartsColumn'}>{financialRatiosCharts}</div>
                <div className={'RatiosChartsColumn'}>{otherRatiosCharts}</div>
            </div>
        </div>
    }

    private static prepareRatiosData(stock: Stock, ratio: string, percentage: boolean, quartersMultiple: boolean, yearsToDisplay: number): RatioChartData[] {
        const chartData: RatioChartData[] = []

        const percentageMultiple = percentage ? 100 : 1;
        const quarterMultiple = quartersMultiple ? 4 : 1;

        const ratioTimeline = stock[ratio] as Timeline
        if(ratioTimeline) {
            const periods = Object.entries(ratioTimeline)

            for (let i = 1; i < periods.length && i < yearsToDisplay; i++) {
                const date = periods[i][0]
                const value = periods[i][1] * percentageMultiple
                chartData.push({
                    date,
                    value
                })
            }
        }

        const ratioQuartersTimeline = stock[ratio+'Q'] as Timeline
        if(ratioQuartersTimeline) {
            const quarterPeriods = Object.entries(ratioQuartersTimeline)

            for (let i = 1; i < quarterPeriods.length && i < yearsToDisplay; i++) {
                const date = quarterPeriods[i][0]
                const value = quarterPeriods[i][1] * percentageMultiple * quarterMultiple
                chartData.push({
                    date,
                    value
                })
            }
        }
        return chartData
    }

    private static getChartFinancialRatios(): string[] {
        const enumNames = []

        for (const enumMember in FinancialChartRatios) {
            if (Number.isNaN(Number.parseInt(enumMember))) {
                enumNames.push(enumMember)
            }
        }

        return enumNames
    }

    private static getChartOtherRatios(): string[] {
        const enumNames = []

        for (const enumMember in OtherChartRatios) {
            if (Number.isNaN(Number.parseInt(enumMember))) {
                enumNames.push(enumMember)
            }
        }

        return enumNames
    }


    stockOnClickHandler = (stockSymbol: string) => {
        if (this.props.isEtf) {
            let updatedSymbols
            if (this.state.etfsChartSymbols.includes(stockSymbol)) {
                updatedSymbols = this.state.etfsChartSymbols.filter(s => s !== stockSymbol)
            } else {
                updatedSymbols = this.state.etfsChartSymbols.concat(stockSymbol)
            }
            this.setState(state => {
                return {
                    etfsChartSymbols: updatedSymbols
                }
            })
        } else {
            let selectedStock = this.props.stocksResult.stocks
                .filter(stock => stock.symbol === stockSymbol)[0]
            console.log(selectedStock)
            // const ratiosData = selectedStock.stockRatiosTimeline.periods

            //close the graph on a second click
            if (this.state.selectedStock === selectedStock) {
                this.setState(state => {
                    return {
                        selectedStock: undefined
                    }
                })
            } else {
                this.setState(state => {
                    return {
                        selectedStock,
                        // ratiosData,
                    }
                })
            }
        }
    }


    private prepareEtfsChartData(etfs: Etf[]): EtfsChartData[] | undefined {

        const chartStocks = etfs.filter(s => this.state.etfsChartSymbols.includes(s.symbol))

        const allDates = Array.from(new Set(chartStocks.flatMap(s => s.chartData.map(d => d.date))))
            .sort()

        const chartData = new Array<EtfsChartData>(allDates.length)
        for (let i = 0; i < allDates.length; i++) {
            const date = allDates[i]
            const dataPoint: EtfsChartData = {
                date: moment(allDates[i] * 1000).format('YYYY-MM-DD')
            }
            for (const stock of chartStocks) {
                let chartDataAtDate = stock.chartData.filter(d => d.date === date)[0]
                if (chartDataAtDate) {
                    dataPoint[stock.symbol] = chartDataAtDate.price
                }
            }
            chartData[i] = dataPoint
        }

        return chartData
    }

    private prepareEpsChartData(stock: Stock, peRatio: number, pbRatio: number, fcpsRation: number): PriceEpsData[] | undefined {
        if (!stock) return undefined

        const round1Dec = (value?: number) => value ? Math.round(value * 10) / 10 : undefined

        //remove outliers, sometime a price jumps from 10 to 1000, e.g. RYA stock and that messes up the chart scale
        const price = stock.price as Timeline;
        const periods = Object.keys(price);
        for (let i = 1; i < periods.length; i++) {
            const currentPeriod = periods[i];
            const previousPeriod = periods[i - 1];
            if (price[currentPeriod] > price[previousPeriod] * 20) {
                price[currentPeriod] = undefined
            }
        }

        return Object.entries(price).map(entry => {
            const date = entry[0]
            const price = round1Dec(entry[1])

            const epsQuarterly = round1Dec(stock.epsQ[date] * peRatio * 4)
            const epsAnnually = round1Dec(stock.eps[date] * peRatio)

            const bpsAnnually = round1Dec(stock.bookValuePerShare[date] * pbRatio)
            const fcpsAnnually = round1Dec(stock.freeCashFlowPerShare[date] * fcpsRation)

            const processedData: PriceEpsData = {
                date,
                price,
                epsQuarterly,
                epsAnnually,
                bpsAnnually,
                fcpsAnnually
            }
            return processedData
        })
    }


    private static toWatchlistLabel(watchlist: string) {
        return watchlist
            .replace(/[a-zA-Z]+/g, function (g) {
                switch (g) {
                    case 'EU':
                    case 'US':
                    case 'AU':
                    case 'GB':
                    case 'CHF':
                    case 'ETF':
                        return g
                    default:
                        return g[0].toUpperCase().concat(g.substr(1).toLowerCase())
                }

            })
            .replace(/_/g, ' ')
    }


}

