import React, { PureComponent, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components'
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

import ChartToolTip from '../ChartToolTip';
import Image from 'next/image';
import { assetURL } from '../../functions/deepspace';
import { CHART_INTERVAL } from '../../constants';
import { useSoldShipChartData } from '../../services/graph/hooks/deepspace';

const ComponentStyle = styled.div`
    .sold-chart{
        border:2px solid cyan;
    }
    .sold-chart-body{
        height:250px;
        background-color:rgb(6 8 7 / 66%);
        
    }
    .sold-chart-title{
        padding:3px 3px;
        background-color:rgba(0,0,0,0.7);
        color:cyan;
    }
    .sold-ship-select{
        padding:6px 12px;
        color:gray;
        margin-bottom:6px;
        cursor:pointer;
    }
    .sold-ship-select:focus-visible{
        outline:none;
    }
`
export default function SoldChart() {
    const [chartIndex, setChartIndex] = useState(0);
    const { data: chartData, mutate: chartMutate, error: charError } = useSoldShipChartData(CHART_INTERVAL[chartIndex].key);

    const renderColorfulLegendText = (value: string, entry: any) => {
        const { color } = entry;
        return <span style={{ color: 'white' }}>{value}</span>;
    };

    const handleChartDate = (key) => {
        setChartIndex(key);
    }

    return (
        <ComponentStyle className="w-full">

            <div className='flex justify-center md:block'>
                <select className=' sold-ship-select goldman-font' onChange={(e) => { handleChartDate(e.target.value) }} defaultValue={CHART_INTERVAL[chartIndex].key}>
                    {
                        CHART_INTERVAL && CHART_INTERVAL.map((item, key) => {
                            return (
                                <option value={key} key={key}>{item.name}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div className='w-full sold-chart'>
                <div className='flex items-center justify-center sold-chart-title goldman-font'>
                    <span className='py-2 pr-2 text-sm md:text-lg'>Genesis Collection Floor Price: </span>
                    <span style={{ color: 'cyan' }}>
                        {
                            chartData && chartData.length && (
                                <>{chartData[chartData.length - 1].floorPrice}</>
                            )
                        }
                    </span>
                    <div className='hidden md:block'>
                        <div className='pt-1 pl-1'>
                            <Image
                                unoptimized={true}
                                src={assetURL("DPS-icon-96x96-1.png")}
                                alt="DEEPSPACE"
                                width="21px"
                                height="21px"
                                objectFit="contain"
                                className=""
                            />
                        </div>
                    </div>
                    <div className='block md:hidden'>

                        <div className='pt-2 pl-1'>
                            <Image
                                unoptimized={true}
                                src={assetURL("DPS-icon-96x96-1.png")}
                                alt="DEEPSPACE"
                                width="15px"
                                height="15px"
                                objectFit="contain"
                                className=""
                            />
                        </div>
                    </div>
                </div>
                <div className='sold-chart-body'>
                    {
                        chartData && chartData.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    width={1000}
                                    height={400}
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: -15,
                                        bottom: 10,
                                        left: 0,
                                    }}
                                >
                                    <CartesianGrid stroke="#EFEFEF" height={0.5} vertical={false} strokeDasharray="4 1 2" />
                                    <Bar yAxisId="left" name="Total Ships Sold" dataKey="numShipsSold" barSize={10} fill="#7F16D3" isAnimationActive={true} />
                                    <Line yAxisId="right" name="Floor Price" type="monotone" dot={false} dataKey="floorPrice" stroke="yellow" strokeWidth={2} />
                                    <YAxis yAxisId="right" orientation="left" stroke="yellow" />
                                    <YAxis yAxisId="left" orientation="right" stroke="#8884d8" />
                                    <XAxis dataKey="name" label={{ value: '', position: 'insideBottomRight', offset: -10 }} scale="band" tick={{ stroke: 'white', fontSize: '12px' }} />
                                    <Legend verticalAlign="top" height={36} iconSize={15} wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} formatter={renderColorfulLegendText} />
                                    <Tooltip content={ChartToolTip} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : ('')
                    }
                </div>
            </div>
        </ComponentStyle>
    )
}