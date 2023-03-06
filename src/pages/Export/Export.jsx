import React, { useState } from 'react';
// components
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
import PageTitle from '../../components/PageTitle';
// mui components
import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { departments } from '../../utilities/departments';
import { Documents } from '../../context/DocumentsContext';
import SnackbarComponent from '../../components/Snackbar';

const Export = () => {
    const { exportFiles } = Documents();
    const [department, setDepartment] = useState("");

    // snackbar state
    const [openSnackBar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [snackBarType, setSnackbarType] = useState('');

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleChange = (val) => {
        setDepartment(val);
    };

    const handleClick = async() =>{
        if(department !== ""){
            try {
                await exportFiles(department);
                setSnackbarType('success');
                setMessage('Files Downloaded')
                setOpenSnackbar(true);
            } catch (error) {
                console.log(error)
                setSnackbarType('error');
                setMessage('No File in this Department or Firebase is not responding')
                setOpenSnackbar(true);
            }
        }else{
            setSnackbarType('error');
            setMessage('Please select a Department')
            setOpenSnackbar(true);
        }
    }

    return(
        <ResponsiveDrawer>
            <Box sx={{ boxShadow: 2, borderRadius: "5px", padding: "20px" }} >
                <PageTitle
                    title="Export Files"
                    description="Export files from the File Storage"
                />
                <div className='flex flex-wrap mt-2'>
                    <FormControl sx={{m: 1, flex: "1 0 42%"}}>
                        <InputLabel id="demo-simple-select-autowidth-label">Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={department}
                            onChange={e=>handleChange(e.target.value)}
                            label="Department"
                            required
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {departments.map((dep)=>{
                            return(<MenuItem key={dep} value={dep}>{dep}</MenuItem>)
                        })}
                        </Select>
                    </FormControl>
                    <Button 
                        onClick={()=>handleClick()}
                        variant="contained"
                        sx={{m: 1, flex: "1 0 21%"}}
                    >
                        Download Files<FileDownloadIcon/>
                    </Button>
                </div>
            </Box>
            {/* Snackbar notifications */}
            <SnackbarComponent
                open={openSnackBar}
                type={snackBarType}
                message={message}
                handleClose={handleCloseSnackbar}
            />
        </ResponsiveDrawer>
    )
}
export default Export