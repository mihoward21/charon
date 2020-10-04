import React from 'react';


class DropdownButton extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            selectValue: props.defaultValue,
        };
    }

    onChange(e) {
        this.props.onChange(e.target.value);
        this.setState({
            selectValue: e.target.value,
        });
    }

    render() {
        return (
            <select className={this.props.className}
                value={this.state.selectValue}
                onChange={this.onChange}>
                {this.props.selectOptions.map((option, index) => (
                    <option value={option} key={index}>{option}</option>
                ))}
            </select>
        );
    }
}

export default DropdownButton;
