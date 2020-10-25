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
    'Under 25 years',
    '25-44 years',
    '45-64 years',
    '65-74 years',
    '75-84 years',
    '85 years and older'
];

export const LOCATIONS = [
    'United States',
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
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
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
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

// Array of the form: [1, 2, ..., 51, 52]
export const WEEK_NUMS = Array.from({length: 52}, (_, i) => i + 1)
