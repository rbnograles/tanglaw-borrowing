import { createContext, useContext, useState } from 'react';
import { db } from '../firebase';
import { getDocs, addDoc, collection, query, where, deleteDoc, doc } from "firebase/firestore"

const CommentContext = createContext();

export const CommentContextProvider = ({ children }) => {
    // states
    const [comments, setComments] = useState([]);
    // variables
    const commentsRef = collection(db, 'comments');
    /**
     * This function will query all comments in the firestore
     * returns [array of comments]
     */
    const getAllCommentsPerArticle = async (docId) => {
        try {
            let comments = [];
            const q = query(commentsRef, where("docId", "==", docId));
            const results = await getDocs(q);
            // get all necessary data from the queried data
            results.forEach((doc) => {
                comments.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            // set all data to states for general use
            setComments(comments);
            return comments;
        } catch (error) {
            setComments([]);
        }
    }
    /**
     * This function will create a new system log
     * @param {object} values
     * @returns boolean
     */
    const createCommentOnArticle = async (comment, name, docId) => {
        try {
            const commentId = await addDoc(commentsRef, {
                docId: docId,
                comment: comment,
                name: name,
                date: new Date().toISOString()
            });
            return { success: true, commentId: commentId.id };
        } catch (error) {
            return { success: false };
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const docRef = doc(db, 'comments', commentId)
            const data = await deleteDoc(docRef);
            return { success: true, data }
        } catch (error) {
            console.log(error)
            return{ success: false}
        }
    }
    
    return (
        <CommentContext.Provider 
            value={{ 
                comments, 
                getAllCommentsPerArticle,
                createCommentOnArticle,
                deleteComment
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};

export const Comments = () => {
    return useContext(CommentContext);
};