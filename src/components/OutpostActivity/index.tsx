import React from 'react';
import styled from 'styled-components'

const ComponentStyle = styled.div`
    .mobile-section{
        display:none;
    }
    @media(max-width:1143px){
        .ship-list-section{
            display:block;
        }
        .ship-filter-section{
            width:100%;
        }
    }
    @media(max-width:992px){
        .desktop-section{
            display:none;
        }
        .mobile-section{
            display:block;
        }
    }
`

import SoldChart from '../SoldChart';
import SoldChartShipList from '../SoldChartShipList';

export default function OutpostActivity() {
    return (
        <ComponentStyle className='w-full'>
            <SoldChart />
            <SoldChartShipList />
        </ComponentStyle>
    )

}