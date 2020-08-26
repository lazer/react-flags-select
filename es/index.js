function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import countries from './countries';

var ReactFlagsSelect = function (_Component) {
	_inherits(ReactFlagsSelect, _Component);

	function ReactFlagsSelect(props) {
		_classCallCheck(this, ReactFlagsSelect);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		var defaultCountry = countries[_this.props.defaultCountry] && _this.props.defaultCountry;

		_this.state = {
			openOptions: false,
			defaultCountry: defaultCountry,
			filteredCountries: []
		};

		_this.toggleOptions = _this.toggleOptions.bind(_this);
		_this.closeOptions = _this.closeOptions.bind(_this);
		_this.onSelect = _this.onSelect.bind(_this);
		_this.filterSearch = _this.filterSearch.bind(_this);
		_this.setCountries = _this.setCountries.bind(_this);
		return _this;
	}

	ReactFlagsSelect.prototype.toggleOptions = function toggleOptions() {
		!this.state.disabled && this.setState({
			openOptions: !this.state.openOptions
		});
	};

	ReactFlagsSelect.prototype.toggleOptionsWithKeyboard = function toggleOptionsWithKeyboard(evt) {
		evt.preventDefault();
		if (evt.keyCode === 27) {
			//esc key: hide options
			!this.state.disabled && this.setState({
				openOptions: false
			});
		}
	};

	ReactFlagsSelect.prototype.closeOptions = function closeOptions(event) {
		if (event.target !== this.refs.selectedFlag && event.target !== this.refs.flagOptions && event.target !== this.refs.filterText) {
			this.setState({
				openOptions: false
			});
		}
	};

	ReactFlagsSelect.prototype.onSelect = function onSelect(countryCode) {
		this.setState({
			selected: countryCode,
			filter: ''
		});
		this.props.onSelect && this.props.onSelect(countryCode);
	};

	ReactFlagsSelect.prototype.onSelectWithKeyboard = function onSelectWithKeyboard(evt, countryCode) {
		evt.preventDefault();
		if (evt.keyCode === 13) {
			//enter key: select
			this.onSelect(countryCode);
			this.closeOptions(evt);
		} else if (evt.keyCode === 27) {
			//esc key: hide options
			this.toggleOptions();
		}
	};

	ReactFlagsSelect.prototype.updateSelected = function updateSelected(countryCode) {
		var isValid = countries[countryCode];

		isValid && this.setState({
			selected: countryCode
		});
	};

	ReactFlagsSelect.prototype.filterSearch = function filterSearch(evt) {
		var _this2 = this;

		var filterValue = evt.target.value;
		var filteredCountries = filterValue && this.state.countries.filter(function (key) {
			var label = _this2.props.customLabels[key] || countries[key];
			return label && label.match(new RegExp(filterValue, 'i'));
		});

		this.setState({ filter: filterValue, filteredCountries: filteredCountries });
	};

	ReactFlagsSelect.prototype.setCountries = function setCountries() {
		var _this3 = this;

		var fullCountries = Object.keys(countries);

		var selectCountries = this.props.countries && this.props.countries.filter(function (country) {
			return countries[country];
		});

		//Filter BlackList
		if (this.props.blackList && selectCountries) {
			selectCountries = fullCountries.filter(function (countryKey) {
				return selectCountries.filter(function (country) {
					return countryKey === country;
				}).length === 0;
			});
		}

		this.setState({
			countries: selectCountries || fullCountries
		}, function () {
			var selected = _this3.state.selected;


			if (selected && !_this3.state.countries.includes(selected)) {
				_this3.setState({ selected: null });
			}
		});
	};

	ReactFlagsSelect.prototype.componentDidMount = function componentDidMount() {
		this.setCountries();
		!this.props.disabled && window.addEventListener("click", this.closeOptions);
	};

	ReactFlagsSelect.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		if (prevProps.countries !== this.props.countries || prevProps.blackList !== this.props.blackList) {
			this.setCountries();
		}
	};

	ReactFlagsSelect.prototype.componentWillUnmount = function componentWillUnmount() {
		!this.props.disabled && window.removeEventListener("click", this.closeOptions);
	};

	ReactFlagsSelect.prototype.render = function render() {
		var _this4 = this;

		var isSelected = this.state.selected || this.state.defaultCountry;
		var selectedSize = this.props.selectedSize;
		var optionsSize = this.props.optionsSize;
		var alignClass = this.props.alignOptions.toLowerCase() === 'left' ? 'to--left' : '';

		return React.createElement(
			'div',
			{ className: 'flag-select ' + (this.props.className ? this.props.className : "") },
			React.createElement(
				'button',
				{
					ref: 'selectedFlag',
					style: { fontSize: selectedSize + 'px' },
					className: 'flag-select__btn',
					onClick: this.toggleOptions,
					onKeyUp: function onKeyUp(evt) {
						return _this4.toggleOptionsWithKeyboard(evt);
					},
					disabled: this.props.disabled,
					id: 'select_flag_button',
					type: this.props.buttonType,
					'aria-haspopup': 'listbox',
					'aria-expanded': this.state.openOptions,
					'aria-labelledby': 'select_flag_button' },
				isSelected && React.createElement(
					'span',
					{ className: 'flag-select__option flag-select__option--placeholder' },
					React.createElement('img', { className: 'flag-select__option__icon', src: require('../flags/' + isSelected.toLowerCase() + '.svg'), alt: isSelected }),
					this.props.showSelectedLabel && React.createElement(
						'span',
						{ className: 'flag-select__option__label' },
						this.props.customLabels[isSelected] || countries[isSelected]
					)
				),
				!isSelected && React.createElement(
					'span',
					{ className: 'flag-select__option flag-select__option--placeholder' },
					this.props.placeholder
				)
			),
			this.state.openOptions && React.createElement(
				'ul',
				{ tabIndex: '-1', role: 'listbox', ref: 'flagOptions', style: { fontSize: optionsSize + 'px' }, className: 'flag-select__options ' + alignClass },
				this.props.searchable && React.createElement(
					'div',
					{ className: 'filterBox' },
					React.createElement('input', { type: 'text', placeholder: this.props.searchPlaceholder, ref: 'filterText', onChange: this.filterSearch })
				),
				(this.state.filter ? this.state.filteredCountries : this.state.countries).map(function (countryCode) {
					return React.createElement(
						'li',
						{
							key: countryCode,
							role: 'option',
							tabIndex: '0',
							id: 'select_flag_' + countryCode,
							className: 'flag-select__option ' + (_this4.props.showOptionLabel ? 'has-label' : ''),
							onClick: function onClick() {
								return _this4.onSelect(countryCode);
							},
							onKeyUp: function onKeyUp(evt) {
								return _this4.onSelectWithKeyboard(evt, countryCode);
							} },
						React.createElement(
							'span',
							{ style: { width: optionsSize + 'px', height: optionsSize + 'px' } },
							React.createElement('img', {
								className: 'flag-select__option__icon',
								alt: 'flag for ' + countries[countryCode],
								src: require('../flags/' + countryCode.toLowerCase() + '.svg') }),
							_this4.props.showOptionLabel && React.createElement(
								'span',
								{ className: 'flag-select__option__label' },
								_this4.props.customLabels[countryCode] || countries[countryCode]
							)
						)
					);
				})
			)
		);
	};

	return ReactFlagsSelect;
}(Component);

ReactFlagsSelect.defaultProps = {
	selectedSize: 16,
	optionsSize: 14,
	placeholder: "Select a country",
	showSelectedLabel: true,
	showOptionLabel: true,
	alignOptions: "right",
	customLabels: {},
	disabled: false,
	buttonType: "button",
	blackList: false,
	searchable: false,
	searchPlaceholder: 'Search'
};

ReactFlagsSelect.propTypes = process.env.NODE_ENV !== "production" ? {
	countries: PropTypes.array,
	blackList: PropTypes.bool,
	customLabels: PropTypes.object,
	selectedSize: PropTypes.number,
	optionsSize: PropTypes.number,
	defaultCountry: PropTypes.string,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	showSelectedLabel: PropTypes.bool,
	showOptionLabel: PropTypes.bool,
	alignOptions: PropTypes.string,
	onSelect: PropTypes.func,
	disabled: PropTypes.bool,
	buttonType: PropTypes.string,
	searchable: PropTypes.bool,
	searchPlaceholder: PropTypes.string
} : {};

export default ReactFlagsSelect;