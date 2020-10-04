import axios from 'axios';

import React from 'react';
import Chart from "chart.js";
import "./LineGraph.css";

import { APP_TOKEN } from './tokens';
import DropdownButton from './DropdownButton';

const REQUEST_DATA_LIMIT = 50000;
const REQUEST_DATA_HEADERS = {
    'X-App-Token': APP_TOKEN,
}

const WEEKLY_DEATHS_BY_AGE_URL = 'https://data.cdc.gov/resource/y5bj-9g5w.json' // 2015-2020

const colors = [
    'rgba(30,144,255,1)', // blue
    'rgba(152,251,152,1)', // green
    'rgba(255,165,0,1)', // orange
    'rgba(220,20,60,1)', // red
    'rgba(238,130,238,1)', // pink
    'rgba(138,43,226,1)' // purple
];

const AGE_GROUPS = [
    'Under 25 years',
    '25-44 years',
    '45-64 years',
    '65-74 years',
    '75-84 years',
    '85 years and older'
];

class LineGraph extends React.Component {
    chartRef = React.createRef();
    chartObj = null;
    dataPointList = null;

    constructor(props) {
        super(props);
        this.onAgeGroupSelect = this.onAgeGroupSelect.bind(this);
    }

    async dataFetchHelper({ datasetUrl, limit = null}) {
        const urlParams = {
            "$limit": limit === null ? REQUEST_DATA_LIMIT : limit,
            "$offset": 0,
        };
        let result = [];
        while (true) {
            let requestUrl = datasetUrl;
            if (urlParams && Object.keys(urlParams).length > 0) {
                requestUrl += '?' + new URLSearchParams(urlParams).toString();
            }

            const response = await axios.get(requestUrl, {
                headers: REQUEST_DATA_HEADERS,
            });

            result = result.concat(response.data);
            if (response.data.length < urlParams["$limit"]) {
                break
            }
            urlParams["$offset"] += urlParams["$limit"]
        }

        return result
    }

    shouldIgnoreData(dataPoint, location, ageGroup) {
        if (dataPoint.type !== 'Unweighted') {
            // ignore predicted data
            return true;
        }

        if (dataPoint.jurisdiction.toLowerCase() !== location.toLowerCase()) {
            // ignore data outside of the location we are charting;
            return true;
        }

        if (dataPoint.age_group !== ageGroup) {
            // ignore data from other age groups
            return true;
        }

        return false;
    }

    getChartDatasets({dataPointList, ageGroup, state = null}) {
        const location = state === null ? 'United States' : state;

        // Filter the data so only what we want to chart is left
        const dataObj = {};
        for (const dataPoint of dataPointList) {
            // First make sure to ignore data we don't care about for this particular chart
            if (this.shouldIgnoreData(dataPoint, location, ageGroup)) {
                continue;
            }

            if (!(dataPoint.year in dataObj)) {
                dataObj[dataPoint.year] = {};
            }

            const yearData = dataObj[dataPoint.year];
            if (dataPoint.week in yearData) {
                throw new Error(`got 2 of the same year/week. week: ${dataPoint.week}, year: ${dataPoint.year}`);
            }

            let numDeaths = parseInt(dataPoint.number_of_deaths);
            if (isNaN(numDeaths)) {
                numDeaths = 0;
            }

            yearData[dataPoint.week] = numDeaths;
        }

        const datasets = [];
        // Turn that data into the proper format for chart.js
        for (const [year, yearData] of Object.entries(dataObj)) {
            const currentDataset = {};
            currentDataset['label'] = year;
            currentDataset['data'] = [];

            for (let weekNum = 1; weekNum < 53; weekNum++) {
                if (!(weekNum in yearData)) {
                    // Should be at the most recent week in the current year. No more data to process for this year
                    break;
                }

                const weekDeaths = yearData[weekNum];
                currentDataset['data'].push(weekDeaths);
            }

            datasets.push(currentDataset);
        }

        // Sort the array by year
        datasets.sort((a, b) => {
            if (a.year < b.year) {
                return -1;
            }
            if (a.year > b.year) {
                return 1;
            }
            return 0;
        });

        return datasets;
    }

    async initData() {
        this.dataPointList = await this.dataFetchHelper({
            datasetUrl: WEEKLY_DEATHS_BY_AGE_URL
        });
    }

    initChart() {
        const myChartRef = this.chartRef.current.getContext("2d");

        const getWeekLabels = () => {
            const labels = [];
            for (let weekNum = 1; weekNum < 53; weekNum++) {
                labels.push('Week ' + weekNum);
            }
            return labels;
        }

        this.chartObj = new Chart(myChartRef, {
            type: "line",
            data: {
                labels: getWeekLabels(),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: 25000,
                        }
                    }]
                }
            }
        });
    }

    updateChart({ ageGroup }) {
        const chartDatasets = this.getChartDatasets({
            dataPointList: this.dataPointList,
            ageGroup,
        });

        const datasets = [].concat(chartDatasets);
        datasets.forEach((dataset, index) => {
            dataset['borderColor'] = colors[index];
            dataset['fill'] = false;
        });
        this.chartObj.data.datasets = datasets;
        this.chartObj.update();
    }

    async componentDidMount() {
        this.initChart();
        await this.initData();
        this.updateChart({
            ageGroup: AGE_GROUPS[0],
        });
    }

    onAgeGroupSelect(newAgeGroup) {
        this.updateChart({
            ageGroup: newAgeGroup,
        });
    }

    render() {
        return (
            <>
                <div className="chart-container">
                    <canvas
                        id="myChart"
                        ref={this.chartRef} />
                </div>
                <DropdownButton
                    onChange={this.onAgeGroupSelect}
                    defaultValue={AGE_GROUPS[0]}
                    selectOptions={AGE_GROUPS} />
            </>
        )
    }
}

export default LineGraph;
