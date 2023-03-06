import React, { Fragment, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PreviewIcon from '@mui/icons-material/Preview';
import GroupIcon from '@mui/icons-material/Group';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
// context
import { UserProfile } from '../../context/UsersProfileContext';
// customs
import Logo from "../../assets/tanglaw.png"
import { Link } from 'react-router-dom';

const currentWindow = window;

const Sidebar = (props) => {
  // context
  const { getUserProfile } = UserProfile();
  // states
  const [profile, setProfile] = useState({});
  // constants 
  const { window, drawerWidth, mobileOpen, handleDrawerToggle } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  /**
   * Function for getting the current logged in users profile
   * Contains an object with users information
   */
  const _getUserProfile = async () => {
    const uid = localStorage.getItem('uid');
    const data = await getUserProfile(uid);
    const profile = data[0];
    // below this are data setters 
    setProfile(profile);
  }
  // browse access
  const bachelorsCourse = [
    {
      name: "Civil Engineering",
      path: "/bachelors/civil-engineering"
    },
    {
      name: "Computer Engineering",
      path: "/bachelors/computer-engineering"
    },
    {
      name: "Electrical Engineering",
      path: "/bachelors/electrical-engineering"
    },
    {
      name: "Electronics Engineering",
      path: "/bachelors/electronics-engineering"
    },
    {
      name: "Industrial Engineering",
      path: "/bachelors/industrial-engineering"
    },
    {
      name: "Mechanical Engineering",
      path: "/bachelors/mechanical-engineering"
    },
    {
      name: "Railway Engineering",
      path: "/bachelors/railway-engineering"
    }
  ]
  const diplomaCourse = [
    {
      name: "Civil Engineering",
      path: "/diploma/civil-engineering"
    },
    {
      name: "Computer Engineering",
      path: "/diploma/computer-engineering"
    },
    {
      name: "Electrical Engineering",
      path: "/diploma/electrical-engineering"
    },
    {
      name: "Electronics  Engineering",
      path: "/diploma/electronics-engineering"
    },
    {
      name: "Information Communication",
      path: "/diploma/information-communications"
    },
    {
      name: "Mechanical Engineering",
      path: "/diploma/mechanical-engineering"
    },
    {
      name: "Office Management",
      path: "/diploma/office-management"
    },
    {
      name: "Railway Engineering",
      path: "/diploma/railway-engineering"
    }
  ]

  const userAccess = [
    {
      name: "Home",
      icon: <HomeIcon/>,
      path: "/home"
    }
  ];
  const adminAccess = [
    {
      name: "Dashboard",
      icon: <DashboardIcon/>,
      path: "/dashboard"
    },
    {
      name: "Preview Home",
      icon: <PreviewIcon/>,
      path: "/preview-home"
    },
    {
      name: "Manage Accounts",
      icon: <GroupIcon/>,
      path: "/manage-accounts"
    },
    {
      name: "Archives",
      icon: <LibraryBooksIcon/>,
      path: "/archives"
    },
    {
      name: "Export",
      icon: <FileDownloadIcon/>,
      path: "/export"
    }
  ]

  /**
   * This function filters the list of links on the navbar based on the user type
   * super-admin only has the dashboard link
   * @returns array of routes
   */
  const filterFeatures = () => {
    if(profile.userType === "super-admin" || profile.userType === "faculty") {
      return adminAccess;
    }
    if(profile.userType === "student") {
      return userAccess;
    }
    return []
  }

  useEffect(() => {
    _getUserProfile();
  }, []);
  // this component will render the drawsers
  const drawer = (
    <Fragment>
      <Toolbar sx={{ background: "rgba(161, 35, 30, 1)", border: "none"}}>
        <img src={Logo} alt="Tanglaw"/>
      </Toolbar>
      <Divider />
      <p className='sidebar-label-panel'>Management Panel</p>
      <List>
        {
          filterFeatures().map((item, index) => ( 
            <ListItem 
              className={
                currentWindow.location.pathname === `/${item.name.split(' ').join('-').toLowerCase()}` 
                ? "active-panel" 
                : ""
              } 
              key={index} disablePadding>
              <Link
                key={item.name} 
                to={`/${item.name.split(' ').join('-').toLowerCase()}`} 
                style={{ width: "100%"}}
                >
                  <ListItemButton>
                    <ListItemIcon
                      className={
                        currentWindow.location.pathname === `/${item.name.split(' ').join('-').toLowerCase()}` 
                        ? "active-icon" 
                        : ""
                      } 
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </Link>
            </ListItem>
          ))
        }
      </List>
      <Divider/>
      <p className='sidebar-label-panel'>Browse in College of Engineering</p>
      <List dense>
        {
          bachelorsCourse.map((text, index) => (
            <ListItem
              key={index}
              className={currentWindow.location.pathname === text.path
                ? "active-panel" 
                : ""
              } 
              disablePadding
            >
              <Link
                to={text.path} 
                style={{ width: "100%"}}
              >
                <ListItemButton>
                  <ListItemIcon
                    className={currentWindow.location.pathname === text.path
                      ? "active-icon" 
                      : ""
                    } 
                  >
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={text.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))
        }
      </List>
      <Divider/>
      <p className='sidebar-label-panel'>Browse in Institute of Technology</p>
      <List dense>
        {
          diplomaCourse.map((text, index) => (
            <ListItem
              key={index}
              className={currentWindow.location.pathname === text.path
                ? "active-panel" 
                : ""
              } 
              disablePadding
            >
              <Link
                to={text.path} 
                style={{ width: "100%"}}
              >
                <ListItemButton>
                  <ListItemIcon
                    className={currentWindow.location.pathname === text.path
                      ? "active-icon" 
                      : ""
                    } 
                  >
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={text.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))
        }
      </List>
    </Fragment>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
  >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
            keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
          variant="permanent"
          sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
      >
        {drawer}
      </Drawer>
  </Box>
  );
}

export default Sidebar;
