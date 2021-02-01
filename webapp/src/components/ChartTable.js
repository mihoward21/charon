import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import { getCurrentWeekNums } from '../utils/controls';


class ChartTable extends React.Component {
    getRowSum(rowData) {
        return rowData.reduce((accum, currentValue) => {
            if (currentValue) {
                return accum + currentValue;
            }

            return accum;
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
                        { getCurrentWeekNums().map((weekNum, index) => {
                            return <TableCell key={index}><strong>Week {weekNum}</strong></TableCell>
                        })}
                        <TableCell><strong>Total</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { this.props.datasets.map((dataset, datasetIndex) => {
                        return (
                            <StyledTableRow key={datasetIndex}>
                                <TableCell>{dataset.label}</TableCell>
                                { dataset.data.map((dataValue, dataIndex) => {
                                    return <TableCell key={dataIndex}>{ this.getDataLabel(dataValue) }</TableCell>
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
