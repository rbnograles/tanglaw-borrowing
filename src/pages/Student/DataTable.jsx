import React, { useState } from 'react';
import { DataGrid, GridToolbar  } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Moment from 'react-moment';
import LockIcon from '@mui/icons-material/Lock';

export default function FacultyDataTable(props) {

    const [pageSize, setPageSize] = useState(20)
    const { rows, isFetching, handleOpenDelete, handleOpenEdit, handleAccountEdits } = props;

    // for editing
    const handleCommit = (e) => {
        handleAccountEdits(e);
    }

    const capitalized = (word) => {
        const str = word;
        const str2 = str.charAt(0).toUpperCase() + str.slice(1);
        return str2;
    }

    const columns = [
        { 
            field: 'index', 
            headerName: 'No.', 
            width: 50,
        },
        { 
            field: 'firstName', 
            headerName: 'First name', 
            description: 'Double click to edit.',
            width: 200,
            editable: true
        },
        { 
            field: 'middleName', 
            headerName: 'Middle name', 
            description: 'Double click to edit.',
            width: 200,
            editable: true
        },
        { 
            field: 'lastName', 
            headerName: 'Last name', 
            description: 'Double click to edit.',
            width: 200, 
            editable: true 
        },
        { 
            field: 'suffix', 
            headerName: 'Suffix', 
            description: 'Double click to edit.',
            width: 100, 
            editable: true 
        },
        { 
            field: 'studentNumber', 
            headerName: 'Student Number', 
            description: 'Double click to edit.',
            width: 150, 
            editable: true 
        },
        {
            field: 'email',
            headerName: 'PUP Email Address',
            description: 'Double click to edit.',
            width: 350,
            editable: false,
            renderCell: (cellValue) => {
                return(
                    <div className='lock-component'>
                        <LockIcon
                            style={{ marginRight: "5px", fontSize: "17px", color: "#6b6b6b"}}
                        />
                        <p>{ cellValue.row.email }</p>
                    </div>
                )
            }
        },
        {
            field: 'department',
            headerName: 'Department',
            width: 385,
            renderCell: (cellValue) => {
                return(
                    <div onClick={() => { handleOpenEdit(cellValue.row)}}>
                        <p style={{ marginLeft: "5px"}}>{ cellValue.row.department }</p>
                    </div>
                )
            }
        },
        {
            field: 'userType',
            headerName: 'User Type',
            width: 110,
            renderCell: (cellValue) => {
                return(
                    <div className='lock-component'>
                        <LockIcon
                            style={{ marginRight: "5px", fontSize: "17px", color: "#6b6b6b"}}
                        />
                        <p>{ capitalized(cellValue.row.userType) }</p>
                    </div>
                )
            }
        },
        {
            field: 'createdAt',
            headerName: 'Create At',
            width: 205,
            renderCell: (cellValue) => {
                return (
                    <div className='lock-component'>
                        <LockIcon
                            style={{ marginRight: "5px", fontSize: "17px", color: "#6b6b6b"}}
                        />
                        <Moment format="MMMM DD, YYYY hh:mm A">
                            {cellValue.row.createdAt}
                        </Moment>
                    </div>
                )
            }
        },
        {
            field: 'lastLogin',
            headerName: 'Last Login',
            width: 205,
            renderCell: (cellValue) => {
                return (
                    <div className='lock-component'>
                        <LockIcon
                            style={{ marginRight: "5px", fontSize: "17px", color: "#6b6b6b"}}
                        />
                        {
                            cellValue.row.lastLogin !== "" ?
                            <Moment format="MMMM DD, YYYY hh:mm A">
                                {cellValue.row.lastLogin}
                            </Moment>
                            : "No login record"
                        }
                    </div>
                )
            }
        },
        {
            field: "id",
            headerName: "Actions",
            type: 'number',
            width: 100,
            renderCell: (cellValue) => {
                return (
                    <div>
                        <Button onClick={() => { handleOpenDelete(cellValue)}}>
                            <DeleteIcon
                                color='error'
                            />
                        </Button>
                    </div>
                )
            }
        }
    ];

    return (
        <div style={{ height: "65vh", width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                density="comfortable"
                onPageSizeChange={(newPageSize) => { setPageSize(newPageSize)}}
                loading={!rows.length && isFetching}
                onCellEditCommit={handleCommit}
                rowsPerPageOptions={[0, 5, 10, 20, 30, 40, 50]}
                checkboxSelection={false}
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </div>
    );
}
