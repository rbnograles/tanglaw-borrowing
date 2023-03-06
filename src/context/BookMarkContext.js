import { createContext, useContext } from 'react';
import { db } from '../firebase';
import { getDocs, addDoc, updateDoc, collection, query, where, doc } from "firebase/firestore"

const BookMarkContext = createContext();

export const BookMarkContextProvider = ({ children }) => {
    // variables
    const bookMarkRef = collection(db, 'bookmarks');
    /**
     * This function will query all comments in the firestore
     * returns [array of comments]
     */
    const getAllUserBookMark = async () => {
        try {
            let bookMarks = [];
            const q = query(bookMarkRef, where("userId", "==", localStorage.getItem("uid")));
            const results = await getDocs(q);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                bookMarks.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            return bookMarks;
        } catch (error) {
            return null
        }
    }
    /**
     * This function will create a new system log
     * @param {object} values
     * @returns boolean
     */
    const addUserBookMark = async (userId, bookmark) => {
        try {
            const checkIfThereIsCurrentUser = await getAllUserBookMark();
            // check if the action is create or update
            if(checkIfThereIsCurrentUser.length === 0) {
                await addDoc(bookMarkRef, { userId: userId, bookMarks: [bookmark] });
            } else {
                await updateBookMarkList(checkIfThereIsCurrentUser[0].id, bookmark);
            }

        } catch (error) {
            return { success: false };
        }
    }

    const updateBookMarkList = async (id, bookmark) => {
        try {
            const bookMarkRef = doc(db, "bookmarks", id);
            const docInQuestion = await getAllUserBookMark();
            await updateDoc(bookMarkRef, { bookMarks: [...docInQuestion[0].bookMarks, bookmark]});
            return { success: true }
        } catch (error) {
            return { success: false, error}
        }
    }

    const removeABookMark = async (bookmark) => {
        try {
            const docInQuestion = await getAllUserBookMark();
            const bookMarkRef = doc(db, "bookmarks", docInQuestion[0].id);
            const newBookmarks = docInQuestion[0].bookMarks.filter((doc) => doc !== bookmark);
            await updateDoc(bookMarkRef, { bookMarks: newBookmarks});
            return { success: true }
        } catch (error) {
            console.log(error)
            return { success: false, error}
        }
    }
    
    return (
        <BookMarkContext.Provider 
            value={{ 
                getAllUserBookMark,
                addUserBookMark,
                updateBookMarkList,
                removeABookMark
            }}
        >
            {children}
        </BookMarkContext.Provider>
    );
};

export const BookMark = () => {
    return useContext(BookMarkContext);
};