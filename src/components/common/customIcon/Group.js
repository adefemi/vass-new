import React from "react";

export const Group = ({
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
      id="Union_8"
      data-name="Union 8"
      fill={color}
      d="M-5590.887-154a.566.566,0,0,1-.564-.53l-.538-8.6-2.4-.48a.562.562,0,0,1-.454-.553V-171.5a5.087,5.087,0,0,1,5.08-5.081h4.517a5.088,5.088,0,0,1,5.081,5.081v7.339a.566.566,0,0,1-.455.554l-2.4.478-.537,8.6a.564.564,0,0,1-.563.53Zm11.855-4.517a.564.564,0,0,1-.564-.525l-.262-3.669a1.7,1.7,0,0,0,.826-1.452V-171.5a6.185,6.185,0,0,0-1.758-4.32,3.934,3.934,0,0,1,2.322-.761h4.516a3.956,3.956,0,0,1,3.953,3.951v4.517a.564.564,0,0,1-.313.5l-1.97.985-.542,7.583a.564.564,0,0,1-.562.523Zm-22.581,0a.564.564,0,0,1-.563-.523l-.542-7.583-1.971-.985a.565.565,0,0,1-.312-.5v-4.517a3.956,3.956,0,0,1,3.952-3.951h4.517a3.934,3.934,0,0,1,2.323.761,6.186,6.186,0,0,0-1.759,4.32v7.339a1.7,1.7,0,0,0,.826,1.452l-.262,3.669a.566.566,0,0,1-.564.525Zm21.452-24.273a3.952,3.952,0,0,1,3.951-3.953,3.953,3.953,0,0,1,3.953,3.953,3.952,3.952,0,0,1-3.953,3.951A3.952,3.952,0,0,1-5580.161-182.79Zm-12.419-1.13A5.087,5.087,0,0,1-5587.5-189a5.088,5.088,0,0,1,5.081,5.081,5.088,5.088,0,0,1-5.081,5.081A5.087,5.087,0,0,1-5592.581-183.919Zm-10.161,1.13a3.951,3.951,0,0,1,3.951-3.953,3.952,3.952,0,0,1,3.952,3.953,3.952,3.952,0,0,1-3.952,3.951A3.951,3.951,0,0,1-5602.741-182.79Z"
      transform="translate(5605 189)"
    />
  </svg>
);