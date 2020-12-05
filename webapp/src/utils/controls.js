export const getOptionListEntryFromValue = (value, optionList) => {
    for (const option of optionList) {
        if (option.value === value) {
            return option;
        }
    }

    return null;
}

export const getCurrentWeekNums = (start = 1, end = 52) => {
    if (start < 1 || start > 51) {
        throw new Error(`Invalid start value: ${start}`);
    }
    if (end < 2 || end > 52) {
        throw new Error(`Invalid end value: ${end}`);
    }

    const weekNums = [];
    for (let i = start; i <= end; i++) {
        weekNums.push(i);
    }
    return weekNums;
}
