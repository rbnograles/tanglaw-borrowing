import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// custom components
import Faculty from '../../Faculty';
import Student from '../../Student';
import Administrator from "../../Administrator";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const AccountTabs = (props) => {
    // constants
    const { tabs, profile } = props;
    // state
    const [value, setValue] = useState(0);
    // for changing the tab view
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1.5, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {
                        tabs.map((tab, index) => {
                            return (<Tab key={index} label={tab} {...a11yProps(index)} />)
                        })
                    }
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Student/>
            </TabPanel>
            {
                profile.userType === "super-admin" && 
                <TabPanel value={value} index={1}>
                    <Faculty/>
                </TabPanel>
            }
            {
                profile.userType === "super-admin" && 
                <TabPanel value={value} index={2}>
                    <Administrator/>
                </TabPanel>
            }
        </Box>
    );
}

export default AccountTabs;