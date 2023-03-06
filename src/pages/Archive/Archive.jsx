import React, {useEffect, useState, Fragment} from 'react';
// components
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
import { Documents } from '../../context/DocumentsContext';
import PageTitle from '../../components/PageTitle';
import DocumentsDataTable from './DocumentsDataTable';
import SnackbarComponent from '../../components/Snackbar';
import ReplayIcon from '@mui/icons-material/Replay';
import {Button, Box} from '@mui/material';
import CreateDocument from './CreateDocument';
import UpdateDocument from './UpdateDocument';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BinnedDataTable from './BinnedDataTable';

const Archive = () => {
    const { getAllDocuments } = Documents();
    const [isFetching, setIsFetching] = useState(true);
    const [openCreateDocument, setOpenCreateDocument] = useState(false);
    const [documents, setDocuments] = useState([]);
    // snackbar state
    const [openSnackBar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [snackBarType, setSnackbarType] = useState('');

    //update states
    const [openUpdateDocument, setOpenUpdateDocument] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    //tabs
    const [tab, setTab] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const selectDocument = (id) => {
        let obj = documents.find(a => a.id === id);
        setSelectedDocument(obj);
        setOpenUpdateDocument(true);
    }

    const createDocumentSuccess = () => {
        setDocuments([]);
        setIsFetching(true);
        setOpenCreateDocument(false)
        setOpenUpdateDocument(false)
    }

    const _getAllDocuments = async () => {
        try {
            const data = await getAllDocuments();
            setDocuments(data);
            setIsFetching(false);
        } catch (error) {
            setDocuments([]);
        }
    }
    
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }
    const handleOpen = () => {
        setOpenCreateDocument(true);
    }
    const handleClose = () => {
        setOpenCreateDocument(false);
    }

    const handleCloseUpdate = () => {
        setOpenUpdateDocument(false);
        setSelectedDocument(null);
    }

    useEffect(()=>{
        _getAllDocuments();
    },[])

    const refresh = () => {
        setIsFetching(true); 
        setDocuments([]);
        _getAllDocuments();
        setSnackbarType('success');
        setMessage('Refreshed succesfully')
        setOpenSnackbar(true);
    }

    const refreshNoSnack = () => {
        setIsFetching(true); 
        setDocuments([]);
        _getAllDocuments();
    }

    return (
        <ResponsiveDrawer>
            <Fragment>
                <PageTitle
                    title="Archive"
                    description="Manage documents with ease"
                />
                <Box  className='mb-3' sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                            <Tab label="Archive" value={0}/>
                            <Tab label="Bin" value={1}/>
                        </Tabs>
                    </Box>
                </Box>
                <div className='flex justify-end mb-3'>
                    <Button 
                        sx={{ marginRight: "10px" }} 
                        variant='outlined' 
                        onClick={() => refreshNoSnack()}
                    >
                        <ReplayIcon/>
                    </Button>
                    <Button variant='contained' onClick={() => handleOpen()}>
                        Create Document
                    </Button>
                </div>
                <Box sx={{ boxShadow: 2 }} >
                    {tab === 0? 
                        <DocumentsDataTable 
                            rows={documents} 
                            selectData={selectDocument} 
                            isFetching={isFetching}
                            setOpenSnackbar={setOpenSnackbar}
                            setMessage={setMessage}
                            setSnackbarType={setSnackbarType}
                            refresh={refreshNoSnack}
                        />
                    :
                        <BinnedDataTable 
                            rows={documents} 
                            isFetching={isFetching}
                            setOpenSnackbar={setOpenSnackbar}
                            setMessage={setMessage}
                            setSnackbarType={setSnackbarType}
                            refresh={refreshNoSnack}
                        />
                    }
                </Box>

                {/* Create Document Modal */}
                <CreateDocument 
                    open={openCreateDocument}
                    handleClose={handleClose}
                    isLoading={isFetching}
                    processLabel={"loading"}
                    actionSuccess={createDocumentSuccess}
                    setOpenSnackbar={setOpenSnackbar}
                    setMessage={setMessage}
                    setSnackbarType={setSnackbarType}
                    refresh={refreshNoSnack}
                />
                {/* Update Document Modal */}
                {selectedDocument !== null ?
                    <UpdateDocument 
                        open={openUpdateDocument}
                        handleClose={handleCloseUpdate}
                        isLoading={isFetching}
                        processLabel={"loading"}
                        actionSuccess={createDocumentSuccess}
                        setOpenSnackbar={setOpenSnackbar}
                        setMessage={setMessage}
                        setSnackbarType={setSnackbarType}
                        selectedDocument={selectedDocument}
                        refresh={refreshNoSnack}
                    />
                :null
                }
                {/* Snackbar notifications */}
                <SnackbarComponent
                    open={openSnackBar}
                    type={snackBarType}
                    message={message}
                    handleClose={handleCloseSnackbar}
                />
            </Fragment>
        </ResponsiveDrawer>
    );
}

export default Archive;
