import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import SnackbarComponent from '../../components/Snackbar';

// react router dom
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../../context/DashboardContext';

const Search = () => {
  const [keyWord, setKeyWord] = useState("");
  // snackbar state
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [snackBarType, setSnackbarType] = useState('');

  const { addNewSearches } = DashboardStats();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }

  const navigate = useNavigate();
  const searchKeyword = () =>{
    if(keyWord === ""){
      setOpenSnackbar(true);
      setMessage("Keyword search input is empty")
      setSnackbarType("error")
    }else{
      // if search succeeds add a new item on search collection for analytics
      addNewSearches(keyWord.toLowerCase());
      // proceed with path
      navigate({
        pathname: '/search',
        search: `?keyword=${keyWord.toLowerCase()}`,
      });
    }
  }

  return (
    <FormControl variant="outlined" className='search-input'>
      <InputLabel htmlFor="outlined-adornment-password">Search Keyword</InputLabel>
      <OutlinedInput
          value={keyWord}
          onChange={e=>setKeyWord(e.target.value)}
          id="outlined-adornment-password"
          size='small'
          type="text"
          endAdornment={
            <InputAdornment position="end">
                <IconButton
                    onClick={searchKeyword}
                    aria-label="toggle password visibility"
                    edge="end"
                >
                <SearchIcon style={{ color: "white"}} />
                </IconButton>
            </InputAdornment>
          }
          label="Password"
      />
      <SnackbarComponent
        open={openSnackBar}
        type={snackBarType}
        message={message}
        handleClose={handleCloseSnackbar}
      />
    </FormControl>
  )
}

export default Search;