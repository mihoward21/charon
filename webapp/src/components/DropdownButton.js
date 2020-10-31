import React from 'react';


class DropdownButton extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            selectValue: props.defaultValue,
        };
    }

    getOptionFromValue(optionValue) {
        for (const selectOption of this.props.selectOptions) {
            if (selectOption.value === optionValue) {
                return selectOption;
            }
        }

        return null;
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
