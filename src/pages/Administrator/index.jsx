import React, { Fragment, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ReplayIcon from '@mui/icons-material/Replay';
import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import { profileSchema } from './schema/schema';
import { errorMessageEnhancer } from '../../utilities/firebaseErrorTextEnhancer';
// custom components
import FacultyDataTable from './DataTable';
import CreateAdmin from './utilities/Create';
import EditDepartment from "./utilities/EditDepartment";
import DeleteAdminAccount from './utilities/Delete';
import SnackbarComponent from '../../components/Snackbar';
// context
import { UserProfile } from '../../context/UsersProfileContext';
import { UserAuth } from '../../context/AuthContext';
import { SystemLogs } from "../../context/LogsContext";

const Administrator = () => {
    // constantas and formik initial values
    const {
        values, 
        errors,
        touched,
        handleBlur, 
        handleChange,
        handleSubmit
    } 
    = useFormik({
        initialValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
            department: "",
            userType: "super-admin",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: profileSchema,
        onSubmit: values => {
            handleCreateAccount(values);
        }
    });
    // states
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [editDepartment, setEditDepartment] = useState("");
    const [editDepartmentId, setEditDepartmentId] = useState("");
    const [rows, setRows] = useState([]);
    const [deleteValues, setDeleteValues] = useState({});
    const [isFetching, setIsFetching] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loggedInProfile, setLoggedInProfile] = useState({ userType: ""});
    // snackbar state
    const [openSnackBar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [snackBarType, setSnackbarType] = useState('');
    // context
    const { createUser } = UserAuth();
    const { addNewFacultyAccount, getAllAdministrator, deleteUserProfile, editFacultyAccount, getUserProfile  } = UserProfile();
    const { createSystemLogs } = SystemLogs();
    // get all faculty and set to state
    const _getAllAdministrator = async () => {
        try {
            const data = await getAllAdministrator();
            setRows(data);
            setIsFetching(false);
        } catch (error) {
            setRows([]);
        }
    }
    // get userProfile
    const _getUserProfile = async () => {
        try {
            const data = await getUserProfile(localStorage.getItem("uid"));
            setLoggedInProfile(data[0]);
            setIsFetching(false);
        } catch (error) {
            setRows([]);
        }
    }
    // refresh
    const refresh = () => {
        setIsFetching(true); 
        setRows([]);
        _getAllAdministrator();
        setSnackbarType('success');
        setMessage('Refreshed succesfully')
        setOpenSnackbar(true);
    }
    // =========== snack bar and modal controls
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleOpenEdit = (value) => {
        setOpenEdit(true);
        setEditDepartment(value.department);
        setEditDepartmentId(value.id);
    }
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setEditDepartment("");
        setEditDepartmentId("");
    }
    const handleOpenDelete = (values) => {
        setOpenDelete(true);
        setDeleteValues(values);
    }
    const handleCloseDelete = () => {
        setOpenDelete(false);
    }
    // ========== end of snack bar and modal controls
    
    /**
     * This function handles the creation of login user account and Profile
     * This function will first create the user account for logging in
     * using the createUser(email, password) function
     * then creting the profile using the addNewFacultyAccount(value)
     * returns a success snackbar
     */
    const handleCreateAccount = async (formValues) => {
        try {
            setIsLoading(true)
            // create login account 
            const userAccount = await createUser(formValues.email, formValues.password);
            // prepare data object for creating the faculty account
            const value = {
                firstName: formValues.firstName,
                middleName: formValues.middleName,
                lastName: formValues.lastName,
                suffix: formValues.suffix,
                department: formValues.department,
                userType: formValues.userType,
                email: formValues.email,
                createdAt: new Date().toISOString(),
                lastLogin: "",
                userId: userAccount.user.uid
            }
            // execute the function
            const data = await addNewFacultyAccount(value);
            // if the process succeeds
            if(data.success) {
                setSnackbarType('success');
                setMessage('Account created succesfully')
                setOpenSnackbar(true);
                setIsLoading(false)
                handleClose();
                await createSystemLogs("Created an administrator account.", loggedInProfile.email, loggedInProfile.userType);
                _getAllAdministrator();
            }
        } catch(error) {
            setIsLoading(false);
            setSnackbarType('error');
            setMessage(`Failed to create account: ${errorMessageEnhancer(error.message)}`);
            setOpenSnackbar(true);
            handleClose();
        }
    }

    const handleAccountEdits = async (e) => {
        const array = rows.map(r => {
            if(r.id === e.id) {
                return {...r, [e.field]: e.value }
            } else {
                return {...r}
            }
        })
        setRows(array);
        const data = array.filter((data) => data.id === e.id);
        try {
            const res = await editFacultyAccount({ id: data[0].id, data: data[0] })
            if(res.success) {
                await createSystemLogs("Edited an administrator account.", loggedInProfile.email, loggedInProfile.userType);
                setSnackbarType('success');
                setMessage('Cell data has been updated succesfully')
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarType('success');
            setMessage('Unable to update cell data.')
            setOpenSnackbar(true);
        }
    }
    // edit the department section only
    const handleAccountDepartmentEdit = async () => {
        setIsLoading(true);
        const array = rows.map(r => {
            if(r.id === editDepartmentId) {
                return {...r, "department": editDepartment }
            } else {
                return {...r}
            }
        })
        setRows(array);
        const data = array.filter((data) => data.id === editDepartmentId);
        try {
            const res = await editFacultyAccount({ id: data[0].id, data: { department: editDepartment } });
            if(res.success) {
                setIsLoading(false)
                await createSystemLogs("Edited an administrator department.", loggedInProfile.email, loggedInProfile.userType);
                setSnackbarType('success');
                setMessage('Cell data has been updated succesfully')
                setOpenSnackbar(true);
                handleCloseEdit();
            }
        } catch (error) {
            setIsLoading(false)
            setSnackbarType('success');
            setMessage('Unable to update cell data.')
            setOpenSnackbar(true);
            handleCloseEdit();
        }
    }
    /**
     * This function handles the deletion of user profile
     */
    const deleteRowItem = async () => {
        setIsLoading(true);
        try {
            const res2 = await deleteUserProfile(deleteValues.id);
            if(res2.success) {
                await createSystemLogs("Deleted an administrator account.", loggedInProfile.email, loggedInProfile.userType);
                _getAllAdministrator();
                setSnackbarType('success');
                setMessage('Account deleted succesfully')
                setOpenSnackbar(true);
            }
            handleCloseDelete(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setSnackbarType('error');
            setMessage('Failed to delete account');
            handleCloseDelete(false);
            setOpenSnackbar(true);
        }
    }

    useEffect(() => {
        _getAllAdministrator();
        _getUserProfile();
    }, []);

    return (
        <Fragment>
            <div className='flex justify-between mb-2 mt-3'>
                <p className='tableWarnings'>
                    <b>Notice:</b> Double click a cell in order to edit. Cells with <LockIcon style={{ fontSize: "17px"}}/> is <b>not editable.</b>
                </p>
                <div className='flex'>
                    <Button 
                        sx={{ marginRight: "10px" }} 
                        variant='outlined' 
                        onClick={() => refresh()}
                    >
                        <ReplayIcon/>
                    </Button>
                    <Button variant='contained' onClick={() => handleOpen()}>
                        Create Account
                </Button>
                </div>
            </div>
            <Box sx={{ boxShadow: 2, borderRadius: "5px"  }} >
                <FacultyDataTable
                    rows={rows}
                    isFetching={isFetching} // this is for loading the table
                    handleAccountEdits={handleAccountEdits}
                    handleOpenEdit={handleOpenEdit}
                    handleOpenDelete={handleOpenDelete}
                />
            </Box>
             {/* modals */}
            <CreateAdmin
                open={open}
                errors={errors}
                touched={touched}
                formValues={values}
                isLoading={isLoading} // this is for button click and form submission
                processLabel="Creating" 
                handleOpen={handleOpen}
                handleClose={handleClose}
                handleAction={() => { handleSubmit()}}
                handleBlur={handleBlur}
                handleChange={handleChange}
            />
            <EditDepartment
                open={openEdit}
                isLoading={isLoading} // this is for button click and form submission
                editValues={editDepartment}
                processLabel="Editing" 
                handleChange={setEditDepartment}
                handleOpen={handleOpenEdit}
                handleClose={handleCloseEdit}
                handleAction={() => { handleAccountDepartmentEdit()}}
            />
            <DeleteAdminAccount
                open={openDelete}
                isLoading={isLoading} // this is for button click and form submission
                deleteValues={deleteValues}
                processLabel="Deleting" 
                handleOpen={handleOpenDelete}
                handleClose={handleCloseDelete}
                handleAction={() => { deleteRowItem()}}
            />
            {/* Snackbar notifications */}
            <SnackbarComponent
                open={openSnackBar}
                type={snackBarType}
                message={message}
                handleClose={handleCloseSnackbar}
            />
        </Fragment>
    );
}

export default Administrator;
