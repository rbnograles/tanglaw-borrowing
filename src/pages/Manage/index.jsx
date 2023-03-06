import React, { useEffect, useState } from 'react';
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
// custom components
import PageTitle from '../../components/PageTitle';
import AccountTabs from './AccountTabs';

// context 
import { UserProfile } from '../../context/UsersProfileContext'; 

const Manage = () => {
    // states
    const [profile, setProfile] = useState({});
    // constants
    const adminTabs = ["Student", "Faculty", "Administrators"];
    const facultyTabs = ["Student"];
    // context
    const { getUserProfile } = UserProfile();

    const _getUserProfile = async () => {
        try {
            const data = await getUserProfile(localStorage.getItem('uid'));
            setProfile(data[0]);
        } catch (error) {
            setProfile({});
        }
    } 

    useEffect(() => {
        _getUserProfile();
    }, []);

    return (
        <ResponsiveDrawer>
            <PageTitle
                title="Manage Accounts"
                description="Manage students, faculty, and administrator accounts with ease"
            />
            <AccountTabs 
                tabs={profile.userType === "super-admin" ? adminTabs : facultyTabs}
                profile={profile}
            />
        </ResponsiveDrawer>
    );
}

export default Manage;
