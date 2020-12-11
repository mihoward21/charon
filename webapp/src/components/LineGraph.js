import axios from 'axios';

import React from 'react';
import Chart from "chart.js";

import "components/LineGraph.css";
import ChartTable from 'components/ChartTable';
import ChartControls from 'components/ChartControls';

import { AGE_GROUPS, LOCATIONS, WEEKLY_DEATHS_BY_AGE_URL } from 'utils/constants';
import { getFormattedDatasets } from 'utils/datasets';
import { logEvent } from 'utils/logger';
import { getCurrentWeekNums, getOptionListEntryFromValue } from 'utils/controls';

const DATA_VERSION = '121020';

const URL_SEARCH_PARAM_AGE = 'age';
const URL_SEARCH_PARAM_REGION = 'region';


class LineGraph extends React.Component {
    chartRef = React.createRef();
    dataPointList = null;

    constructor(props) {
        super(props);
        this.onAgeGroupSelect = this.onAgeGroupSelect.bind(this);
        this.onLocationSelect = this.onLocationSelect.bind(this);
        this.state = {
            chartObj: null,
            isLoading: false,
        }

        const controlParams = this.getControlsFromSearchParams();
        this.ageGroup = controlParams[URL_SEARCH_PARAM_AGE] || AGE_GROUPS[0];
        this.location = controlParams[URL_SEARCH_PARAM_REGION] || LOCATIONS[0];
    }

    getChartTitle() {
        const currentYear = new Date().getFullYear();
        return `${this.location.label} weekly deaths for ${this.ageGroup.label}: 2015 - ${currentYear}`
    }

    async getChartDatasets() {
        let datasetUrl = `/api/data/${encodeURIComponent(this.location.value)}`
        if (this.ageGroup) {
            datasetUrl += `/${encodeURIComponent(this.ageGroup.value)}`
        }
        datasetUrl += `?data_version=${DATA_VERSION}`;
        const response = await axios.get(datasetUrl);
        const dataObj = response.data;
        return getFormattedDatasets(dataObj);
    }

    initChart() {
        const myChartRef = this.chartRef.current.getContext("2d");

        const getWeekLabels = () => {
            const labels = [];
            for (const weekNum of getCurrentWeekNums()) {
                labels.push('Week ' + weekNum);
            }
            return labels;
        }

        this.setState({
            chartObj: new Chart(myChartRef, {
                type: "line",
                data: {
                    labels: getWeekLabels(),
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Number of Deaths',
                                fontSize: 18,
                            },
                            ticks: {
                                beginAtZero: true,
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: this.getChartTitle(),
                        fontSize: 32,
                    },
                    legend: {
                        position: 'right',
                    }
                }
            })
        });
    }

    async updateChart() {
        this.setState({
            isLoading: true,
        });
        const chartDatasets = await this.getChartDatasets();

        this.state.chartObj.data.datasets = chartDatasets;
        this.state.chartObj.options.title.text = this.getChartTitle();
        this.state.chartObj.update();
        this.setState({
            chartObj: this.state.chartObj,
            isLoading: false,
        });
    }

    getControlsFromSearchParams() {
        const urlParams = new URLSearchParams(window.location.search);

        const controlParams = {};
        const age = urlParams.get(URL_SEARCH_PARAM_AGE);
        const region = urlParams.get(URL_SEARCH_PARAM_REGION);
        if (age) {
            controlParams[URL_SEARCH_PARAM_AGE] = getOptionListEntryFromValue(decodeURIComponent(age), AGE_GROUPS);
        }
        if (region) {
            controlParams[URL_SEARCH_PARAM_REGION] = getOptionListEntryFromValue(decodeURIComponent(region), LOCATIONS);
        }

        return controlParams;
    }

    async componentDidMount() {
        this.initChart();
        await this.updateChart();
    }

    updateUrl() {
        const url = new URL(window.location);

        const isDefaultAge = this.ageGroup === AGE_GROUPS[0];
        const isDefaultLocation = this.location === LOCATIONS[0];

        if (isDefaultAge) {
            url.searchParams.delete(URL_SEARCH_PARAM_AGE);
        } else {
            url.searchParams.set(URL_SEARCH_PARAM_AGE, encodeURIComponent(this.ageGroup.value));
        }

        if (isDefaultLocation) {
            url.searchParams.delete(URL_SEARCH_PARAM_REGION);
        } else {
            url.searchParams.set(URL_SEARCH_PARAM_REGION, encodeURIComponent(this.location.value));
        }

        window.history.pushState({}, '', url);
    }

    async onAgeGroupSelect(newAgeGroup) {
        logEvent('select: age group', {
            ageGroup: newAgeGroup.label
        });
        this.ageGroup = newAgeGroup;
        this.updateUrl();
        await this.updateChart();
    }

    async onLocationSelect(newLocation) {
        logEvent('select: location', {
            location: newLocation.label
        });
        this.location = newLocation;
        this.updateUrl();
        await this.updateChart();
    }

    render() {
        const controlOptions = [
            {
                'labelText': 'Age',
                'onChange': this.onAgeGroupSelect,
                'defaultValue': this.ageGroup,
                'selectOptions': AGE_GROUPS,
            },
            {
                'labelText': 'Region',
                'onChange': this.onLocationSelect,
                'defaultValue': this.location,
                'selectOptions': LOCATIONS,
            }
        ]

        return (
            <>
                <div className='chart-container'>
                    <canvas
                        id='myChart'
                        ref={this.chartRef} />
                </div>
                <ChartControls
                    controlOptions={controlOptions}
                    isLoading={this.state.isLoading} />
                <div className='table-container'>
                    <ChartTable datasets={this.state.chartObj?.data?.datasets}/>
                </div>
                <p className='data-source-text'>
                    <span>Data source: </span>
                    <a href={WEEKLY_DEATHS_BY_AGE_URL}>{WEEKLY_DEATHS_BY_AGE_URL}</a>
                    <br />
                    <span>Note: CDC counts of death certificates can lag by a few months.</span>
                </p>
            </>
        )
    }
}

export default LineGraph;
