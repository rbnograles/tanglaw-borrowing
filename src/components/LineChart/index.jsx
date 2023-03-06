import React, { Fragment } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

const LineChartComponent = ({ weeklyTrafficAnalytics }) => {
    const colors = ["#5FAD56", "#F2C14E", "#F78154"]
    return (
        <Fragment>
            {
                weeklyTrafficAnalytics.length === 0 ?
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
                        <LineChart
                            width={500}
                            height={500}
                            data={weeklyTrafficAnalytics}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis  allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            {
                                ["super-admin", "student", "faculty"].length > 0 && ["super-admin", "student", "faculty"].map((type, i) => {
                                    return <Line key={i} type="monotone" dataKey={type} stroke={colors[i]} fill={colors[i]}/>
                                })
                            }
                        </LineChart>
                    </ResponsiveContainer>
            }
        </Fragment>
    );
}

export default LineChartComponent;
