import axios from 'axios';

import React from 'react';
import Chart from "chart.js";

import "components/LineGraph.css";
import DropdownButton from 'components/DropdownButton';
import ChartTable from 'components/ChartTable';

import { WEEKLY_DEATHS_BY_AGE_URL, AGE_GROUPS, WEEK_NUMS } from 'utils/constants';
import { getFilteredDataObj, getFormattedDatasets } from 'utils/datasets';
import { logEvent } from 'utils/logger';


class LineGraph extends React.Component {
    chartRef = React.createRef();
    dataPointList = null;

    constructor(props) {
        super(props);
        this.onAgeGroupSelect = this.onAgeGroupSelect.bind(this);
        this.state = {
            chartObj: null,
        }
    }

    getChartTitle(ageGroup) {
        const currentYear = new Date().getFullYear();
        return `US weekly deaths for ${ageGroup}: 2015 - ${currentYear}`
    }

    getChartDatasets({dataPointList, ageGroup, state = null}) {
        const location = state === null ? 'United States' : state;

        // Filter the data so only what we want to chart is left
        const dataObj = getFilteredDataObj(dataPointList, location, ageGroup);
        return getFormattedDatasets(dataObj);
    }

    async initData() {
        const response = await axios.get('/100420.data.json');
        this.dataPointList = response.data;
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
                                suggestedMax: 25000,
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: this.getChartTitle(AGE_GROUPS[0]),
                        fontSize: 32,
                    },
                    legend: {
                        position: 'right',
                    }
                }
            })
        });
    }

    updateChart({ ageGroup }) {
        const chartDatasets = this.getChartDatasets({
            dataPointList: this.dataPointList,
            ageGroup,
        });

        this.state.chartObj.data.datasets = chartDatasets;
        this.state.chartObj.options.title.text = this.getChartTitle(ageGroup);
        this.state.chartObj.update();
        this.setState({
            chartObj: this.state.chartObj,
        })
    }

    async componentDidMount() {
        this.initChart();
        await this.initData();
        this.updateChart({
            ageGroup: AGE_GROUPS[0],
        });
    }

    onAgeGroupSelect(newAgeGroup) {
        logEvent('select: age group', {
            ageGroup: newAgeGroup
        });
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
                <DropdownButton className="age-group-button"
                    labelText='Age group:'
                    onChange={this.onAgeGroupSelect}
                    defaultValue={AGE_GROUPS[0]}
                    selectOptions={AGE_GROUPS} />
                <div className="table-container">
                    <ChartTable datasets={this.state.chartObj?.data?.datasets}/>
                </div>
                <p className="data-source-text">
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
