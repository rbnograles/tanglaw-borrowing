import React from 'react';
import DraggableDialog from '../../../components/Modal';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { departments } from "../../../utilities/departments";

const Create = ({ 
    open, 
    errors,
    touched,
    formValues,
    isLoading, 
    processLabel,
    handleOpen, 
    handleClose, 
    handleAction, 
    handleBlur,
    handleChange 
}) => {
    return (
        <DraggableDialog
            open={open}
            maxWidth="md"
            title="Create Student Account"
            handleOpen={handleOpen}
            handleClose={handleClose}
            handleAction={handleAction}
            isLoading={isLoading} 
            processLabel={processLabel}
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
                    <p style={{ fontWeight: "bold", marginLeft: "5px"}}>Account Profile</p>
                    <div className='flex flex-row'>
                        <TextField
                            id="outlined-helperText"
                            label="First name"
                            name='firstName'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formValues.firstName}
                            error={errors.firstName && touched.firstName}
                            helperText={errors.firstName && touched.firstName ? errors.firstName : ''}
                        />
                        <TextField
                            id="outlined-helperText"
                            label="Middle name (Optional)"
                            name='middleName'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formValues.middleName}
                            error={errors.middleName && touched.middleName}
                            helperText={errors.middleName && touched.middleName ? errors.middleName : ''}
                        />
                        <TextField
                            id="outlined-helperText"
                            label="Last name"
                            name='lastName'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formValues.lastName}
                            error={errors.lastName && touched.lastName}
                            helperText={errors.lastName && touched.lastName ? errors.lastName : ''}
                        />
                        <TextField
                            id="outlined-helperText"
                            label="Suffix"
                            name='suffix'
                            sx={{ maxWidth: "100px" }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formValues.suffix}
                            error={errors.suffix && touched.suffix}
                            helperText={errors.suffix && touched.suffix ? errors.suffix : ''}
                        />
                    </div>
                    <div className='flex flex-row mb-2'>
                        <FormControl sx={{ m: 1, minWidth: 120 }} error={errors.department && touched.department}>
                            <InputLabel id="demo-simple-select-error-label">Department</InputLabel>
                            <Select
                                labelId="demo-simple-select-error-label"
                                id="demo-simple-select-error"
                                name='department'
                                label="Department"
                                className='select-fullwidth'
                                value={formValues.department}
                                onBlur={handleBlur}
                                onChange={handleChange}
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
                            <FormHelperText>{errors.department && touched.department ? errors.department : ''}</FormHelperText>
                        </FormControl>
                        <TextField
                            id="outlined-helperText"
                            label="Student Number"
                            name='studentNumber'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formValues.studentNumber}
                            error={errors.studentNumber && touched.studentNumber}
                            helperText={errors.studentNumber && touched.studentNumber ? errors.studentNumber : ''}
                        />
                    </div>
                    <p style={{ fontWeight: "bold", marginLeft: "5px"}}>Login Credentials</p>
                    <div className='flex flex-row'>
                        <TextField
                            id="outlined-helperText"
                            label="PUP Email Address"
                            name='email'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formValues.email}
                            error={errors.email && touched.email}
                            helperText={errors.email && touched.email ? errors.email : ''}
                        />
                    </div>
                    <div className='flex flex-row mt-2'>
                        <TextField
                            id="outlined-helperText"
                            label="Password"
                            name='password'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formValues.password}
                            error={errors.password && touched.password}
                            helperText={errors.password && touched.password ? errors.password : ''}
                        />
                        <TextField
                            id="outlined-helperText"
                            label="Confirm Password"
                            name='confirmPassword'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formValues.confirmPassword}
                            error={errors.confirmPassword && touched.confirmPassword}
                            helperText={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                        />
                    </div>
                </Box>
            </DialogContent>
        </DraggableDialog>
    );
}

export default Create;
