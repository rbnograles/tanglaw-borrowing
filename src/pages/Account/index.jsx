import React, { useState, useEffect } from 'react';
// components
import ResponsiveDrawer from '../../components/ResponsiveDrawer';
import PageTitle from '../../components/PageTitle';
import UserTablePanel from './AccountTabs';
// context
import { UserProfile } from '../../context/UsersProfileContext';

const Account = () => {

    // state
    const [profile, setProfile] = useState({ firstName: "", lastName: "", department: "", userType: "" });
    // context
    const { getUserProfile } = UserProfile();

    const _getUserProfile = async () => {
        try {
            const data = await getUserProfile(localStorage.getItem("uid"));
            setProfile(data[0]);
        } catch (error) {
            setProfile({});
        }
    }

    const capitalized = (word) => {
        const str = word;
        const str2 = str.charAt(0).toUpperCase() + str.slice(1);
        return str2;
    }

    useEffect(() => {
        _getUserProfile();
    }, []);

    return (
        <ResponsiveDrawer>
            <PageTitle
                title={`${profile.firstName} ${profile.lastName}`}
                description={`${profile.department} | ${profile.userType === "super-admin" ? "Administrator" : capitalized(profile.userType)}`}
            />
            <UserTablePanel
                type={profile.userType}
            />
        </ResponsiveDrawer>
    );
}

export default Account;
