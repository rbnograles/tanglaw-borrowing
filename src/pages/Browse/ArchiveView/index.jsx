import React, { useEffect, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Moment from 'react-moment';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
// custom component
import ResponsiveDrawer from '../../../components/ResponsiveDrawer';
import PageTitle from '../../../components/PageTitle';
// context
import { UserProfile } from '../../../context/UsersProfileContext';
import { Documents } from '../../../context/DocumentsContext';
import { Comments } from '../../../context/CommentContext';

function stringToColor(string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
}

function stringAvatar(name) {
    return {
        sx: {
        bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const ArchiveView = () => {
    // state
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('student');
    const [userComment, setUserComment] = useState('');
    const [newComment , setNewComment] = useState([]);
    const [err, setErr] = useState('');
    const [document , setDocument] = useState({ 
        authors: [],
        advisers: [],
        citations: [],
        keywords: [],
        formats: [],
        languages: [],
        physicalDescription: []
    });
    // context
    const { getDocument, downloadFile } = Documents();
    const { getAllCommentsPerArticle, createCommentOnArticle, deleteComment } = Comments();
    const { getUserProfile } = UserProfile();

    /**
     * Function for getting the current logged in users profile
     * Contains an object with users information
     */
    const _getUserProfile = async () => {
        const uid = localStorage.getItem('uid');
        const data = await getUserProfile(uid);
        const profile = data[0];
        setUserType(profile.userType)
        setName(`${profile.firstName} ${profile.lastName}`);
    }

    const _getOneDocument = async (documentId) => {
        try {
            const doc = await getDocument(documentId);
            console.log(doc);
            setDocument(doc);
        } catch (error) {
            setDocument({})
        }
    }
    
    const _downloadFile = async(doc) => {
        try {
            const url = await downloadFile(doc);
            if(url !== false){
                window.open(url);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteUserComment = async (commentId) => {
        _getAllCommentPerArticle(window.location.search.split('?')[1]);
        try {
            await deleteComment(commentId)
        } catch (error) {
            console.log(error)
        }
    }
    
    const _getAllCommentPerArticle = async (documentId) => {
        try {
            const comments = await getAllCommentsPerArticle(documentId);
            setNewComment(comments.reverse());
        } catch (error) {
            setDocument([])
        }
    }

    const createComment = async () => {
        if(userComment.length === 0) {
            setErr("Please write a comment");
            return;
        }
        // proceed if there are comments
        try {
            const docId = window.location.search.split('?')[1];
            await createCommentOnArticle(userComment, name, docId);
            setUserComment('');
            _getAllCommentPerArticle(docId);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        _getUserProfile();
        _getOneDocument(window.location.search.split('?')[1]);
        _getAllCommentPerArticle(window.location.search.split('?')[1]);
    }, []);

    return (
        <ResponsiveDrawer>
            <PageTitle
                title={`Article from the Course of ${document.department}`}
            />
            <div className='flex mt-2'>
                <Box style={{ width: "60%", marginRight: "30px"}}>
                    <p>Review Article | Free Access</p>
                    <p className='articleName'>{document.documentName}</p>
                    <p className='small-label'>Authors:</p>
                    <Stack direction="row" spacing={1} className="mr-2 mb-3">
                        {
                            document.authors.map((author, i) => {
                                return(    
                                    <Chip icon={<FaceIcon />}  key={i} label={author} />
                                )
                            })
                        }
                    </Stack>
                    <p className='small-label'>Advisers:</p>
                    <Stack direction="row" spacing={1} className="mr-2 mb-3">
                        {
                            document.advisers.map((author, i) => {
                                return(    
                                    <Chip icon={<FaceIcon />} key={i} label={author} />
                                )
                            })
                        }
                    </Stack>
                    <p><span className='inline-text-decor'>Date Uploaded</span>: <Moment format="DD MMMM YYYY">{document.publicationDate}</Moment> | <span className='inline-text-decor'>Production Year:</span> {document.schoolYear} | <span className='inline-text-decor'>Citations:</span> {document.citations.length}</p>
                    <p className='small-label'>Keywords:</p>
                    <Stack direction="row" spacing={1} className="mr-2">
                        {
                            document.keywords.map((keyword, i) => {
                                return(    
                                    <Chip key={i} label={keyword}/>
                                )
                            })
                        }
                    </Stack>
                    <div className='flex justify-end mb-2'>
                        {
                            (userType !== "student") && 
                            <Button size='small' variant='contained' onClick={() => {_downloadFile(document)}}>
                                <PictureAsPdfIcon className='mr-2' style={{ fontSize: "20px" }} /> Download
                            </Button>
                        }
                    </div>
                    <Divider/>
                    <div className='mt-2 mb-5'>
                        <p className='article-sub-header'>Abstract</p>
                        <p className='text-content'>{document.abstract}</p>
                    </div>
                    <Divider/>
                    <div className='mt-2 mb-5'>
                        <p className='article-sub-header'>Other Document Information</p>
                        <p className='small-label'>Formats:</p>
                        <Stack direction="row" spacing={1} className="mr-2">
                            {
                                document.formats.map((format, i) => {
                                    return(   
                                        <Chip key={i} label={format} /> 
                                    )
                                })
                            }
                        </Stack>
                        <br/>
                        <p className='small-label'>Languages:</p>
                        <Stack direction="row" spacing={1} className="mr-2">
                            {
                                document.languages.map((language, i) => {
                                    return(    
                                        <Chip key={i} label={language} />
                                    )
                                })
                            }
                        </Stack>
                        <br/>
                        <p className='small-label'>Physical Descriptions:</p>
                        {
                            document.physicalDescription.map((description, i) => {
                                return(    
                                    <p className='small-content' key={i}>{i + 1}. {description}</p>
                                )
                            })
                        }
                        <br/>
                        <p className='small-label'>Shelf Location:</p>
                        <p className='small-content'>{document.shelfLocation}</p>
                    </div>
                    <Divider/>
                    <div className='mt-3'>
                        <p className='article-sub-header'>Citing Literature</p>
                        {
                            document.citations.map((cite, i) => {
                                return(    
                                    <p className='mb-2' key={i}>{cite}</p>
                                )
                            })
                        }
                    </div>
                </Box>
                <Box className="comment-panel">
                    <p className='comment-header'>Article Comments and Feedbacks</p>
                    <Box className='comment-content'>
                        {
                            newComment.length > 0 && newComment.map((comment, i) => {
                                return(
                                    <Box key={i} className='flex p-3 ml-1'>
                                        <Avatar {...stringAvatar(comment.name)} />
                                        <div className='flex justify-between w-full'>
                                            <div className='ml-3 comment-body mr-1'>
                                                <p className='mb-1'><b>{comment.name}</b> |
                                                    <span className='ml-1'><Moment format='MMMM DD, YYYY'>{comment.date}</Moment></span> 
                                                </p>
                                                <p>{comment.comment}</p>
                                            </div>
                                            {
                                                userType === "super-admin" && 
                                                <Button variant='contained' color='error' onClick={() => {deleteUserComment(comment.id)}}>
                                                    <DeleteIcon 
                                                        style={{ fontSize: "20px"}}
                                                    />
                                                </Button>
                                            }
                                        </div>
                                    </Box>
                                )
                            })
                        }
                        {
                            newComment.length === 0 && <Box style={{ height: "100%"}} className='flex p-4 justify-center text-center items-center'>
                                <p>No Comments</p>
                            </Box>
                        }
                    </Box>
                    <Box className='comment-input-container'>
                        <TextField
                            id="standard-multiline-static"
                            value={userComment}
                            onChange={e => {
                                setUserComment(e.target.value)
                                setErr('');
                            }}
                            error={err}
                            label="Write a comment"
                            rows={4}
                            multiline
                            variant="filled"
                            className='comment-input'
                            helperText={err}
                        />
                        <div className="ml-2 abs-btn">
                            <Button variant='contained' size='small' className="send-button" onClick={() => { createComment() }}>
                                <SendIcon style={{fontSize: "17px"}}/>
                            </Button>
                        </div>
                    </Box>
                </Box>
            </div>
        </ResponsiveDrawer>
    );
}

export default ArchiveView;
