import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Button, Divider } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from "../../components/LoadingButton"

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

const DraggableDialog = ({ 
    open, 
    handleClose, 
    children, 
    handleAction, 
    maxWidth, 
    title, 
    isLoading, 
    processLabel,
    label
}) => {
    return (
        <Dialog
            fullWidth={true}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle style={{ cursor: 'move', fontSize: "25px", fontWeight: "bold" }} id="draggable-dialog-title">
                {title}
            </DialogTitle>
            { children }
            <Divider/>
            <DialogActions style={{ padding: "20px" }}>
                <Button 
                    onClick={handleClose} 
                    color="error"
                >
                    Cancel
                </Button>
                {
                    !isLoading ?
                        <Button 
                            variant='contained' 
                            onClick={() => handleAction()}
                        >
                            {label ?? "Create"}
                        </Button>
                    :
                        <LoadingButton
                            label={processLabel}
                        />
                }
            </DialogActions>
        </Dialog>
    );
}

export default DraggableDialog;