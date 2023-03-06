import React from 'react'
// button loader
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const index = ({ label }) => {
    return (
        <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
        >
            {label}
        </LoadingButton>
    )
}

export default index