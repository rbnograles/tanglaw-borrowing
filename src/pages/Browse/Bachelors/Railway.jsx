import React, { useState, useMemo, useEffect } from 'react';
// custom components
import ResponsiveDrawer from '../../../components/ResponsiveDrawer';
import PageTitle from '../../../components/PageTitle';
import Pagination from '../../../components/Pagination';
import ArchiveListItem from '../ArchiveListItem';
import EmptyContainer from '../../../components/Empty/EmptyContainer';
// context
import { Documents } from "../../../context/DocumentsContext";

let PageSize = 10;

const Railway = () => {
    // state
    const [currentPage, setCurrentPage] = useState(1);
    const [documents, setDocuments] = useState([]);

    // context
    const { getAllDocumentPerDepartment } = Documents();

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return documents.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, documents]);
    
    const _getAllDocumentsPerDepartment = async () => {
        try {
            const data = await getAllDocumentPerDepartment("Bachelor of Science in Railway Engineering (BSRE)");
            setDocuments(data);
        } catch (error) {
            setDocuments([]);
        }
    }

    useEffect(() => {
        _getAllDocumentsPerDepartment();
    }, []);

    return (
        <ResponsiveDrawer>
            <PageTitle
                title="Bachelor of Science in Railway Engineering (BSRE)"
                description="All Bachelors Thesis for the course of Railway Engineering can be found here."
            />
            { documents.length > 0 && currentTableData.map((item, index) => {
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
    );
}

export default Railway;
