import { createContext, useContext, useState } from 'react';
import { db } from '../firebase';
import { getDocs, addDoc, collection } from "firebase/firestore"

const SystemLogsContext = createContext();

export const SystemLogsContextProvider = ({ children }) => {
    // states
    const [systemLogs, setSystemLogs] = useState([]);
    // variables
    const systemLogsRef = collection(db, 'logs');
    /**
     * This function will query all system logs in the firestore
     * returns [array of system logs]
     */
    const getAllSystemLogs = async () => {
        try {
            let logs = [];
            const systemLogs = await getDocs(systemLogsRef);
            // get all necessary data from the queried data
            systemLogs.forEach((doc) => {
                logs.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            // set all data to states for general use
            setSystemLogs(logs);
            return logs;
        } catch (error) {
            setSystemLogs([]);
        }
    }
    /**
     * This function will create a new system log
     * @param {object} values
     * @returns boolean
     */
    const createSystemLogs = async (message, email, userType) => {
        try {
            const logId = await addDoc(systemLogsRef, {
                actions: message,
                email: email,
                userType: userType,
                timestamp: new Date().toISOString()
            });
            return { success: true, logId: logId.id };
        } catch (error) {
            return { success: false };
        }
    }
    
    return (
        <SystemLogsContext.Provider 
            value={{ 
                systemLogs, 
                getAllSystemLogs,
                createSystemLogs,
            }}
        >
            {children}
        </SystemLogsContext.Provider>
    );
};

export const SystemLogs = () => {
    return useContext(SystemLogsContext);
};