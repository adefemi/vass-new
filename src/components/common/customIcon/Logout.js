import React from "react";

export const Logout = ({
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
      id="Union_11"
      data-name="Union 11"
      fill={color}
      d="M-4298.606,36A1.394,1.394,0,0,1-4300,34.606c0-.04,0-.078.005-.117s-.005-.078-.005-.117V1.541c0-.025,0-.05,0-.074s0-.049,0-.072A1.4,1.4,0,0,1-4298.606,0h18.921a1.385,1.385,0,0,1,.632.152A1.441,1.441,0,0,1-4278,1.541V9.228a1.441,1.441,0,0,1-1.441,1.441,1.441,1.441,0,0,1-1.44-1.441V2.789h-16.24V33.212h16.24V26.686a1.441,1.441,0,0,1,1.44-1.441A1.441,1.441,0,0,1-4278,26.686v7.687a1.441,1.441,0,0,1-.754,1.267,1.391,1.391,0,0,1-.935.359Zm22.262-14.532a1.361,1.361,0,0,1,0-1.972l.146-.141h-10.982a1.4,1.4,0,0,1-1.395-1.394,1.4,1.4,0,0,1,1.395-1.394h11.278l-.441-.427a1.361,1.361,0,0,1,0-1.972,1.476,1.476,0,0,1,2.037,0l2.564,2.482a1.365,1.365,0,0,1,.422.973,1.4,1.4,0,0,1,.042.338,1.392,1.392,0,0,1-.554,1.112l-2.475,2.4a1.463,1.463,0,0,1-1.019.408A1.459,1.459,0,0,1-4276.344,21.468Z"
      transform="translate(4300)"
    />
  </svg>
);
