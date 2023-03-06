import React, { Fragment, useEffect, useState } from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { TextField, Button, Divider } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
// components
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
import PageTitle from '../../components/PageTitle';
// charts
import LineChartComponent from '../../components/LineChart';
import BarChartComponent from '../../components/BarChart';
import SystemLogTable from './SystemLogs';
// counters
import Counters from './Counters';
import { Box } from '@mui/material';
// context
import { SystemLogs } from '../../context/LogsContext';
import { DashboardStats } from '../../context/DashboardContext';

const Dashboard = () => {
    // context functions
    const { getAllSystemLogs } = SystemLogs();
    const { 
        getAllUserCount, 
        getAllDocumentCount, 
        getAllSearchCount, 
        calculateBarChartData, 
        calculateUserTrafficData,
        calculateAllTimeSearched,
        calculateDailySearched,
        calculateAllTimeViewed,
        calculateDailyViewed
    } = DashboardStats();
    // state
    const [studentCount, setStudentCount] = useState(0);
    const [facultyCount, setFacultyCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [docsCount, setDocsCount] = useState(0);
    const [searchCount, setSearchCount] = useState(0);
    const [logs, setLogs] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [weeklyUploadAnalytics, setWeeklyUploadAnalytics] = useState([]);
    const [weeklyTrafficAnalytics, setWeeklyTrafficAnalytics] = useState([]);
    const [top5AllTimeSearch, setTop5AllTimeSearch] = useState([]);
    const [dailyTop5Search, setDailyTop5Search] = useState([]);
    const [allTimeViewed, setAllTimeViewed] = useState([]);
    const [dailyViewed, setDailyViewed] = useState([]);
    // get all system Logs
    const _getAllSystemLogs  = async () => {
        try {
            const data = await getAllSystemLogs();
            setLogs(data);
        } catch (error) {
            setLogs([]);
        }
    }

    const _getStudentCount = async () => {
        const count = await getAllUserCount("student");
        setStudentCount(count);
    }

    const _getFacultyCount = async () => {
        const count = await getAllUserCount("faculty");
        setFacultyCount(count);
    }

    const _getAdminCount = async () => {
        const count = await getAllUserCount("super-admin");
        setAdminCount(count);
    }

    const _getDocsCount = async () => {
        const count = await getAllDocumentCount();
        setDocsCount(count)
    }

    const _getSearchCount = async () => {
        const count = await getAllSearchCount();
        setSearchCount(count)
    }

    const _calculateBarChartData = async () => {
        try {
            const data = await calculateBarChartData(startDate);
            setWeeklyUploadAnalytics(data.collectiveWeeklyReport)
        } catch (error) {
            setWeeklyUploadAnalytics([]);
        }
    }

    const _calculateUserTraffic = async () => {
        try {
            const data = await calculateUserTrafficData(startDate);
            setWeeklyTrafficAnalytics(data.collectiveWeeklyReport)
        } catch (error) {
            setWeeklyTrafficAnalytics([]);
        }
    }

    const _calculateAllTimeSearched = async () => {
        try {
            const allTime = await calculateAllTimeSearched();
            const daily = await calculateDailySearched();
            setTop5AllTimeSearch(allTime);
            setDailyTop5Search(daily)
        } catch (error) {
            setTop5AllTimeSearch([]);
            setDailyTop5Search([]);
        }
    }

    const _calculateAllTimeViews = async () => {
        try {
            const allTime = await calculateAllTimeViewed();
            const daily = await calculateDailyViewed();
            setDailyViewed(daily);
            setAllTimeViewed(allTime)
        } catch (error) {
            setTop5AllTimeSearch([]);
            setDailyTop5Search([]);
        }
    }

    useEffect(() => {
        _getAllSystemLogs();
        _getStudentCount();
        _getFacultyCount();
        _getAdminCount();
        _getDocsCount()
        _getSearchCount();
        _calculateBarChartData();
        _calculateUserTraffic();
        _calculateAllTimeSearched();
        _calculateAllTimeViews();
    }, []);

    return (
        <ResponsiveDrawer>
            <PageTitle
                title="Dashboard"
                description="Monitor system activities with the use of visual charts"
            />
            <Counters
                studentCount={studentCount}
                facultyCount={facultyCount}
                adminCount={adminCount}
                docsCount={docsCount}
                searchCount={searchCount}
            />
            
            <p className='dashboard-subheaders'>
                <div className='header-label'>
                    <BarChartIcon/> System Analytics
                </div>
                <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Date"
                            value={startDate}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                            }}
                            renderInput={(params) => <TextField size='small' style={{ marginRight: "10px", width: "350px"}} {...params} />}
                        />
                    </LocalizationProvider>
                    <Button 
                        variant='contained' 
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                            setWeeklyUploadAnalytics([]); 
                            setWeeklyTrafficAnalytics([]);
                            _calculateBarChartData();
                            _calculateUserTraffic();
                        }}
                    >
                        <RefreshIcon/>
                    </Button>
                </div>
            </p>
            <Box sx={{ boxShadow: 4, padding: "10px", marginBottom: "10px", marginRight: "10px", flexGrow: ".5", borderRadius: "5px" }}>
                <p className='chart-label'>Total Number of Thesis Uploaded per Department</p>
                <Box className="chart-container">
                    <BarChartComponent
                        weeklyUploadAnalytics={weeklyUploadAnalytics}
                    />
                </Box>
            </Box>
            <Box sx={{ boxShadow: 4, padding: "10px", marginBottom: "10px", marginRight: "10px", flexGrow: ".5", borderRadius: "5px" }}>
                <p className='chart-label'>User Activity Traffic</p>
                <Box className="chart-container">
                    <LineChartComponent
                        weeklyTrafficAnalytics={weeklyTrafficAnalytics}
                    />
                </Box>
            </Box>
            <p className='dashboard-subheaders mt-3'>
                <div className='header-label'>
                    <EmojiEventsIcon/> Word Ranking
                </div>
            </p>
            <div className='flex mt-2'>
                <Box sx={{ boxShadow: 4, padding: "10px", marginBottom: "10px", marginRight: "10px", flexGrow: ".5", borderRadius: "5px" }}>
                    <p className='chart-label'>All Time Top 5 Most Searched Keyword</p>
                    <Box className="top5-container">
                        {
                            top5AllTimeSearch.map((data, i) => {
                                return (
                                    <Fragment>
                                        <div key={i + 1} className='flex justify-between p-3'>
                                            <div className='flex'>
                                                { 
                                                    (i === 3) || (i === 4)  
                                                    ? <MilitaryTechIcon
                                                        style={{
                                                            color: "#B87333"
                                                        }}
                                                    /> 
                                                    : <EmojiEventsIcon 
                                                        style={{ 
                                                            color: i === 0 ? "gold" : i === 1 ? "silver" : "#B87333"
                                                        }} 
                                                    />
                                                }
                                                <p className='search-label-display'>{data.keyword}</p>
                                            </div>
                                            <p className='search-count-label'>{data.numberOfSearch} {data.numberOfSearch > 1 ? "Searches" : "Search"}</p>
                                        </div>
                                        {
                                            i !== 4 && <Divider/>
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </Box>
                </Box>
                <Box sx={{ boxShadow: 4, padding: "10px", marginBottom: "10px", marginRight: "10px", flexGrow: ".5", borderRadius: "5px" }}>
                    <p className='chart-label'>All Time Top 5 Most Viewed Document</p>
                    <Box className="top5-container">
                        {
                            allTimeViewed.map((data, i) => {
                                return (
                                    <Fragment>
                                        <div key={i + 1} className='flex justify-between p-3'>
                                            <div className='flex'>
                                                { 
                                                    (i === 3) || (i === 4)  
                                                    ? <MilitaryTechIcon
                                                        style={{
                                                            color: "#B87333"
                                                        }}
                                                    /> 
                                                    : <EmojiEventsIcon 
                                                        style={{ 
                                                            color: i === 0 ? "gold" : i === 1 ? "silver" : "#B87333"
                                                        }} 
                                                    />
                                                }
                                                <p className='search-label-display'>{data.docName}</p>
                                            </div>
                                            <p className='search-count-label'>{data.viewCount} {data.viewCount > 1 ? "Views" : "View"}</p>
                                        </div>
                                        {
                                            i !== 4 && <Divider/>
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </Box>
                </Box>
                <Box sx={{ boxShadow: 4, padding: "10px", marginBottom: "10px", marginRight: "10px", flexGrow: ".5", borderRadius: "5px" }}>
                    <p className='chart-label'>Daily Top 5 Most Searched Keyword</p>
                    <Box className="top5-container">
                        {
                            dailyTop5Search.map((data, i) => {
                                return (
                                    <Fragment>
                                        <div key={i + 1} className='flex justify-between p-3'>
                                            <div className='flex'>
                                                { 
                                                    (i === 3) || (i === 4)  
                                                    ? <MilitaryTechIcon
                                                        style={{
                                                            color: "#B87333"
                                                        }}
                                                    /> 
                                                    : <EmojiEventsIcon 
                                                        style={{ 
                                                            color: i === 0 ? "gold" : i === 1 ? "silver" : "#B87333"
                                                        }} 
                                                    />
                                                }
                                                <p className='search-label-display'>{data.keyword}</p>
                                            </div>
                                            <p className='search-count-label'>{data.numberOfSearch} {data.numberOfSearch > 1 ? "Searches" : "Search"}</p>
                                        </div>
                                        {
                                            i !== 4 && <Divider/>
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </Box>
                </Box>
                <Box sx={{ boxShadow: 4, padding: "10px", marginBottom: "10px", marginRight: "10px", flexGrow: ".5", borderRadius: "5px" }}>
                    <p className='chart-label'>Daily 5 Most Viewed Document</p>
                    <Box className="top5-container">
                        {
                            dailyViewed.map((data, i) => {
                                return (
                                    <Fragment>
                                        <div key={i + 1} className='flex justify-between p-3'>
                                            <div className='flex'>
                                                { 
                                                    (i === 3) || (i === 4)  
                                                    ? <MilitaryTechIcon
                                                        style={{
                                                            color: "#B87333"
                                                        }}
                                                    /> 
                                                    : <EmojiEventsIcon 
                                                        style={{ 
                                                            color: i === 0 ? "gold" : i === 1 ? "silver" : "#B87333"
                                                        }} 
                                                    />
                                                }
                                                <p className='search-label-display'>{data.docName}</p>
                                            </div>
                                            <p className='search-count-label'>{data.viewCount} {data.viewCount > 1 ? "Views" : "View"}</p>
                                        </div>
                                        {
                                            i !== 4 && <Divider/>
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </Box>
                </Box>
            </div>
            <p className='dashboard-subheaders mt-3'>
                <div className='header-label'>
                    <SummarizeIcon/> System Logs
                </div>
            </p>
            <Box sx={{ boxShadow: 4, padding: "10px", marginBottom: "10px", marginRight: "10px", flexGrow: ".5", borderRadius: "5px" }}>
                <SystemLogTable
                    rows={logs}
                />
            </Box>
        </ResponsiveDrawer>
    );
}

export default Dashboard;
