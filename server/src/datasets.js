const getFilteredDataObj = (dataPointList, location, ageGroup) => {
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

        if (location && ageGroup) {
            // If we have both a location and an age group, we should never see a repeat year/week combo. Adding
            // this as a safety check
            if (dataPoint.week in yearData) {
                throw new Error(`got 2 of the same year/week. week: ${dataPoint.week}, year: ${dataPoint.year}`);
            }
        }

        let numDeaths = parseInt(dataPoint.number_of_deaths);
        if (isNaN(numDeaths)) {
            numDeaths = 0;
        }

        if (dataPoint.week in yearData) {
            yearData[dataPoint.week] += numDeaths;
        } else {
            yearData[dataPoint.week] = numDeaths;
        }
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

    if (ageGroup && dataPoint.age_group !== ageGroup) {
        // ignore data from other age groups
        return true;
    }

    return false;
}

module.exports = { getFilteredDataObj };
