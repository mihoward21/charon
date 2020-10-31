export const WEEKLY_DEATHS_BY_AGE_URL = 'https://data.cdc.gov/resource/y5bj-9g5w.json' // 2015-2020

export const COLORS = [
    'rgba(30,144,255,1)', // blue
    'rgba(152,251,152,1)', // green
    'rgba(255,165,0,1)', // orange
    'rgba(220,20,60,1)', // red
    'rgba(238,130,238,1)', // pink
    'rgba(138,43,226,1)' // purple
];

export const AGE_GROUPS = [
    {
        'label': 'All ages',
        'value': '',
    },
    {
        'label': 'Under 25 years',
        'value': 'Under 25 years',
    },
    {
        'label': '25-44 years',
        'value': '25-44 years',
    },
    {
        'label': '45-64 years',
        'value': '45-64 years',
    },
    {
        'label': '65-74 years',
        'value': '65-74 years',
    },
    {
        'label': '75-84 years',
        'value': '75-84 years',
    },
    {
        'label': '85 years and older',
        'value': '85 years and older',
    }
];

const locationList = [
    'United States',
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District of Columbia',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'New York City',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
];

export const LOCATIONS = locationList.map((location) => {
    return {
        'label': location,
        'value': location,
    }
});
