import React from "react";

export const Level = ({
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
      id="Path_93"
      data-name="Path 93"
      fill={color}
      d="M38,6H10a4,4,0,0,0-4,4V38a4,4,0,0,0,4,4H38a4,4,0,0,0,4-4V10A4,4,0,0,0,38,6ZM18,34H14V20h4Zm8,0H22V14h4Zm8,0H30V26h4Z"
      transform="translate(-6 -6)"
    />
  </svg>
);
