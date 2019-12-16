import React from "react";

export const Add = ({
  color = "blue",
  size = "100%",
  className = "",
  style = {}
}) => (
  <svg
    viewBox="0 0 39.272 36"
    className={`svg-icon ${className || ""}`}
    style={{ width: size, ...style }}
  >
    <path
      id="Path_96"
      data-name="Path 96"
      fill={color}
      d="M38,6H10a4,4,0,0,0-4,4V38a4,4,0,0,0,4,4H38a4,4,0,0,0,4-4V10A4,4,0,0,0,38,6ZM34,26H26v8H22V26H14V22h8V14h4v8h8Z"
      transform="translate(-6 -6)"
    />
  </svg>
);
