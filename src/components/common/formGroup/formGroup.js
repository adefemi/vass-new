import React from "react";
import "./formGroup.css";

function FormGroup(props) {
  return (
    <div className={`form-group ${props.className}`} style={props.style}>
      <label htmlFor={props.name}>{props.title}</label>
      {props.children}
    </div>
  );
}

export default FormGroup;
