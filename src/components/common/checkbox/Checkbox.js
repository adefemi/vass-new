import React, { Fragment } from "react";
import PropTypes from "prop-types";
import shortId from "shortid";

import "./Checkbox.css";

const Checkbox = props => {
  const properties = {
    ...props,
    className: "Checkbox " + props.className,
    type: "checkbox"
  };

  return (
    <Fragment>
      <input {...properties} />
      <label htmlFor={props.id}>{props.label}</label>
    </Fragment>
  );
};

//proptypes definition
Checkbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

//default proptypes
Checkbox.defaultProps = {
  id: shortId.generate(),
  label: "",
  name: "",
  onChange: null,
  className: ""
};

export default Checkbox;
