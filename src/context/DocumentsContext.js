import { createContext, useContext, useState } from 'react';
import { db } from '../firebase';
import { getDocs, collection, query, where, addDoc, updateDoc, doc } from "firebase/firestore"
import { getStorage, ref as storageRef, uploadBytes, deleteObject, getDownloadURL, getBlob } from "firebase/storage";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DocumentContext = createContext();

export const DocumentContextProvider = ({ children }) => {
    // states
    const [documents, setDocuments] = useState([]);

    // variables
    const documentsRef = collection(db, 'documents');

    // create One document
    const createDocument  = async (values, file) => {
        try {
            // Create a root reference
            const storage = getStorage();
            
            // Create a reference to 'mountains.jpg'
            const fileRef = storageRef(storage, `documents/${values.department}/${values.fileName}`);

            await addDoc(documentsRef, values);
            await uploadBytes(fileRef, file).then((res) => {
                console.log('Uploaded a blob or file!');
            });
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }

    }

    // get All documents
    const getAllDocuments = async () => {
        try {
            let newDocuments = [];
            const docs = await getDocs(documentsRef);
            // get all necessary data from the queried data
            docs.forEach((doc) => {
                newDocuments.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            // set all data to states for general use
            setDocuments(newDocuments);
            return(newDocuments);
        } catch (error) {
            setDocuments([]);
        }
    }

    // get All documents
    const getAllDocumentsWithoutBinnedDocuments = async () => {
        try {
            let newDocuments = [];
            const d = query(documentsRef, where("binned", "==", false));
            const docs = await getDocs(d);
            // get all necessary data from the queried data
            docs.forEach((doc) => {
                newDocuments.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            // set all data to states for general use
            setDocuments(newDocuments);
            return(newDocuments);
        } catch (error) {
            setDocuments([]);
        }
    }

    // get all document per department
    const getAllDocumentPerDepartment = async (department) => {
        try {
            const allDocuments = [];
            const d = query(documentsRef, where("department", "==", department), where("binned", "==", false));
            const docs = await getDocs(d);
            // get all necessary data from the queried data
            docs.forEach((doc) => {
                allDocuments.push({
                    ...doc.data(),
                    id: doc.id
                })
            }) 
            return allDocuments;
        } catch (error) {
            return [];
        }
    }
    //get one
    const getDocument = async (docId) =>{
        try {
            const documents = [];
            const d = query(documentsRef, where("binned", "==", false));
            const docs = await getDocs(d);
            // you need to loop on all the result 
            // kindda weird but fuck the syntax
            docs.forEach((doc) => {
                documents.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            return documents.filter((doc) => doc.id === docId)[0]
        } catch (error) {
            console.log(error)
        }
    }

    const updateVisitationCount = async (docId) => {
        try {
            const documentRef = doc(db, "documents", docId);
            const docInQuestion = await getDocument(docId);
            await updateDoc(documentRef, { visitLogs: [...docInQuestion.visitLogs, new Date().toISOString()]});
        } catch(error) {
            return { success: false, error}
        }
    }
            
    const binDocument = async(values) => {
        try {
            const userRef = doc(db, "documents", values.id);
            await updateDoc(userRef, {...values, binned: true});
            return { success: true }
        } catch (error) {
            return { success: false, error}
        }
    }

    const unbinDocument = async(values) => {
        try {
            const userRef = doc(db, "documents", values.id);
            await updateDoc(userRef, {...values, binned: false});
            return { success: true }
        } catch (error) {
            return { success: false, error}
        }
    }

    //update one
    const updateDocument = async(prevValues, values, file) => {
        try {
            const userRef = doc(db, "documents", prevValues.id);

            if(file){
                const storage = getStorage();
                // Create a reference to the file to delete
                const prevFileRef = storageRef(storage, `documents/${prevValues.department}/${prevValues.fileName}`);
                await deleteObject(prevFileRef).then(() => {
                    console.log("file removed")
                }).catch((error) => {
                    console.log(error)
                });
    
                const newFileRef = storageRef(storage, `documents/${values.department}/${values.fileName}`);
                await uploadBytes(newFileRef, file).then((res) => {
                    console.log({message:'Uploaded a blob or file!',res});
                }).catch((error) => {
                    console.log(error)
                });
            }

            await updateDoc(userRef, values);
            return { success: true }
        } catch (error) {
            return { success: false, error}
        }
    }

    const getPaperOfTheDay = async () => {
        try {
            let views = [];
            const results = await getDocs(documentsRef);
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
            // get the top of the array
            const top1 = top5AllTimeViews.filter((item) => item.viewCount > 0).slice(0, 1)
            if(top1.length === 0) {
                return undefined
            }
            // filter the reference to get all data
            return views.filter((view) => view.documentName == top1[0].docName)
        } catch (error) {
            console.log(error)
            return []
        }
    }

    // download File
    const downloadFile = async (values) => {
        try {
            const storage = getStorage();
            const fileRef = storageRef(storage, `documents/${values.department}/${values.fileName}`);
            const url = await getDownloadURL(fileRef);
            return(url);
        } catch (error) {
            return(false)
        }
    };

    // download File
    const exportFiles = async (department) => {
        
        try {
            const docs = await getAllDocumentPerDepartment(department);
            const storage = getStorage();

            // zip
            const zip = JSZip();

            if(docs.length === 0){
                zip.generateAsync({type:"blob"})
                .then(function(content) {
                    saveAs(content, department+".zip");
                });
            }else{
                docs.forEach(async(doc, index)=>{
                    const fileRef = storageRef(storage, `documents/${doc.department}/${doc.fileName}`);
                    const blob = await getBlob(fileRef);
                    zip.file(doc.fileName + '.pdf', blob, { binary: true });
                    if(index === docs.length-1){
                        zip.generateAsync({type:"blob"})
                        .then(function(content) {
                            saveAs(content, department+".zip");
                        });
                        if(index === docs.length-1){
                            return(true);
                        }
                    }
                })
            }
        } catch (error) {
            console.log(error)
            return(false)
        }
    };
    
    return (
        <DocumentContext.Provider 
            value={{ 
                documents,
                setDocuments,
                createDocument,
                getAllDocuments,
                updateDocument,
                getDocument,
                getAllDocumentPerDepartment,
                getAllDocumentsWithoutBinnedDocuments,
                updateVisitationCount,
                binDocument,
                unbinDocument,
                downloadFile,
                getPaperOfTheDay,
                exportFiles
            }}
        >
            {children}
        </DocumentContext.Provider>
    );
};

export const Documents = () => {
    return useContext(DocumentContext);
};