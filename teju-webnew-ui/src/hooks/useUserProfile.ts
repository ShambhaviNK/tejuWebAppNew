import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  age: number;
  likes_food: string;
  important_people: string;
  activities: string;
  classmates: string;
  family: string;
  teachers: string;
  call_parents: string;
  siblings: string;
  nicknames: string;
  frustrate: string;
  happy: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const profileData = localStorage.getItem('user_profile');
      if (profileData) {
        const parsed = JSON.parse(profileData);
        setProfile(parsed);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = (newProfile: UserProfile) => {
    try {
      localStorage.setItem('user_profile', JSON.stringify(newProfile));
      setProfile(newProfile);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  const clearProfile = () => {
    try {
      localStorage.removeItem('user_profile');
      setProfile(null);
      return true;
    } catch (error) {
      console.error('Error clearing user profile:', error);
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    clearProfile,
    hasProfile: !!profile
  };
} 