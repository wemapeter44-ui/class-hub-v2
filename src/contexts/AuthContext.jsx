import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);

  async function fetchRole(userId) {
    if (!userId) {
      setRole(null);
      return;
    }
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      console.error('Error fetching role:', error);
      setRole('student');
      return;
    }
    setRole(data?.role || 'student');
  }

  async function fetchAvatar(userId) {
    if (!userId) {
      setAvatarUrl(null);
      return;
    }
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${userId}/avatar.jpg`);
    const url = data?.publicUrl;
    if (!url) {
      setAvatarUrl(null);
      return;
    }
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) setAvatarUrl(url + '?t=' + Date.now());
      else setAvatarUrl(null);
    } catch {
      setAvatarUrl(null);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchRole(currentUser.id);
        fetchAvatar(currentUser.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          fetchRole(currentUser.id);
          fetchAvatar(currentUser.id);
        } else {
          setRole(null);
          setAvatarUrl(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function uploadAvatar(file) {
    if (!user) throw new Error('Not signed in');
    if (!file) throw new Error('No file');

    if (!file.type.startsWith('image/')) {
      throw new Error('Please choose an image file');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be under 5MB');
    }

    const path = `${user.id}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const freshUrl = data.publicUrl + '?t=' + Date.now();
    setAvatarUrl(freshUrl);
    return freshUrl;
  }

  const isAdmin = role === 'admin';

  const value = {
    user,
    role,
    isAdmin,
    loading,
    avatarUrl,
    signIn,
    signUp,
    signOut,
    uploadAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}