import { useState, useEffect } from 'react'
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from '../firebase';

const formatAuthUser = (user) => ({
  email: user.email,
  password : user.password
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return;
    }

    setLoading(true)
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);    
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged)
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading
  };
}