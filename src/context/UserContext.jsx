import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load initial state from localStorage or set defaults
  const [userState, setUserState] = useState(() => {
    const savedState = localStorage.getItem('adhikarx_user_profile');
    if (savedState) return JSON.parse(savedState);
    
    return {
      isFirstTimeVoter: null, // null means unasked
      xp: 0,
      level: 'Beginner', // Beginner, Aware Citizen, Smart Voter, Pro Voter
      unlockedBadges: [],
      completedModules: []
    };
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('adhikarx_user_profile', JSON.stringify(userState));
  }, [userState]);

  const setFirstTimeVoter = (isFirstTime) => {
    setUserState(prev => ({ ...prev, isFirstTimeVoter: isFirstTime }));
  };

  const addXP = (amount, moduleName) => {
    setUserState(prev => {
      const newXp = prev.xp + amount;
      
      // Determine level based on XP
      let newLevel = 'Beginner';
      if (newXp >= 500) newLevel = 'Pro Voter';
      else if (newXp >= 300) newLevel = 'Smart Voter';
      else if (newXp >= 100) newLevel = 'Aware Citizen';

      // Check if module is already completed
      const newModules = prev.completedModules.includes(moduleName)
        ? prev.completedModules
        : [...prev.completedModules, moduleName];
        
      // Badge unlocking logic
      let newBadges = [...prev.unlockedBadges];
      
      if (moduleName === 'what_is_voting' && !newBadges.includes("Quiz Novice")) {
         newBadges.push("Quiz Novice");
      }
      if (moduleName === 'registration' && !newBadges.includes("Registration Master")) {
         newBadges.push("Registration Master");
      }
      if (moduleName === 'simulation_completed' && !newBadges.includes("Simulation Survivor")) {
         newBadges.push("Simulation Survivor");
      }
      if (newXp >= 500 && !newBadges.includes("AdhikarX Champion")) {
         newBadges.push("AdhikarX Champion");
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedModules: newModules,
        unlockedBadges: newBadges
      };
    });
  };

  return (
    <UserContext.Provider value={{ userState, setFirstTimeVoter, addXP }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
