import React, { useState, useEffect, useMemo } from 'react';
// custom components
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
import PageTitle from '../../components/PageTitle';
import Pagination from '../../components/Pagination';
import ArchiveListItem from '../../pages/Browse/ArchiveListItem';
import EmptySearchContainer from './EmptySearchContainer';
// context
import { Documents } from "../../context/DocumentsContext";
// react router dom
import { useSearchParams } from "react-router-dom";

let PageSize = 10;
const Search = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    // state
    const [currentPage, setCurrentPage] = useState(1);
    const [documents, setDocuments] = useState([]);

    // context
    const { getAllDocuments } = Documents();

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return documents.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, documents]);

    const _getAllDocuments = async () => {
        try {
            setDocuments([]);
            const data = await getAllDocuments();
            let newData = [];
            data.forEach(dat=>{
                if(dat.binned === false){
                    if(dat.documentName.toLowerCase().includes(searchParams.get("keyword"))){
                        newData.push(dat);
                    }else{
                        let contains = false;
                        dat.keywords.forEach(word=>{
                            if(word.toLowerCase() === searchParams.get("keyword")){
                                contains = true;
                            }
                        })
                        if(contains === true){
                            newData.push(dat);
                        }
                    }
                }
            })
            setDocuments(newData);
        } catch (error) {
            setDocuments([]);
        }
    }

    useEffect(() => {
        _getAllDocuments();
    }, []);

    useEffect(() => {
        _getAllDocuments();
    },[searchParams])

    return(
        <ResponsiveDrawer>
            <PageTitle
                title="Search"
                description={`Showing documents that may contain the keyword "${searchParams.get("keyword")}"`}
            />
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
                documents.length === 0 && <EmptySearchContainer keyword={searchParams.get("keyword")}/> 
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
export default Search