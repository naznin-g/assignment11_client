import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

const StaffProfile = () => {
    const { user, updateStaffProfile } = useAuth();
    const [name, setName] = useState(user.name);

    const handleUpdate = () => {
        updateStaffProfile({ name });
        alert('StaffProfile updated!');
    };

    return (
        <div>
            <h1>My StaffProfile</h1>
            <img src={user.photoURL} alt="StaffProfile" />
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
            <button onClick={handleUpdate}>Update</button>
        </div>
    );
};

export default StaffProfile;
