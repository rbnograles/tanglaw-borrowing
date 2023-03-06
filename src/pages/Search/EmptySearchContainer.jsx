import React from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const EmptySearchContainer = (props) => {
    return (
        <div className="page-empty-container">
            <div className='bg-circle'>
                <FolderOpenIcon className='icon-header'/>
            </div>
            <p className='header-1'>Oops!</p>
            <p className='header-2'>{`There's no document with keyword ${props.keyword} in it`}</p>
        </div>
    );
}

export default EmptySearchContainer;
