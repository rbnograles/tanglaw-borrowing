/*
* Use: import {getSchoolYears} from './utilities/schoolYears';
*/
const currentYear = new Date().getFullYear();
const schoolYears = []
export const getSchoolYears = () =>{
    let newSchoolYears = [];
    let earliestYear = 1904;
    let thisYear = currentYear;
    while(thisYear != earliestYear ){
        newSchoolYears.push(`${thisYear-1}-${thisYear}`);
        thisYear--;
    }
    return(newSchoolYears);
}
export default schoolYears;
