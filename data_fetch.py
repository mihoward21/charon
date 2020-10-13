import datetime
import json
import pprint
import requests
import urllib

import tokens


REQUEST_DATA_LIMIT = 50000
REQUEST_DATA_HEADERS = {
    'X-App-Token': tokens.APP_TOKEN,
}


class DatasetUrls:
    WEEKLY_DEATHS_BY_CAUSE = 'https://data.cdc.gov/resource/muzy-jte6.json'  # 2019-2020
    WEEKLY_DEATHS_BY_AGE = 'https://data.cdc.gov/resource/y5bj-9g5w.json'  # 2015-2020


###
# DatasetUrls.WEEKLY_DEATHS_BY_CAUSE: {
#     'jurisdiction_of_occurrence',
#     'mmwrweek',
#     'mmwryear',
#     'week_ending_date',
#
#     # death causes
#     'all_cause',
# },
# DatasetUrls.WEEKLY_DEATHS_BY_AGE: {
#     'jurisdiction',
#     'week',
#     'year',
#     'week_ending_date',
#     'number_of_deaths',
#     'age_group',
# }
###


def fetch_data(dataset_url, limit=None):
    url_params = {
        "$limit": REQUEST_DATA_LIMIT if limit is None else limit,
        "$offset": 0,
    }

    result = []
    while True:
        request_url = dataset_url + '?'
        if url_params and len(url_params) > 0:
            request_url += urllib.urlencode(url_params)

        print("fetching data. url: %s, params: %s" % (dataset_url, url_params))
        response = requests.get(request_url, headers=REQUEST_DATA_HEADERS)
        data = json.loads(response.text)

        result += data
        if len(data) < url_params["$limit"]:
            break
        url_params["$offset"] += url_params["$limit"]

    return result


def get_filtered_data(data, state=None, age_group=None):
    location = 'United States' if state is None else state

    filtered_data = []
    for data_point in data:
        if data_point.get('type') != 'Unweighted':
            # Ignore predicted data
            continue

        if data_point.get('jurisdiction').lower() != location.lower():
            # Ignore data outside of the location we care about
            continue

        if age_group is not None:
            if data_point.get('age_group') != age_group:
                # Ignore data from age groups we don't care about
                continue

        filtered_data.append(data_point)

    return filtered_data


def get_deaths_by_year_by_age(data, state=None, max_week=None, desired_age_group=None):
    deaths_by_year_by_age = {}
    all_data_points = []

    four_weeks_ago = datetime.datetime.utcnow() - datetime.timedelta(days=28)

    for data_point in data:
        data_type = data_point['type']
        if data_type != 'Unweighted':
            # ignore predicted data
            continue

        location = data_point['jurisdiction']
        if state is None:
            if location != 'United States':
                continue
        else:
            if location.lower() != state.lower():
                continue

        if max_week is not None:
            current_week = int(data_point['week'])
            if current_week > max_week:
                continue

        age_group = data_point['age_group']
        year = data_point['year']
        if desired_age_group is not None:
            if age_group != desired_age_group:
                continue
        try:
            deaths = int(data_point['number_of_deaths'])
        except KeyError:
            deaths = 0
            if year != str(four_weeks_ago.year):
                # deaths are not listed for the recent weeks, but for older data it
                # would be weird if it were missing
                print('Deaths missing for a data point > 4 weeks old')
                pprint.pprint(data_point)

        deaths_by_year_by_age.setdefault(year, {})
        deaths_by_year_by_age[year].setdefault(age_group, 0)
        deaths_by_year_by_age[year][age_group] += deaths
        deaths_by_year_by_age[year].setdefault('total', 0)
        deaths_by_year_by_age[year]['total'] += deaths
        all_data_points.append(data_point)

    return deaths_by_year_by_age, all_data_points


def main():
    full_data = fetch_data(DatasetUrls.WEEKLY_DEATHS_BY_AGE)
    filtered_data = get_filtered_data(full_data)
    with open('data.json', 'w+') as outfile:
        json.dump(filtered_data, outfile)


if __name__ == "__main__":
    main()
