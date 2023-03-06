import React from 'react';
import {Cards } from '../components';

const Contact = () => {
  document.title = "Tanglaw | Contact Us";
  return (
    <div className="tanglaw__page-title">
      <Cards 
       CTitle={'Contact Us'}
        Cpup = {"Polytechnic University of the Philippines"}
        Ccea = {"College of Engineering and Architecture Bldg."}
        CAddress = {"Anonas St., Sta. Mesa"}
        CCity = {"Manila 1016"}
        CNum1 = {"Tel Nos.335-1762 (direct line)"}
        CNum2 = {"335-1777 or 335-1787 (trunk lines)"}
        CEmail = {"Email: library@Tanglaw.edu.ph"}
        />
    </div>
  )
}

export default Contact;