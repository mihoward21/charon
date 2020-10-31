import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import { WEEK_NUMS } from 'utils/constants';


class ChartTable extends React.Component {
    getRowSum(row) {
        return row.reduce((a, b) => {
            if (b) {
                return a + b;
            }

            return a;
        }, 0)
    }

    getDataLabel(dataValue) {
        if (isNaN(dataValue)) {
            return "";
        }

        return dataValue;
    }

    render() {
        if (this.props.datasets === null || this.props.datasets === undefined) {
            return null;
        }

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Year</strong></TableCell>
                        { WEEK_NUMS.map((weekNum, index) => {
                            return <TableCell key={index}><strong>Week {weekNum}</strong></TableCell>
                        })}
                        <TableCell><strong>Sum</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { this.props.datasets.map((dataset, datasetIndex) => {
                        return (
                            <StyledTableRow key={datasetIndex}>
                                <TableCell>{dataset.label}</TableCell>
                                { WEEK_NUMS.map((weekNum, dataIndex) => {
                                    return <TableCell key={dataIndex}>{ this.getDataLabel(dataset.data[weekNum-1]) }</TableCell>
                                })}
                                <TableCell>{ this.getRowSum(dataset.data) }</TableCell>
                            </StyledTableRow>
                        )
                    })}
                </TableBody>
            </Table>
        );
    }
}

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default ChartTable;
