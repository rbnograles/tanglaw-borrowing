import React from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const EmptyContainer = () => {
    return (
        <div className="page-empty-container">
            <div className='bg-circle'>
                <FolderOpenIcon className='icon-header'/>
            </div>
            <p className='header-1'>Oops!</p>
            <p className='header-2'>This course has no uploaded documents at the moment.</p>
        </div>
    );
}

export default EmptyContainer;
