import React from 'react';
// components
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
import PageTitle from '../../components/PageTitle';
// mui components
import { Box, Typography } from '@mui/material';

const Contact = () => {
    return(
        <ResponsiveDrawer>
            <Box sx={{ boxShadow: 2, borderRadius: "5px", padding: "20px" }} >
                <PageTitle
                    title="Contact Us"
                    description="Polytechnic University of the Philippines"
                />
                <Typography variant="subtitle2">
                    Tanglaw Engineering and Architecture Bldg. <br/>
                    
                    Anonas St., Sta. Mesa <br/>
                    
                    Manila 1016 <br/>
                    
                    Tel Nos.335-1762 (direct line) <br/>
                    
                    335-1777 or 335-1787 (trunk lines) <br/>
                    
                    Email: library@Tanglaw.edu.ph
                </Typography>
            </Box>
        </ResponsiveDrawer>
    )
}
export default Contact