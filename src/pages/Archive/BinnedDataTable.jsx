import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar  } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import EditIcon from '@mui/icons-material/Edit';
import { Documents } from '../../context/DocumentsContext';
import { UserProfile } from '../../context/UsersProfileContext';
import { SystemLogs } from '../../context/LogsContext';
import Tooltip from '@mui/material/Tooltip';

export default function BinnedDataTable(props) {
    const { createSystemLogs } = SystemLogs();
    const { getUserProfile  } = UserProfile();
    const { unbinDocument } = Documents();
    const [pageSize, setPageSize] = useState(20);
    const [loggedInProfile, setLoggedInProfile] = useState({ userType: ""});
    const {
        rows,
        isFetching, 
        refresh,
        //snack
        setOpenSnackbar,
        setMessage,
        setSnackbarType,
    } = props;

    const _unbinDocument = async(values) =>{
        try {
            const data = await unbinDocument(values);
            const logs = await createSystemLogs("Unbinned a document.", loggedInProfile.email, loggedInProfile.userType);
            setOpenSnackbar(true);
            setMessage(`Document restored from bin`);
            setSnackbarType('success');
            refresh();
        } catch (error) {
            setOpenSnackbar(true);
            setMessage(`Document not restored`);
            setSnackbarType('error');
        }
    }

    const _getUserProfile = async () => {
        try {
            const data = await getUserProfile(localStorage.getItem("uid"));
            setLoggedInProfile(data[0]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        _getUserProfile();
    },[])

    const columns = [
        { 
            field: 'documentName', 
            headerName: 'Document Name',
            description: 'Double click to edit.',
            width: 300,
            editable: false
        },
        { 
            field: 'department', 
            headerName: 'Department', 
            description: 'Double click to edit.',
            width: 500,
            editable: false
        },
        { 
            field: 'schoolYear', 
            headerName: 'School Year', 
            description: 'Double click to edit.',
            width: 150, 
            editable: false 
        },
        {
            field: 'publicationDate',
            headerName: 'Date Uploaded',
            width: 200,
            editable: false
        },
        {
            field: "id",
            headerName: "Actions",
            type: 'number',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <div>
                        <Tooltip title="Restore Document">
                            <Button onClick={()=>_unbinDocument(cellValue.row)}>
                                <RestoreFromTrashIcon
                                    color='primary'
                                />
                            </Button>
                        </Tooltip>
                    </div>
                )
            }
        }
    ];

    return (
        <div style={{ height: '65vh', width: '100%' }}>
            <DataGrid
                rows={rows.filter((data) => data.binned === true)}
                columns={columns}
                pageSize={pageSize}
                density="comfortable"
                pagination
                onPageSizeChange={(newPageSize) => { setPageSize(newPageSize)}}
                loading={!rows.length && isFetching}
                // onCellEditCommit={handleCommit}
                rowsPerPageOptions={[0, 5, 10, 20, 30, 40, 50]}
                checkboxSelection={false}
                components={{
                    Toolbar: GridToolbar,
                }}
                componentsProps={{
                    columnMenu: { background: 'red', counter: rows.length },
                }}
            />
        </div>
    );
}
