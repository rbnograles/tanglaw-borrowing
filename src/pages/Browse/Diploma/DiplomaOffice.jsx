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

const DiplomaCivil = () => {
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
            const data = await getAllDocumentPerDepartment("Diploma in Office Management Technology (DOMT)");
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
                title="Diploma in Office Management Technology (DOMT)"
                description="All Thesis for the Diploma in the course of Office Management Technology can be found here."
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

export default DiplomaCivil;
