import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { departments } from '../../../utilities/departments';
import { Divider, Button } from '@mui/material';
import LoadingButton from '../../../components/LoadingButton';

const Administrator = ({
    errors,
    touched,
    formValues,
    handleBlur,
    handleChange,
    isLoading,
    isLoading2,
    handleAction,
    handleAccountEditsLoginCreds
}) => {
    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '100%' },
                padding: "1%",
                marginTop: "20px",
                boxShadow: 3,
                borderRadius: "5px"
            }}
            noValidate
            autoComplete="off"
        >
            <p style={{ fontWeight: "bold", marginLeft: "5px", marginBottom: "10px"}}>Account Profile</p>
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
            <div className='flex flex-row'>
                <FormControl sx={{ m: 1, width: "100%", marginBottom: "20px" }} error={errors.department && touched.department}>
                    <InputLabel id="demo-simple-select-error-label">Department</InputLabel>
                    <Select
                        labelId="demo-simple-select-error-label"
                        id="demo-simple-select-error"
                        name='department'
                        label="Department"
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
            </div>
            <Box className='flex justify-end mb-3 mr-2'>
                {
                    !isLoading ?
                        <Button 
                            variant='contained' 
                            type='button'
                            onClick={() => handleAction()}
                        >
                            Update Profile
                        </Button>
                    :
                        <LoadingButton
                            label="Updating"
                        />
                }
            </Box>
            <Divider/>
            <p style={{ fontWeight: "bold", marginLeft: "5px", marginTop: "10px", marginBottom: "10px"}}>Login Credentials and Change Password</p>
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
                    label="New Password"
                    name='password'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formValues.password}
                    error={errors.password && touched.password}
                    helperText={errors.password && touched.password ? errors.password : ''}
                />
                <TextField
                    id="outlined-helperText"
                    label="Confirm New Password"
                    name='confirmPassword'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formValues.confirmPassword}
                    error={errors.confirmPassword && touched.confirmPassword}
                    helperText={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                />
            </div>
            <Box className='flex justify-end mb-3 mr-2 mt-3'>
                {
                    !isLoading2 ?
                        <Button 
                            variant='contained' 
                            onClick={() => handleAccountEditsLoginCreds()}
                        >
                            Update Credentials
                        </Button>
                    :
                        <LoadingButton
                            label="Updating"
                        />
                }
            </Box>
        </Box>
    );
}

export default Administrator;
