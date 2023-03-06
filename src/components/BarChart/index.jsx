import React, { Fragment, useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { departments } from '../../utilities/departments';

const BarChartComponent = ({ weeklyUploadAnalytics }) => {
  // states
  const colors = ["#5FAD56", "#F2C14E", "#F78154", "#4D9078", "#B4436C", "#222E50", "#2A4849", "#A393BF", "#9882AC", "#73648A", "#453750", "#0C0910"]

  return (
    <Fragment>
      {
      weeklyUploadAnalytics.length === 0 ?
        <Stack style={{ padding: "10px"}}>
          <Skeleton variant="rectangular" width="100%" animation="wave" height={170} style={{ marginBottom: "10px"}} />
          <Skeleton variant="text" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" />
        </Stack>
      :
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={weeklyUploadAnalytics}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {
              departments.length > 0 && departments.map((department, i) => {
                  return <Bar key={i} type="monotone" dataKey={department} stroke={colors[i]} fill={colors[i]}/>
              })
            }
          </BarChart>
        </ResponsiveContainer>
      }
    </Fragment>
  )
}

export default BarChartComponent;
