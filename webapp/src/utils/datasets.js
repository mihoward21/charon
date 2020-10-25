import { COLORS } from 'utils/constants';


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