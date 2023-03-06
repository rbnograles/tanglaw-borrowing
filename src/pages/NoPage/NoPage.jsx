import { Button } from '@mui/material';
import React, { Fragment } from 'react';
import Error404Image from "../../assets/404.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className='flex justify-center' style={{ height: "80vh"}}>
        <img src={Error404Image} alt={404} style={{ height: "100%"}}/>
      </div>
      <div className='flex justify-center'>
        <Button variant="contained" onClick={() => { navigate(-1)}}>
          <ArrowBackIcon style={{ marginRight: "10px"}}/>
          Previous Page
        </Button>
      </div>
    </Fragment>
  );
}

export default NoPage;
