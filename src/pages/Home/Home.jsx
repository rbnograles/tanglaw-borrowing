import React, { useEffect, useState, useMemo, Fragment } from 'react'
import FaceIcon from '@mui/icons-material/Face';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
// components
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
import PageTitle from '../../components/PageTitle';
import ArchiveListItem from '../Browse/ArchiveListItem';
import EmptyContainer from '../../components/Empty/EmptyContainer';
import Pagination from '../../components/Pagination';
// context
import { UserProfile } from '../../context/UsersProfileContext';
import { Documents } from "../../context/DocumentsContext";
import { Box, Divider } from '@mui/material';

let PageSize = 10;
let abstractNum = 250;

const Home = () => {
  // state
  const [currentPage, setCurrentPage] = useState(1);
  const [documents, setDocuments] = useState([]);
  const [name, setName] = useState("");
  const [renderBestPaper, setRenderBestPaper] = useState(false);
  const [paperOfTheDay, setPaperOfTheDay] = useState({ authors: [], abstract: "", visitLogs: [], documentName: "" });
  // context
  const { getAllDocumentsWithoutBinnedDocuments, getPaperOfTheDay } = Documents();
  const { getUserProfile } = UserProfile();
  /**
   * Function for getting the current logged in users profile
   * Contains an object with users information
   */
  const _getUserProfile = async () => {
    const uid = localStorage.getItem('uid');
    const data = await getUserProfile(uid);
    const profile = data[0];
    setName(`${profile.firstName} ${profile.lastName}`);
  }

  const currentTableData = useMemo(() => {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      return documents.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, documents]);
  
  const _getAllDocumentsWithoutBinnedDocuments = async () => {
      try {
          const data = await getAllDocumentsWithoutBinnedDocuments();
          const papers = await getPaperOfTheDay();
          if(papers !== undefined) {
            setPaperOfTheDay(papers[0]);
            setRenderBestPaper(true);
          }
          setDocuments(data);
      } catch (error) {
          setDocuments([]);
      }
  }

  useEffect(() => {
    _getUserProfile();
    _getAllDocumentsWithoutBinnedDocuments();
  }, []);

  return (
    <ResponsiveDrawer>
      <PageTitle
        title={`Welcome ${name}!`}
        description="Access all thesis documents uploaded within this repository with ease."
      />
      {
        renderBestPaper && 
        <Fragment>
          <p className="home-title">Tanglaw Awards Paper of the Day</p>
            <Box sx={{ boxShadow: 4, borderRadius: "5px"}} className="flex p-4">
              <div className='center-icon'>
                <EmojiEventsIcon
                  style={{ fontSize: "70px", color: "gold"}}
                />
              </div>
              <div className='ml-2'>
                <p className='lits-title'>{paperOfTheDay.documentName} | <span className='sub-tag'>Total Visitation: {paperOfTheDay.visitLogs.length}</span></p>
                <p className='lits-abstract mb-2'>{paperOfTheDay.abstract.slice(0, abstractNum) + (paperOfTheDay.abstract.length > abstractNum ? "..." : "")}</p>
                <Stack direction="row" spacing={1} className="mr-2">
                  {
                    paperOfTheDay.authors.map((author, i) => {
                        return(    
                            <Chip icon={<FaceIcon />} size='small' key={i} label={author} variant="outlined" />
                        )
                    })
                  }
                </Stack>
              </div>
            </Box>
            <br/>
            <Divider/>
            <br/>
        </Fragment>
      }
        <p className="home-title">Current Available Documents in the Repository</p>
        {documents.length > 0 && currentTableData.map((item, index) => {
          return (
              <ArchiveListItem
                  key={index}
                  index={index}
                  item={item}
              />
          );
      })}
      {
        documents.length === 0 && <EmptyContainer/> 
      }
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={documents.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
    </ResponsiveDrawer>
  )
}

export default Home;