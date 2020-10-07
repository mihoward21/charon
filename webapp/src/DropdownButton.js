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
            <div className={this.props.className}>
                { this.props.labelText && <label style={{marginRight: '5px'}}>{this.props.labelText}</label> }
                <select
                    value={this.state.selectValue}
                    onChange={this.onChange}>
                    {this.props.selectOptions.map((option, index) => (
                        <option value={option} key={index}>{option}</option>
                    ))}
                </select>
            </div>
        );
    }
}

export default DropdownButton;
