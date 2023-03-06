import React, { useState, useEffect, Fragment } from 'react';
import { useFormik } from 'formik';
// components
import Administrator from "./Administrator";
import Student from './Student';
import SnackbarComponent from '../../../components/Snackbar';
import { errorMessageEnhancer } from '../../../utilities/firebaseErrorTextEnhancer';
// context
import { UserAuth } from '../../../context/AuthContext';
import { UserProfile } from '../../../context/UsersProfileContext';
import { SystemLogs } from '../../../context/LogsContext';
// schema 
import { studentSchema, adminSchema } from "./schema";

const Index = ({ type }) => {
    // states
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [profile, setProfile] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        studentNumber: "",
        department: "",
        userType: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
     // snackbar state
    const [openSnackBar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [snackBarType, setSnackbarType] = useState('');
    // constants and formik initial values
    const {
        values, 
        errors,
        touched,
        handleBlur, 
        handleChange,
    } 
    = useFormik({
        enableReinitialize: true,
        initialValues: profile,
        validationSchema: type === "student" ? studentSchema : adminSchema,
    });
    // context
    const { getUserProfile, editFacultyAccount } = UserProfile();
    const { createSystemLogs } = SystemLogs();
    const { resetPassword, resetEmail } = UserAuth();
    // snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const _getUserProfile = async () => {
        try {
            const data = await getUserProfile(localStorage.getItem("uid"));
            setProfile(data[0]);
        } catch (error) {
            setProfile({});
        }
    }

    const handleAccountEdits = async () => {
        setIsLoading(true)
        try {
            const res = await editFacultyAccount({ id: profile.id, data: values })
            if(res.success) {
                setIsLoading(false);
                await createSystemLogs("Update profile information.", profile.email, profile.userType);
                setSnackbarType('success');
                setMessage('Profile info has been updated successfully')
                setOpenSnackbar(true);
            }
        } catch (error) {
            setIsLoading(false);
            setSnackbarType('error');
            setMessage('Unable to update prpfile info.')
            setOpenSnackbar(true);
        }
    }

    const handleAccountEditsLoginCreds = async () => {
        setIsLoading2(true)
        try {
            await resetEmail(values.email);
            const res = await editFacultyAccount({ id: profile.id, data: { email: values.email } })
            if(values.password !== "" && values.confirmPassword !== "") {
                await resetPassword(values.password)
            }
            if(res.success) {
                setIsLoading2(false);
                await createSystemLogs("Update login credentials.", profile.email, profile.userType);
                setSnackbarType('success');
                setMessage('Login credentials has been updated successfully')
                setOpenSnackbar(true);
            }
        } catch (error) {
            setIsLoading2(false);
            setSnackbarType('error');
            setMessage(`Unable to update login credentials: ${errorMessageEnhancer(error.message)}`)
            setOpenSnackbar(true);
        }
    }

    useEffect(() => {
        _getUserProfile();
    }, []);


    return (
        <Fragment>
            {
                (type === "super-admin" || type === "faculty") &&
                <Administrator
                    formValues={values}
                    errors={errors}
                    touched={touched}
                    isLoading={isLoading}
                    isLoading2={isLoading2}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    handleAction={() => { handleAccountEdits() }}
                    handleAccountEditsLoginCreds={() => { handleAccountEditsLoginCreds() }}
                />
            }
            {
                type === "student" && 
                <Student
                    formValues={values}
                    errors={errors}
                    touched={touched}
                    isLoading={isLoading}
                    isLoading2={isLoading2}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    handleAction={() => { handleAccountEdits() }}
                    handleAccountEditsLoginCreds={() => { handleAccountEditsLoginCreds() }}
                />
            }
            <SnackbarComponent
                open={openSnackBar}
                type={snackBarType}
                message={message}
                handleClose={handleCloseSnackbar}
            />
        </Fragment>
    );
}

export default Index;
