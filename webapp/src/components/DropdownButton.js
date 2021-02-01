import React from 'react';

import { getOptionListEntryFromValue } from '../utils/controls';


class DropdownButton extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            selectValue: props.defaultValue,
        };
    }

    getOptionFromValue(optionValue) {
        return getOptionListEntryFromValue(optionValue, this.props.selectOptions);
    }

    onChange(e) {
        const selectOption = this.getOptionFromValue(e.target.value);
        this.props.onChange(selectOption);
        this.setState({
            selectValue: selectOption,
        });
    }

    render() {
        return (
            <div className={this.props.className}>
                { this.props.labelText && <label>{this.props.labelText}: </label> }
                <select
                    value={this.state.selectValue.value}
                    onChange={this.onChange}>
                    {this.props.selectOptions.map((option, index) => (
                        <option value={option.value} key={index}>{option.label}</option>
                    ))}
                </select>
            </div>
        );
    }
}

export default DropdownButton;
