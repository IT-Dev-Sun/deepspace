import React from 'react';
import styled from 'styled-components';
const ComponentStyle = styled.div`
    color:white;
`;

export default function ChartAxisTick(props) {
    const { x, y, stroke, payload } = props;
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={50} y={0} dy={16} textAnchor="end" fill="#666">
                {payload.value}
            </text>
        </g>
    );
    // }

    // return null;
}