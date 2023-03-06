import { createContext, useContext, useState } from 'react';
import { db } from '../firebase';
import { getDocs, addDoc, deleteDoc, updateDoc, collection, query, where, doc } from "firebase/firestore"
import { useNavigate } from 'react-router-dom';

const UserProfileContext = createContext();

export const UserProfileContextProvider = ({ children }) => {
    // states
    const [usersProfile, setUsersProfile] = useState([]);
    // variables
    const navigate = useNavigate();
    const userProfileRef = collection(db, 'users');
    /**
     * This functions check the user type of the current logged in user
     * Can be used for redirection of paths to /home or /dashboard
     * @param {string} userId 
     * @returns usertype [student, faculty, super-admin]
     */
    const checkUserTypeAndRedirect = async (userId, currentUserType) => {
        try {
            let userType = null;
            const q = query(userProfileRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            if(querySnapshot.size > 0) {
                // query out the data collected
                querySnapshot.forEach((doc) => {
                    localStorage.setItem('userType', doc.data().userType);
                    // redirect pages based on user types
                    if(doc.data().userType === currentUserType) {
                        if (doc.data().userType === "student") {
                            navigate("/home")
                        } else {
                            window.location.href ="/dashboard"
                        }
                    } else if(doc.data().userType === "super-admin" && currentUserType !== "student") {
                        window.location.href ="/dashboard"
                    } 
                    else {
                        userType = doc.data().userType;
                    }
                });
                // set data to localstorage
                localStorage.setItem('uid', userId);
                return userType; 
            } 
            else {
                return "Deleted Account";
            }

        } catch (error) {
            setUserType(null);
        }
    }

    /**
     * This function will give the user profile of the current logged in user
     * includes email , firstName, lastName, uid, department etc...
     * @param {string} userId 
     * @returns user profile object || null
     */
    const getUserProfile = async (userId) => {
        try {
            let profile = [];
            const q = query(userProfileRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            // lopp through all the results
            querySnapshot.forEach((doc) => {
                profile.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            return profile;
        } catch (error) {
            return null
        }
    }

    /**
     * This function will query all users profiles in the firestore
     * returns [array of user profiles]
     */
    const getAllUserProfile = async () => {
        try {
            let profiles = [];
            const userProfiles = await getDocs(userProfileRef);
            // get all necessary data from the queried data
            userProfiles.forEach((doc) => {
                profiles.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            // set all data to states for general use
            setUsersProfile(profiles);
        } catch (error) {
            setUsersProfile([]);
        }
    }
    /**
     * This function gets all the facultys in the database
     * @returns array for faculty
     */
    const getAllFaculty = async () => {
        try {
            let facultyList = [];
            let newFacultyWithId = [];
            const q = query(userProfileRef, where("userType", "==", "faculty"));
            const querySnapshot = await getDocs(q);
            // lopp through all the results
            querySnapshot.forEach((doc) => {
                facultyList.push({ ...doc.data(), id: doc.id })
            })
            
            for(let i = 0; i < facultyList.length; i++) {
                newFacultyWithId.push({
                    index: i + 1,
                    ...facultyList[i]
                })
            }
            return newFacultyWithId;
        } catch (error) {
            return []
        }
    }
    /**
     * This function gets all the students in the database
     * @returns array for faculty
     */
    const getAllStudent = async () => {
        try {
            let facultyList = [];
            let newFacultyWithId = [];
            const q = query(userProfileRef, where("userType", "==", "student"));
            const querySnapshot = await getDocs(q);
            // lopp through all the results
            querySnapshot.forEach((doc) => {
                facultyList.push({ ...doc.data(), id: doc.id })
            })
            
            for(let i = 0; i < facultyList.length; i++) {
                newFacultyWithId.push({
                    index: i + 1,
                    ...facultyList[i]
                })
            }
            return newFacultyWithId;
        } catch (error) {
            return []
        }
    }
    /**
     * This function gets all the administrator in the database
     * @returns array for faculty
     */
    const getAllAdministrator = async () => {
        try {
            let adminList = [];
            let newAdminWithId = [];
            const q = query(userProfileRef, where("userType", "==", "super-admin"));
            const querySnapshot = await getDocs(q);
            // lopp through all the results
            querySnapshot.forEach((doc) => {
                adminList.push({ ...doc.data(), id: doc.id })
            })
            
            for(let i = 0; i < adminList.length; i++) {
                newAdminWithId.push({
                    index: i + 1,
                    ...adminList[i]
                })
            }
            return newAdminWithId;
        } catch (error) {
            return []
        }
    }
    /**
     * This function will create a new faculty account
     * @param {object} values
     * @returns boolean
     */
    const addNewFacultyAccount = async (values) => {
        try {
            const userId = await addDoc(userProfileRef, values);
            return { success: true, userId: userId.id };
        } catch (error) {
            return { success: false };
        }
    }
    /**
     * This function will edit the values on the data on the table
     * @param {*} values 
     * @returns 
     */
    const editFacultyAccount = async (values) => {
        try {
            const userRef = doc(db, "users", values.id);
            await updateDoc(userRef, values.data);
            return { success: true }
        } catch (error) {
            return { success: false, error}
        }
    }
    /**
     * This function will edit the values on the data on the table
     * @param {*} values 
     * @returns 
     */
    const updateLastLoginDate = async (userId) => {
        try {
            const profile = await getUserProfile(userId);
            const userRef = doc(db, "users", profile[0].id);
            await updateDoc(userRef, { lastLogin: new Date().toISOString()});
            return { success: true }
        } catch (error) {
            return { success: false, error}
        }
    }
    /**
     * This function will delete the document
     * @param {string} documentID document id
     * @returns { success: boolean, data }
     */
    const deleteUserProfile = async (documentID) => {
        try {
            const docRef = doc(db, 'users', documentID)
            const data = await deleteDoc(docRef);
            return { success: true, data }
        } catch (error) {
            return{ success: false}
        }
    }
    
    return (
        <UserProfileContext.Provider 
            value={{ 
                usersProfile, 
                getAllUserProfile,
                checkUserTypeAndRedirect,
                getUserProfile,
                getAllFaculty,
                getAllStudent,
                addNewFacultyAccount,
                deleteUserProfile,
                editFacultyAccount,
                getAllAdministrator,
                updateLastLoginDate
            }}
        >
            {children}
        </UserProfileContext.Provider>
    );
};

export const UserProfile = () => {
  return useContext(UserProfileContext);
};