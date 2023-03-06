    import React from 'react';

    import {Cards} from '../components';
    
    const About = () => {
      document.title = "Tanglaw | About";
      return (
        <div className="tanglaw__page-title">
          <Cards 
            CTitle={'About Us'}
            CAbout={"The Tanglaw Thesis Respository is a digital repository of theses and dissertations of students, faculty and researchers of Computer Engineering Department of Tanglaw Manila."}
            />
         </div>
      )
    }
    
    export default About;