import React from "react";
import PropTypes from "prop-types";

import "./Spinner.css";

const defaultProps = {
  type: "default",
  color: "#ffffff",
  size: 15
};

const propTypes = {
  type: PropTypes.oneOf(["default", "alternate"]),
  color: PropTypes.string,
  size: PropTypes.number
};

const Spinner = props => {
  return (
    <div
      style={{
        borderRightColor: props.color,
        width: `${props.size}px`,
        height: `${props.size}px`
      }}
      className={`lds-dual-ring ${props.type}`}
    />
  );
};

Spinner.defaultProps = defaultProps;
Spinner.propTypes = propTypes;

export default Spinner;
