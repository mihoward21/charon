import React from 'react';
import Loader from 'react-loader-spinner';

import "components/ChartControls.css";

import DropdownButton from 'components/DropdownButton';


class ChartControls extends React.Component {
    render() {
        return (
            <div className='chart-controls'>
                { this.props.controlOptions.map((controlOption, index) => {
                    return <DropdownButton key={index}
                                className='control-button'
                                labelText={controlOption.labelText}
                                onChange={controlOption.onChange}
                                defaultValue={controlOption.defaultValue}
                                selectOptions={controlOption.selectOptions} />
                })}
                <Loader className='controls-loading-spinner'
                    type="Puff"
                    color="#1E90FF"
                    height={22}
                    width={22}
                    visible={this.props.isLoading} />
            </div>
        );
    }
}

export default ChartControls;
