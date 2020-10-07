import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import { WEEK_NUMS } from 'utils/constants';


class ChartTable extends React.Component {
    constructor(props) {
        super(props);
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    { this.props.datasets.map((dataset, datasetIndex) => {
                        return (
                            <StyledTableRow key={datasetIndex}>
                                <TableCell>{dataset.label}</TableCell>
                                { dataset.data.map((dataPoint, dataIndex) => {
                                    return <TableCell key={dataIndex}>{ dataPoint }</TableCell>
                                })}
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
