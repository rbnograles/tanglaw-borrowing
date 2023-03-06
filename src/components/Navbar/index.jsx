import React, { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { red } from '@mui/material/colors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PhoneIcon from '@mui/icons-material/Phone';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import ArticleIcon from '@mui/icons-material/Article';
// routers
import { Link } from "react-router-dom"
// context
import { UserProfile } from "../../context/UsersProfileContext";
import { UserAuth } from '../../context/AuthContext';
// components
import Search from "../Search/Search";

const Navbar = ({ handleDrawerToggle, drawerWidth }) => {
  // context
  const { getUserProfile } = UserProfile();
  const { logout } = UserAuth();
  // state
  const [userType, setUserType] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [anchorElUser, setAnchorElUser] = useState(null);
  /**
   * Function for getting the current logged in users profile
   * Contains an object with users information
   */
  const _getUserProfile = async () => {
    const uid = localStorage.getItem('uid');
    const data = await getUserProfile(uid);
    const profile = data[0];
    const userInitials = getUserInitials(profile.firstName, profile.lastName);
    // below this are data setters 
    setUserInitials(userInitials);
    setUserType(profile.userType);
  }
  /**
   * 
   * @param {string} firstName 
   * @param {string} lastName 
   * @returns {String Inial} eg: RN
   */
  const getUserInitials = (firstName, lastName) => {
    const firstInitial = firstName.split('')[0];
    const lastInitial = lastName.split('')[0];
    return `${firstInitial + lastInitial}`;
  }
  // opening of user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  // closing of user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // sign out function, removes session from firebase auth
  const signOutUser = () => {
    logout();
    handleCloseUserMenu();
    // by uwing window.location, the page will be refreshed and all states will be reset
    // useNavigation in an option if there are no need for states to be resetted
    window.location.href = "/";
  }
  useEffect(() => {
    _getUserProfile();
  }, []);

  const renderMenu = (
    <Menu
      sx={{ mt: '45px' }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
    >
      <MenuItem onClick={handleCloseUserMenu}>
        <Link to="/account">
          <Typography textAlign="center">
            <AccountCircleIcon style={{ marginRight: "6px", color: "grey" }}/> My Account
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleCloseUserMenu}>
        <Link to="/about-us">
          <Typography textAlign="center">
            <LiveHelpIcon style={{ marginRight: "6px", color: "grey" }}/> About Us
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleCloseUserMenu}>
        <Link to="/contact-us">
          <Typography textAlign="center">
            <PhoneIcon style={{ marginRight: "6px", color: "grey" }}/> Contact Us
          </Typography>
        </Link>
      </MenuItem>
      <Divider/>
      {
        userType === "super-admin" &&
        <MenuItem>
          <Link to="/contact-us">
            <Typography textAlign="center">
              <ArticleIcon style={{ marginRight: "6px", color: "grey" }}/> Admin Guide
            </Typography>
          </Link>
        </MenuItem>
      }
      {
        userType === "faculty" && 
        <MenuItem>
          <Link to="/contact-us">
            <Typography textAlign="center">
              <ArticleIcon style={{ marginRight: "6px", color: "grey" }}/> Faculty  Guide
            </Typography>
          </Link>
        </MenuItem>
      }
      {
        userType === "student" && 
        <MenuItem>
          <Link to="/contact-us">
            <Typography textAlign="center">
              <ArticleIcon style={{ marginRight: "6px", color: "grey" }}/> Student  Guide
            </Typography>
          </Link>
        </MenuItem>
      }
      <Divider/>
      <MenuItem onClick={() => signOutUser()}>
        <Typography textAlign="center">
          <ExitToAppIcon style={{ marginRight: "6px", color: "grey" }}/> Logout
        </Typography>
      </MenuItem>
    </Menu>
  ) 

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        background: "radial-gradient(circle at 5% 10%, rgba(161, 35, 30, 1) 0%, rgba(72, 15, 13, 1) 100%)"
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Search/>
        {/* for context spacing */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: red[900] }}>
                {userInitials}
              </Avatar>
            </IconButton>
          </Tooltip>
          {renderMenu}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;