import React from 'react';
import './ProfileTabs.css';

const ProfileTabs = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="profile-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default ProfileTabs;