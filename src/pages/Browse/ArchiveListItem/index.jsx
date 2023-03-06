import React, { useEffect, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FaceIcon from '@mui/icons-material/Face';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
// context
import { Documents } from "../../../context/DocumentsContext";
import { BookMark } from "../../../context/BookMarkContext";

let abstractNum = 750;

const ArchiveListItem = ({ item, index }) => {
    // state
    const [bookMarks , setBookMarks] = useState([])
    // use context
    const { updateVisitationCount } = Documents();
    const { addUserBookMark, getAllUserBookMark, removeABookMark } = BookMark();

    const redirectToViewDocument = async (id) => {
        await updateVisitationCount(id)
        window.location.href = `/result?${id}`
    }
    
    const _getAllUserBookMark = async () => {
        try {
            const data = await getAllUserBookMark();
            setBookMarks(data[0].bookMarks)
        } catch (error) {
            setBookMarks([])
        }
    }

    const addToBookMark = async () => {
        await addUserBookMark(localStorage.getItem('uid'), item.id);
        setBookMarks([item.id]);
    }

    const removedBookMark = async () => {
        try {
            const filteredList = bookMarks.filter((i) => i !== item.id)
            setBookMarks(filteredList);
            await removeABookMark(item.id);
        } catch (error) {
            setBookMarks(bookMarks);
        }
    }

    useEffect(() => {
        _getAllUserBookMark();
    }, []);

    return (
        <Box key={index} sx={{ boxShadow: 4, borderRadius: "5px", marginBottom: "10px", padding: "20px"}}>
            <p className='lits-title'>{item.documentName}</p>
            <div className='flex mb-2'>
                <Stack direction="row" spacing={1} className="mr-2">
                    {
                        item.authors.map((author, i) => {
                            return(    
                                <Chip icon={<FaceIcon />} size='small' key={i} label={author} variant="outlined" />
                            )
                        })
                    }
                </Stack>
                <p style={{ fontSize: "15px"}}> - Retrieved from school year <b>{item.schoolYear}</b>.</p>
            </div>
            <p className='lits-abstract'>{item.abstract.slice(0, abstractNum) + (item.abstract.length > abstractNum ? "..." : "")}</p>
            <Stack direction="row" spacing={1} className="mr-2 mb-2 mt-2">
                <b>Keywords:</b>
                {
                    item.keywords.map((author, i) => {
                        return(    
                            <Chip size='small' key={i} label={author} variant="outlined" />
                        )
                    })
                }
            </Stack>
            <Divider/>
            <div className='flex mt-3 justify-between'>
                <div className='flex'>
                    <div className='mr-5'>
                        <Button size='small' onClick={() => { 
                            bookMarks.filter((i) => i === item.id).length === 0 
                            ? addToBookMark ()
                            : removedBookMark()
                        }}>
                            {
                                bookMarks.filter((i) => i === item.id).length > 0 ? <BookmarkIcon className='mr-2'/> : <BookmarkBorderOutlinedIcon className='mr-2'/>
                            }
                            Bookmark
                        </Button>
                    </div>
                    <div className='mr-5'>
                        <Button size="small" onClick={() => { navigator.clipboard.writeText(item.citations[0]) }}>
                            <FormatQuoteOutlinedIcon className='mr-2'/>
                            Cite
                        </Button>
                    </div>
                    <div>
                        <p className='static-label'> Visitation count: {item.visitLogs.length}</p>
                    </div>
                </div>
                <Button variant='contained' size="small" onClick={() => {redirectToViewDocument(item.id)}}>
                    <AutoStoriesIcon className='mr-2' style={{ fontSize: "17px"}}/> Read Article
                </Button>
            </div>
        </Box>
    );
}

export default ArchiveListItem;
