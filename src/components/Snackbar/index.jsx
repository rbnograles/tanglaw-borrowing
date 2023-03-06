import React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarComponent = ({ open, handleClose, message, type}) => {
    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar 
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={open} 
                autoHideDuration={6000} 
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {message}
                </Alert>
        </Snackbar>
        </Stack>
    );
}

export default SnackbarComponent;
