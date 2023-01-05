import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { assetURL } from '../../functions/deepspace';
const ComponentStyle = styled.div`
    .chart-tooltip{
        background-color: rgba(0,0,0,0.9);
        border-radius: 3px;
        border: 1px solid gray;
        width: 100%;
        height: 100%;
        padding: 6px 12px;
        font-family: sans-serif;
        font-size: 12px;
        color: white;
    }
`;

export default function ChartToolTip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <ComponentStyle className="w-full h-full">
                <div className="chart-tooltip">
                    <p>
                        <span className='pr-2'>Date:</span>
                        <span style={{ color: 'cyan' }}>{payload[0].payload.name}</span>
                    </p>
                    <p className="label flex items-start" style={{ color: "yellow" }}>
                        <span className='pr-2'>Floor Price:</span>
                        <span className='pr-1' style={{ color: 'cyan' }}>{payload[1].value}</span>
                        <div style={{ marginTop: '1px' }}>
                            <Image
                                unoptimized={true}
                                src={assetURL("DPS-icon-96x96-1.png")}
                                alt="DEEPSPACE"
                                width="12px"
                                height="12px"
                                objectFit="contain"
                                className=""
                            />
                        </div>
                    </p>
                    <p className="intro" style={{ color: "#7F16D3" }}><span className='pr-2'>Total Ships Sold:</span><span style={{ color: 'cyan' }}>{payload[0].value}</span></p>
                </div>
            </ComponentStyle>
        );
    }

    return null;
}