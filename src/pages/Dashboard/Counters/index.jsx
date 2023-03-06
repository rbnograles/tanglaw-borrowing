import * as React from 'react';
import Box from '@mui/material/Box';

export default function Counters({
    studentCount,
    facultyCount,
    adminCount,
    docsCount,
    searchCount
}) {
    return (
        <Box 
            className='flex justify-between'
            style={{
                width: "100%",
                marginBottom: "20px"
            }}
        >
            <Box
                className='counterCards'
                sx={{ boxShadow: 4 }}
            >
                <div className='counter-content-container'>
                    <p className='label'>Registered Student</p>
                    <p className='count'>{studentCount}</p> 
                </div>
            </Box>
            <Box
                className='counterCards'
                sx={{ boxShadow: 4 }}
            >
                <div className='counter-content-container'>
                    <p className='label'>Registered Faculty</p>
                    <p className='count'>{facultyCount}</p> 
                </div>
            </Box>
            <Box
                className='counterCards'
                sx={{ boxShadow: 4 }}
            >
                <div className='counter-content-container'>
                    <p className='label'>Registered Administrator</p>
                    <p className='count'>{adminCount}</p> 
                </div>
            </Box>
            <Box
                className='counterCards'
                sx={{ boxShadow: 4 }}
            >
                <div className='counter-content-container'>
                    <p className='label'>Thesis Uploaded</p>
                    <p className='count'>{docsCount}</p> 
                </div>
            </Box>
            <Box
                className='counterCards'
                sx={{ boxShadow: 4 }}
            >
                <div className='counter-content-container'>
                    <p className='label'>Total Searches</p>
                    <p className='count'>{searchCount}</p> 
                </div>
            </Box>
        </Box>
    );
}
