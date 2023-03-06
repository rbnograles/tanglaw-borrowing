import React, { useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';

const FacultyLogin = (props) => {

    const [showPassword, setShowPassword] = useState(false);
    const { setEmail, email, setPassword, password, errors } = props;

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className='flex flex-auto justify-around'>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div className='flex flex-col form-container' style={{ width: "100%"}}>
                    <FormControl variant="outlined" sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-password">PUP Faculty Email</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={'text'}
                            value={email}
                            error={errors && errors.toLowerCase().includes('email')}
                            onChange={e => { setEmail(e.target.value) }}
                            sx={{
                                width: "435px",
                                borderRadius: "5px"
                            }}
                            label="PUP Student Email"
                        />
                        {
                            (errors && errors.toLowerCase().includes('email')) && 
                            <FormHelperText
                                style={{ color: "rgb(188, 33, 33)" }}
                            >
                                {errors}
                            </FormHelperText>
                        }
                    </FormControl>
                    <FormControl variant="outlined" sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            error={errors && errors.toLowerCase().includes('password')}
                            onChange={e => { setPassword(e.target.value) }}
                            sx={{
                                width: "435px",
                                borderRadius: "5px"
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {!showPassword ? <VisibilityOff color='primary' /> : <Visibility color='primary' />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                        {
                            errors.toLowerCase().includes('password') && 
                            <FormHelperText
                                style={{ color: "rgb(188, 33, 33)" }}
                            >
                                {errors}
                            </FormHelperText>
                        }
                    </FormControl>
                </div>
            </Box>
        </div>
    )
}

export default FacultyLogin