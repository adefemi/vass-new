import React, { useState } from "react";
import PropTypes from "prop-types";
import countryControl from "country-state-city";

import "./Input.css";
import { Select } from "../select";

const defaultPropList = {
  value: PropTypes.any,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOf(["default", "small", "large"]),
  disabled: PropTypes.bool,
  iconLeft: PropTypes.any,
  iconRight: PropTypes.any,
  placeholder: PropTypes.string,
  secondary: PropTypes.bool
};

export const getNewProps = (props, defaultPropList) => {
  let newProps = { ...props };

  for (let key in defaultPropList) {
    if (newProps.hasOwnProperty(key)) {
      delete newProps[key.toString()];
    }
  }
  return newProps;
};

const getCountryCodes = () => {
  let allCountry = countryControl.getAllCountries();
  let arrayContent = [];

  allCountry.map(country => {
    arrayContent.push({
      value: country.phonecode,
      content: `${country.sortname} - ${country.phonecode}`,
      displayed: `+${country.phonecode}`
    });
    return null;
  });

  return arrayContent;
};

const convertValue = (props, code) => {
  if (!props.value) {
    return "";
  }
  if (props.type !== "phone") {
    return props.value;
  }
  let value = props.value.split("");
  let newValue = props.value.split("");
  let codeConvert = value[0] === "+" ? `+${code}`.split("") : code.split("");

  if (codeConvert.length > value.length) {
    return props.value;
  }

  for (let i = 0; i < codeConvert.length; i++) {
    if (codeConvert[parseInt(i, 10)] === value[parseInt(i, 10)]) {
      newValue.splice(0, 1);
    } else {
      return props.value;
    }
  }
  return newValue.join("");
};

const Input = props => {
  let newProps = getNewProps(props, defaultPropList);
  let inputType = props.type;
  if (inputType === "currency") {
    inputType = "text";
  }

  const [defaultCode, setDefaultCode] = useState("234");

  return (
    <div
      className={
        props.error
          ? props.className + " input-control error " + props.size
          : props.className + " input-control " + props.size
      }
      style={props.style}
    >
      <div className="input-container-cover">
        {props.type === "phone" && (
          <Select
            showDropDown={false}
            placeholder=""
            className={`dropdown-control ${props.className} ${
              props.disabled ? "disabled" : ""
            }`}
            value={defaultCode}
            displayed={`+${defaultCode}`}
            onChange={e => setDefaultCode(e.target.value)}
          >
            {getCountryCodes().map((codes, index) => (
              <Select.Option
                key={index}
                value={codes.value}
                displayed={codes.displayed}
              >
                {codes.content}
              </Select.Option>
            ))}
          </Select>
        )}
        <div
          className={`input-field ${props.className} ${
            props.disabled ? "disabled" : ""
          } ${props.secondary && "secondary"}`}
        >
          {props.iconLeft}
          <input
            placeholder={props.placeholder}
            type={inputType}
            value={convertValue(props, defaultCode)}
            disabled={props.disabled}
            onChange={e => {
              if (props.type === "phone") {
                e.target.value = `+${defaultCode}${e.target.value}`;
                props.onChange(e);
              } else {
                props.onChange(e);
              }
            }}
            {...newProps}
          />
          {props.iconRight}
        </div>
      </div>
      {props.error && (
        <div className={"input-error-text"}>{props.errorText}</div>
      )}
    </div>
  );
};

Input.Option = ({ value }) => null;

Input.propTypes = defaultPropList;

Input.defaultProps = {
  value: "",
  type: "text",
  onChange: () => null,
  error: false,
  errorText: "Invalid input",
  className: "",
  size: "default",
  disabled: false,
  placeholder: "",
  secondary: false
};

export default Input;
