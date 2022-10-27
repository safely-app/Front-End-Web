import * as React from "react"

const LogoSafely = (props) => (
  <svg
    width={150}
    height={40}
    viewBox="0 0 124.221 47.649"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="a">
        <stop
          style={{
            stopColor: "#1d3655",
            stopOpacity: 1,
          }}
          offset={0.154}
        />
        <stop
          style={{
            stopColor: "#4179b5",
            stopOpacity: 0,
          }}
          offset={1}
        />
      </linearGradient>
      <linearGradient
        xlinkHref="#a"
        id="b"
        x1={96.991}
        y1={62.101}
        x2={97.556}
        y2={188.675}
        gradientUnits="userSpaceOnUse"
      />
    </defs>
    <g transform="translate(-73.505 -62.214)">
      <text
        xmlSpace="preserve"
        style={{
          fontVariant: "normal",
          fontWeight: 400,
          fontStretch: "normal",
          fontSize: "22.5778px",
          fontFamily: "Comfortaa",
          InkscapeFontSpecification: "Comfortaa-Regular",
          writingMode: "lr-tb",
          fill: "#1d3655",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none",
          strokeWidth: 0.352778,
        }}
        x={130.859}
        y={92.121}
      >
        <tspan
          style={{
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: 700,
            fontStretch: "normal",
            fontSize: "22.5778px",
            fontFamily: "'Work Sans'",
            InkscapeFontSpecification: "'Work Sans Bold'",
            fill: "#1d3655",
            fillOpacity: 1,
            strokeWidth: 0.352778,
          }}
          x={130.859}
          y={92.121}
        >
          {"safely"}
        </tspan>
      </text>
      <ellipse
        style={{
          fill: "url(#b)",
          fillOpacity: 1,
          strokeWidth: 0.264583,
        }}
        cx={97.104}
        cy={86.039}
        rx={23.599}
        ry={23.824}
      />
      <path
        d="M0 0c-36.984 0-66.966 29.981-66.966 66.966 0 21.894 10.508 41.332 26.754 53.551-37.147-4.09-66.046-35.572-66.046-73.809 0-41.014 33.249-74.263 74.264-74.263 26.708 0 50.119 14.102 63.205 35.263C21.891 2.789 11.271 0 0 0"
        style={{
          fill: "#fef3aa",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none",
        }}
        transform="matrix(.23204 0 0 -.23204 106.35 95.84)"
      />
    </g>
  </svg>
)

export default LogoSafely
