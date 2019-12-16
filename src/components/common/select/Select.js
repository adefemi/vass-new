import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./Select.css";
import { getNewProps } from "../input/Input";

let selectCount = 0;

const defaultPropList = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOf(["default", "small", "large"]),
  disabled: PropTypes.bool,
  iconLeft: PropTypes.any,
  placeholder: PropTypes.string,
  showDropDown: PropTypes.bool,
  displayed: PropTypes.any,
  children: PropTypes.any,
  secondary: PropTypes.bool,
  defaultOption: PropTypes.bool
};

// function to check if an element has a class
export const hasClass = (el, className) => {
  if (!el) {
    return;
  }
  return el.classList.contains(className);
};

// function to add a class to an element
export const addClass = (el, className) => {
  if (!el) {
    return;
  }
  el.classList.add(className);
};

// function to remove a class from an element
export const removeClass = (ele, cls) => {
  if (!ele) {
    return;
  }
  if (hasClass(ele, cls)) {
    ele.classList.remove(cls);
  }
};

const fixChildren = (children, props) => {
  if (typeof children !== "object") {
    return null;
  }

  if (!children || children.length < 1) {
    return null;
  }

  let newChildren = children;
  if (!children.length) {
    newChildren = [children];
  }

  if (props.defaultOption) {
    let defaultOpt = newChildren[0];
    newChildren = newChildren[1];
    newChildren.unshift(defaultOpt);
  }

  newChildren = newChildren.filter(item => {
    if (typeof item !== "object") {
      return null;
    } else if (!item || item.length < 1) {
      return null;
    } else if (!item.length) {
      return item;
    } else {
      for (let i = 0; i < item.length; i++) {
        return item[parseInt(i, 10)];
      }
    }
    return null;
  });
  return newChildren;
};

// base functional component for select, makes use of react hooks...
const Select = props => {
  let newProps = getNewProps(props, defaultPropList);
  let children = fixChildren(props.children, props);

  const [count, setCount] = useState(selectCount);
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    setCount(selectCount++);
    setValue(props.value);
  }, [props.value]);

  const onChange = e => {
    setValue(e.target.value);
    props.onChange(e);
  };

  return (
    <div
      className={
        props.error
          ? props.className +
            ` select-control select${count}  error ` +
            props.size
          : props.className + ` select-control select${count} ` + props.size
      }
      style={{ ...props.style }}
    >
      <div
        className={`select-button select${count} ${
          props.disabled ? "disabled" : ""
        } ${props.secondary && "secondary"}`}
      >
        {props.iconLeft && <span className="left-icon">{props.iconLeft}</span>}

        <select
          className={`selectInput${count} ${props.disabled ? "disabled" : ""}`}
          onChange={onChange}
          disabled={props.disabled}
          placeholder={props.placeholder || ""}
          value={value}
          name={props.name}
          autoComplete={"new"}
          {...newProps}
        >
          {children &&
            children.length > 0 &&
            children.map((item, key) => (
              <option
                key={key}
                value={item.props.value}
                data-order={item.props.order}
              >
                {item.props.children}
              </option>
            ))}
        </select>
      </div>

      {props.error && (
        <div className={`select-error-text select${count}`}>
          {props.errorText}
        </div>
      )}
    </div>
  );
};

// select component extension to handle option...
Select.Option = ({ value, displayed }) => null;

Select.propTypes = defaultPropList;

Select.defaultProps = {
  value: "Hello",
  onChange: () => null,
  error: false,
  errorText: "Invalid selection",
  className: "",
  size: "default",
  disabled: false,
  placeholder: "Make a selection",
  showDropDown: true,
  secondary: false
};

export default Select;
