import { COLORS } from 'utils/constants';


export const getFilteredDataObj = (dataPointList, location, ageGroup) => {
    // Returns dicts of the form:
    // {
    //     year: {
    //         weekNum: numDeaths
    //     }
    // }

    const dataObj = {};
    for (const dataPoint of dataPointList) {
        // First make sure to ignore data we don't care about for this particular chart
        if (shouldIgnoreData(dataPoint, location, ageGroup)) {
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
    return dataObj;
}

const shouldIgnoreData = (dataPoint, location, ageGroup) => {
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

export const getFormattedDatasets = (dataObj) => {
    // Returns list of the form:
    // [
    //     {
    //         label: str,
    //         data: [1, 2, 3,...],
    //         borderColor: str,
    //         fill: false
    //     }
    // ]

    const datasets = [];
    let datasetIndex = 0;
    for (const [year, yearData] of Object.entries(dataObj)) {
        const currentDataset = {};
        currentDataset['label'] = year;
        currentDataset['data'] = [];
        currentDataset['borderColor'] = COLORS[datasetIndex];
        currentDataset['fill'] = false;

        for (let weekNum = 1; weekNum < 53; weekNum++) {
            if (!(weekNum in yearData)) {
                // Should be at the most recent week in the current year. No more data to process for this year
                break;
            }

            const weekDeaths = yearData[weekNum];
            currentDataset['data'].push(weekDeaths);
        }

        datasets.push(currentDataset);
        datasetIndex += 1;
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