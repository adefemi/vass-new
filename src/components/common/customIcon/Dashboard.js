import React from "react";

export const Dashboard = ({
  color = "blue",
  size = "100%",
  className = "",
  style = {}
}) => (
  <svg
    viewBox="0 0 36 36"
    className={`svg-icon ${className || ""}`}
    style={{ width: size, ...style }}
  >
    <path
      id="Path_84"
      data-name="Path 84"
      fill={color}
      d="M6,26H22V6H6ZM6,42H22V30H6Zm20,0H42V22H26ZM26,6V18H42V6Z"
      transform="translate(-6 -6)"
    />
  </svg>
);
