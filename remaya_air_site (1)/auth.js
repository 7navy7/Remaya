// auth.js - Improved version
const STORAGE_KEY = 'remaya-air-users';

function initUserStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const demoUsers = [
      {
        id: 'user-1',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@remaya.com',
        password: hashPassword('demo123'),
        city: 'Jeddah',
        country: 'Saudi Arabia',
        createdAt: new Date().toISOString(),
        bookings: [],
        settings: {
          preferredLanguage: 'en',
          currency: 'SAR'
        }
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers));
  }
}

// ... (rest of auth.js remains the same until loginUser)

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user || hashPassword(password) !== user.password) {
    throw new Error('Invalid credentials');
  }

  localStorage.setItem('currentUser', JSON.stringify({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    city: user.city,
    country: user.country,
    name: `${user.firstName} ${user.lastName}`
  }));
  
  return user;
}

// Add this new function to auth.js
function getCurrentUserDetails() {
  const user = getCurrentUser();
  if (!user) return null;
  
  const users = getUsers();
  return users.find(u => u.email === user.email);
}

function hashPassword(password) {
  // Simple hash function for demo purposes
  // In production, use a proper hashing algorithm like bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

function registerUser(userData) {
  const users = getUsers();
  
  // Check if user already exists
  if (users.some(u => u.email === userData.email)) {
    throw new Error('User already exists');
  }
  
  // Create new user object
  const newUser = {
    id: `user-${Date.now()}`,
    ...userData,
    password: hashPassword(userData.password),
    createdAt: new Date().toISOString(),
    bookings: [],
    settings: {
      preferredLanguage: 'en',
      currency: 'SAR'
    }
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  
  return {
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName
  };
}

function getUsers() {
  initUserStorage(); // Ensure storage is initialized
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Initialize user storage when the script loads
initUserStorage();