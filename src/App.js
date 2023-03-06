import React, { Fragment, useState, useEffect } from 'react';
// css
import './App.css';
// utilities
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Helmet from "react-helmet"
import ProtectedRoutes from './utilities/ProtectedRoutes';
import LandingPage from "./pages/Landing-Page/index";
import Home from "./pages/Home/Home";
import Account from './pages/Account';
import Dashboard from './pages/Dashboard/Dashboard';
import Manage from "./pages/Manage/index";
import NoPage from "./pages/NoPage/NoPage";
import Archive from './pages/Archive/Archive';
import Civil from "./pages/Browse/Bachelors/Civil";
import Computer from "./pages/Browse/Bachelors/Computer";
import Electrical from "./pages/Browse/Bachelors/Electrical";
import Electronics from "./pages/Browse/Bachelors/Electronics";
import Mechanical from "./pages/Browse/Bachelors/Mechanical";
import Industrial from "./pages/Browse/Bachelors/Industrial";
import Railway from "./pages/Browse/Bachelors/Railway";
import ArchiveView from './pages/Browse/ArchiveView';
import DiplomaCivil from './pages/Browse/Diploma/DiplomaCivil';
import DiplomaComputer from './pages/Browse/Diploma/DiplomaComputer';
import DiplomaElectrical from './pages/Browse/Diploma/DiplomaElectrical';
import DiplomaElectronics from './pages/Browse/Diploma/DiplomaElectronics';
import DiplomaInformation from './pages/Browse/Diploma/DiplomaInformation';
import DiplomaMechanical from './pages/Browse/Diploma/DiplomaMechanical';
import DiplomaOffice from './pages/Browse/Diploma/DiplomaOffice';
import DiplomaRailway from './pages/Browse/Diploma/DiplomaRailway';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import Search from './pages/Search/Search';
import Export from './pages/Export/Export';
// context
import { AuthContextProvider } from './context/AuthContext';
import { UserProfileContextProvider } from './context/UsersProfileContext';
import { DocumentContextProvider } from './context/DocumentsContext';
import { SystemLogsContextProvider } from './context/LogsContext';
import { CommentContextProvider } from './context/CommentContext';
import { BookMarkContextProvider } from './context/BookMarkContext';
import { DashboardContextProvider } from "./context/DashboardContext";

const App = () => {
  // state
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  /**
   * This function will render a path component 
   * if the user type has access to it
   */
  const checkRouteAccess = () => {
    if(userType === "super-admin" || userType === "faculty") {
      return (
        <Fragment>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoutes>
                <UserProfileContextProvider>
                  <Dashboard />
                </UserProfileContextProvider>
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/manage-accounts" 
            element={
              <ProtectedRoutes>
                <UserProfileContextProvider>
                  <Manage />
                </UserProfileContextProvider>
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/preview-home" 
            element={
              <ProtectedRoutes>
                <UserProfileContextProvider>
                  <DocumentContextProvider>
                    <Home />
                  </DocumentContextProvider>
                </UserProfileContextProvider>
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/archives" 
            element={
              <ProtectedRoutes>
                <UserProfileContextProvider>
                  <DocumentContextProvider>
                    <Archive />
                  </DocumentContextProvider>
                </UserProfileContextProvider>
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/export" 
            element={
              <ProtectedRoutes>
                <UserProfileContextProvider>
                  <DocumentContextProvider>
                    <Export />
                  </DocumentContextProvider>
                </UserProfileContextProvider>
              </ProtectedRoutes>
            } 
          />
        </Fragment>
      )
    }
  }

  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
  }, []);

  return (
    <Fragment>
      <Helmet>Tanglaw Thesis Repository</Helmet>
      <AuthContextProvider>
        <SystemLogsContextProvider>
          <BookMarkContextProvider>
            <DashboardContextProvider>
              <BrowserRouter>
                <Routes>
                  <Route 
                    index 
                    element={
                      <UserProfileContextProvider>
                        <LandingPage />
                      </UserProfileContextProvider>
                    } 
                  />
                  {
                    checkRouteAccess()
                  }
                  <Route 
                    path="/account" 
                    element={
                      <ProtectedRoutes>
                        <UserProfileContextProvider>
                          <DocumentContextProvider>
                            <Account />
                          </DocumentContextProvider>
                        </UserProfileContextProvider>
                      </ProtectedRoutes>
                    } 
                  />
                  <Route 
                      path="/home" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <Home />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/result" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <CommentContextProvider>
                                <ArchiveView />
                              </CommentContextProvider>
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/bachelors/civil-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <Civil />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/bachelors/computer-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <Computer />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/bachelors/electrical-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <Electrical />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/bachelors/electronics-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <Electronics />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/bachelors/mechanical-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <Mechanical />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/bachelors/industrial-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <Industrial />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/bachelors/railway-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <Railway />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/diploma/civil-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <DiplomaCivil />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/diploma/computer-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <DiplomaComputer />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/diploma/electrical-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <DiplomaElectrical />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/diploma/electronics-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <DiplomaElectronics />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/diploma/information-communications" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <DiplomaInformation />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/diploma/mechanical-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <DiplomaMechanical />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/diploma/office-management" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <DiplomaOffice />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                    <Route 
                      path="/diploma/railway-engineering" 
                      element={
                        <ProtectedRoutes>
                          <UserProfileContextProvider>
                            <DocumentContextProvider>
                              <DiplomaRailway />
                            </DocumentContextProvider>
                          </UserProfileContextProvider>
                        </ProtectedRoutes>
                      } 
                    />
                  <Route 
                    path="/contact-us" 
                    element={
                      <ProtectedRoutes>
                        <UserProfileContextProvider>
                          <Contact />
                        </UserProfileContextProvider>
                      </ProtectedRoutes>
                    } 
                  />
                  <Route 
                    path="/about-us" 
                    element={
                      <ProtectedRoutes>
                        <UserProfileContextProvider>
                          <About />
                        </UserProfileContextProvider>
                      </ProtectedRoutes>
                    } 
                  />
                  <Route 
                    path="/search" 
                    element={
                      <ProtectedRoutes>
                        <UserProfileContextProvider>
                          <DocumentContextProvider>
                            <Search />
                          </DocumentContextProvider>
                        </UserProfileContextProvider>
                      </ProtectedRoutes>
                    } 
                  />
                <Route path="*" element={<NoPage />} />
                </Routes>          
              </BrowserRouter>
            </DashboardContextProvider>
          </BookMarkContextProvider>
        </SystemLogsContextProvider>
      </AuthContextProvider>
    </Fragment>
  )
}

export default App;