import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loading from '../Component/Loading/Loading';
import Swal from 'sweetalert2';

const BlockedGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false); 

  useEffect(() => {
    if (!loading && user?.isBlocked && !checked) {
      Swal.fire({
        icon: 'error',
        title: 'Action Not Allowed',
        text: 'Your account is blocked. Please contact the authorities to unlock your account.',
        confirmButtonText: 'Go to Profile',
        allowOutsideClick: false, 
      }).then(() => {
        navigate('/dashboard/profile'); 
      });
      setChecked(true); 
    }
  }, [loading, user, checked, navigate]);

  
  if (loading) return <Loading />;

  
  if (!user?.isBlocked) return children;


  return null;
};

export default BlockedGuard;
