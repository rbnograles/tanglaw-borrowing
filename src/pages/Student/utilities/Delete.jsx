import React from 'react';
import DraggableDialog from '../../../components/Modal';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';

const Delete = ({ 
    open, 
    isLoading, 
    processLabel,
    handleOpen, 
    handleClose, 
    handleAction, 
    deleteValues
}) => {
    return (
        <DraggableDialog
            open={open}
            maxWidth="sm"
            title="Delete Student Account"
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
                    <p><b style={{color: "red"}}>Warning</b>: Deleting a user will also <b style={{color: "red"}}>delete all associated data</b>!</p>
                    <p>Are you sure you want to delete this user: <b>{ deleteValues.row && deleteValues.row.email}</b> ?</p>
                </Box>
            </DialogContent>
        </DraggableDialog>
    );
}

export default Delete;
