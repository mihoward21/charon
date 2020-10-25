import axios from 'axios';

import React from 'react';
import Chart from "chart.js";

import "components/LineGraph.css";
import DropdownButton from 'components/DropdownButton';
import ChartTable from 'components/ChartTable';

import { AGE_GROUPS, LOCATIONS, WEEKLY_DEATHS_BY_AGE_URL, WEEK_NUMS } from 'utils/constants';
import { getFormattedDatasets } from 'utils/datasets';
import { logEvent } from 'utils/logger';


class LineGraph extends React.Component {
    chartRef = React.createRef();
    dataPointList = null;
    ageGroup = AGE_GROUPS[0];
    location = LOCATIONS[0];

    constructor(props) {
        super(props);
        this.onAgeGroupSelect = this.onAgeGroupSelect.bind(this);
        this.onLocationSelect = this.onLocationSelect.bind(this);
        this.state = {
            chartObj: null,
        }
    }

    getChartTitle() {
        const currentYear = new Date().getFullYear();
        return `${this.location} weekly deaths for ${this.ageGroup}: 2015 - ${currentYear}`
    }

    async getChartDatasets() {
        let datasetUrl = `/api/data/${encodeURIComponent(this.location)}`
        if (this.ageGroup) {
            datasetUrl += `/${encodeURIComponent(this.ageGroup)}`
        }
        const response = await axios.get(datasetUrl);
        const dataObj = response.data;
        return getFormattedDatasets(dataObj);
    }

    initChart() {
        const myChartRef = this.chartRef.current.getContext("2d");

        const getWeekLabels = () => {
            const labels = [];
            for (const weekNum of WEEK_NUMS) {
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
        const chartDatasets = await this.getChartDatasets();

        this.state.chartObj.data.datasets = chartDatasets;
        this.state.chartObj.options.title.text = this.getChartTitle();
        this.state.chartObj.update();
        this.setState({
            chartObj: this.state.chartObj,
        })
    }

    async componentDidMount() {
        this.initChart();
        this.ageGroup = AGE_GROUPS[0];
        this.location = LOCATIONS[0];
        await this.updateChart();
    }

    async onAgeGroupSelect(newAgeGroup) {
        logEvent('select: age group', {
            ageGroup: newAgeGroup
        });
        this.ageGroup = newAgeGroup;
        await this.updateChart();
    }

    async onLocationSelect(newLocation) {
        logEvent('select: location', {
            location: newLocation
        });
        this.location = newLocation;
        await this.updateChart();
    }

    render() {
        return (
            <>
                <div className='chart-container'>
                    <canvas
                        id='myChart'
                        ref={this.chartRef} />
                </div>
                <div className='chart-controls'>
                    <DropdownButton className='age-group-button'
                        labelText='Age group:'
                        onChange={this.onAgeGroupSelect}
                        defaultValue={AGE_GROUPS[0]}
                        selectOptions={AGE_GROUPS} />
                    <DropdownButton className='location-button'
                        labelText='Region:'
                        onChange={this.onLocationSelect}
                        defaultValue={LOCATIONS[0]}
                        selectOptions={LOCATIONS} />
                </div>
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
