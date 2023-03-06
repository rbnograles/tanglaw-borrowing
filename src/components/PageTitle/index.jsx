import React from 'react';

const PageTitle = ({title, description}) => {
    return (
        <div className='custom-page-title'>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    );
}

export default PageTitle;
