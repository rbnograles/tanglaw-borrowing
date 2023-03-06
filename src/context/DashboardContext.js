import { createContext, useContext } from 'react';
import { db } from '../firebase';
import { getDocs, collection, query, where, addDoc } from "firebase/firestore"
import { departments } from "../utilities/departments";
import moment from 'moment';

const DashboardContext = createContext();

export const DashboardContextProvider = ({ children }) => {
    // variables
    const usersRef = collection(db, 'users');
    const docsRef = collection(db, 'documents');
    const searchesRef = collection(db, 'searches');
    const logsRef = collection(db, 'logs');
    /**
     * This function will query all comments in the firestore
     * returns [array of comments]
     */
    const getAllUserCount = async (type) => {
        try {
            let users = [];
            const q = query(usersRef, where("userType", "==", type));
            const results = await getDocs(q);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                users.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            return users.length;
        } catch (error) {
            return 0;
        }
    }

    const getAllDocumentCount = async (type) => {
        try {
            let docs = [];
            const results = await getDocs(docsRef);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                docs.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            return docs.length;
        } catch (error) {
            return 0;
        }
    }

    const addNewSearches = async (keyword) => {
        try {
            await addDoc(searchesRef, { keyword: keyword, date: new Date().toISOString()});
        } catch (error) {
            return { success: false };
        }
    }
    
    const getAllSearchCount = async () => {
        try {
            let searches = [];
            const results = await getDocs(searchesRef);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                searches.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            return searches.length;
        } catch (error) {
            return 0;
        }
    }

    const getAllPublications = async (department) => {
        try {
            let users = [];
            const q = query(docsRef, where("department", "==", department));
            const results = await getDocs(q);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                users.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            return users;
        } catch (error) {
            return 0;
        }
    }

    const getAllUserTraffic = async (userType) => {
        try {
            let users = [];
            const q = query(logsRef, where("userType", "==", userType));
            const results = await getDocs(q);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                users.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            return users;
        } catch (error) {
            return 0;
        }
    }

    const dates = (current) => {
        var week= new Array(); 
        // Starting Monday not Sunday
        current.setDate((current.getDate() - current.getDay() + 1));
        for (var i = 0; i < 7; i++) {
            week.push(
                new Date(current).toISOString().split('T')[0]
            ); 
            current.setDate(current.getDate() + 1);
        }
        return week; 
    }

    const calculateBarChartData = async (selectedDate) => {
        const collectiveWeeklyReport = [];
        const finalReport = [];
        // prepare current week dates
        const daysOfWeek = dates(new Date(selectedDate));
        // start for filtering
        for(let day = 0; day < daysOfWeek.length; day++) {
            let temp = []
            for(let x = 0; x < departments.length; x++) {
                let count = 0;
                const uploads = await getAllPublications(departments[x]);
                // check all data
                for(let i = 0; i < uploads.length; i++) {
                    if(JSON.stringify(uploads[i].publicationDate.split('T')[0]).includes(daysOfWeek[day])) {
                        count += 1;
                    }
                }
                temp.push({
                    date: moment(daysOfWeek[day]).format("MMM DD"),
                    [departments[x]]: count
                })
            }
            collectiveWeeklyReport.push(temp)
        }

        for(let i = 0; i < collectiveWeeklyReport.length; i++) {
            finalReport.push(collectiveWeeklyReport[i].reduce(
                function(result, current) {
                    return Object.assign(result, current);
                }, {})
            ) 
        }
        return { 
            success: true,
            collectiveWeeklyReport: finalReport
        }
    }

    const calculateUserTrafficData = async (selectedDate) => {
        const collectiveWeeklyReport = [];
        const finalReport = [];
        const userTypes = ["super-admin", "student", "faculty"]
        // prepare current week dates
        const daysOfWeek = dates(new Date(selectedDate));
        // start for filtering
        for(let day = 0; day < daysOfWeek.length; day++) {
            let temp = []
            for(let x = 0; x < userTypes.length; x++) {
                let count = 0;
                const uploads = await getAllUserTraffic(userTypes[x]);
                // check all data
                for(let i = 0; i < uploads.length; i++) {
                    if(JSON.stringify(uploads[i].timestamp.split('T')[0]).includes(daysOfWeek[day])) {
                        count += 1;
                    }
                }
                temp.push({
                    date: moment(daysOfWeek[day]).format("MMM DD"),
                    [userTypes[x]]: count
                })
            }
            collectiveWeeklyReport.push(temp)
        }

        for(let i = 0; i < collectiveWeeklyReport.length; i++) {
            finalReport.push(collectiveWeeklyReport[i].reduce(
                function(result, current) {
                    return Object.assign(result, current);
                }, {})
            ) 
        }
        return { 
            success: true,
            collectiveWeeklyReport: finalReport
        }
    }

    const calculateAllTimeSearched = async () => {
        try {
            let searches = [];
            const results = await getDocs(searchesRef);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                searches.push({
                    ...doc.data(),
                    id: doc.id
                })
            })

            let topSearches = {};

            searches.forEach((x) => { 
                topSearches[x.keyword] = (topSearches[x.keyword] || 0)+1; 
            });

            let sortable = [];
            for (let search in topSearches) {
                sortable.push([search, topSearches[search]]);
            }

            sortable.sort((a, b) => {
                return b[1] - a[1];
            })

            const top5AllTimeSearch = []

            for(let i = 0; i < sortable.length; i ++) {
                top5AllTimeSearch.push({
                    keyword: sortable[i][0],
                    numberOfSearch: sortable[i][1]
                })
            }

            if(top5AllTimeSearch.length === 0) {
                return []
            }

            return top5AllTimeSearch.slice(0, 5);
        } catch (error) {
            return []
        }
    }
    

    const calculateDailySearched = async () => {
        try {
            let searches = [];
            const results = await getDocs(searchesRef);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                searches.push({
                    ...doc.data(),
                    id: doc.id
                })
            })

            let topSearches = {};
            // get all searches for the current date
            const filteredSearches = searches.filter((search) => search.date.split('T')[0] === new Date().toISOString().split("T")[0])

            filteredSearches.forEach((x) => { 
                topSearches[x.keyword] = (topSearches[x.keyword] || 0)+1; 
            });

            let sortable = [];
            for (let search in topSearches) {
                sortable.push([search, topSearches[search]]);
            }

            sortable.sort((a, b) => {
                return b[1] - a[1];
            })

            const top5DailySearch = []

            for(let i = 0; i < sortable.length; i ++) {
                top5DailySearch.push({
                    keyword: sortable[i][0],
                    numberOfSearch: sortable[i][1]
                })
            }

            if(top5DailySearch.length === 0) {
                return []
            }

            return top5DailySearch.slice(0, 5);
        } catch (error) {
            return []
        }
    }

    const calculateAllTimeViewed = async () => {
        try {
            let views = [];
            const results = await getDocs(docsRef);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                views.push({
                    ...doc.data(),
                    id: doc.id
                })
            })

            let topViews = {};

            views.forEach((x) => { 
                topViews[x.documentName] = x.visitLogs.length; 
            });

            let sortable = [];
            for (let view in topViews) {
                sortable.push([view, topViews[view]]);
            }
            
            sortable.sort((a, b) => {
                return b[1] - a[1];
            })
            
            const top5AllTimeViews = []

            for(let i = 0; i < sortable.length; i ++) {
                top5AllTimeViews.push({
                    docName: sortable[i][0],
                    viewCount: sortable[i][1]
                })
            }
            
            if(top5AllTimeViews.length === 0) {
                return []
            }

            return top5AllTimeViews.filter((item) => item.viewCount > 0).slice(0, 5);
        } catch (error) {
            return []
        }
    }

    const calculateDailyViewed = async () => {
        try {
            let views = [];
            const results = await getDocs(docsRef);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                views.push({
                    ...doc.data(),
                    id: doc.id
                })
            })

            let topViews = {};

            views.forEach((x) => { 
                topViews[x.documentName] = x.visitLogs.filter((date) => date.split('T')[0] === new Date().toISOString().split('T')[0]).length;
            });

            let sortable = [];

            for (let view in topViews) {
                sortable.push([view, topViews[view]]);
            }
            
            sortable.sort((a, b) => {
                return b[1] - a[1];
            })
            
            const top5AllTimeViews = []

            for(let i = 0; i < sortable.length; i ++) {
                top5AllTimeViews.push({
                    docName: sortable[i][0],
                    viewCount: sortable[i][1]
                })
            }
            
            if(top5AllTimeViews.length === 0) {
                return []
            }

            return top5AllTimeViews.filter((item) => item.viewCount > 0).slice(0, 5);
        } catch (error) {
            console.log(error)
            return []
        }
    }

    return (
        <DashboardContext.Provider 
            value={{ 
                getAllUserCount,
                getAllDocumentCount,
                getAllSearchCount,
                addNewSearches,
                calculateBarChartData,
                calculateUserTrafficData,
                calculateAllTimeSearched,
                calculateDailySearched,
                calculateAllTimeViewed,
                calculateDailyViewed
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const DashboardStats = () => {
    return useContext(DashboardContext);
};