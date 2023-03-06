import React from 'react';
// components
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
import PageTitle from '../../components/PageTitle';
// mui components
import { Box } from '@mui/material';

const About = () => {
    return(
        <ResponsiveDrawer>
            <Box sx={{ boxShadow: 2, borderRadius: "5px", padding: "20px" }} >
                <PageTitle
                    title="About Us"
                    description="The Tanglaw Thesis Respository is a digital repository of theses and dissertations of students, faculty and researchers of Computer Engineering Department of Tanglaw Manila."
                />
            </Box>
        </ResponsiveDrawer>
    )
}
export default About;