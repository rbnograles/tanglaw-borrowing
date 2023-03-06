import React from 'react';
import DraggableDialog from '../../../components/Modal';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { departments } from '../../../utilities/departments';

const Edit = ({ 
    open, 
    isLoading, 
    editValues,
    processLabel,
    handleOpen, 
    handleClose, 
    handleAction,
    handleChange
}) => {
    return (
        <DraggableDialog
            open={open}
            maxWidth="sm"
            title="Edit Department"
            handleOpen={handleOpen}
            handleClose={handleClose}
            handleAction={handleAction}
            isLoading={isLoading} 
            processLabel={processLabel}
            label="Proceed"
        >   
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '100%' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <FormControl sx={{ m: 1, minWidth: "99%", flexGrow: 1 }}>
                        <InputLabel id="demo-simple-select-error-label">Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-error-label"
                            id="demo-simple-select-error"
                            name='department'
                            label="Department"
                            className='select-fullwidth'
                            value={editValues}
                            onChange={e => handleChange(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                departments?.map((department, i) => {
                                    return(
                                        <MenuItem key={i} value={department}>
                                            {department}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
        </DraggableDialog>
    );
}

export default Edit;
