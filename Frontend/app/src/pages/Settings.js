import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Switch, FormGroup, FormControlLabel, 
  TextField, Button, Divider, Alert, Avatar, Skeleton, 
  List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import { Person, AlternateEmail, CalendarToday } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true,
  });
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [token]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, you would save settings to backend or localStorage
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Format a date string nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Application Settings Panel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'background.subtle' }}>
            <Typography variant="h6" gutterBottom>
              Application Settings
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'background.subtle' }} />
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.darkMode} 
                    // onChange={handleChange} 
                    disabled
                    name="darkMode" 
                  />
                }
                label="Dark Mode"
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.notifications} 
                    onChange={handleChange} 
                    name="notifications" 
                  />
                }
                label="Enable Notifications"
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={settings.autoSave} 
                    onChange={handleChange} 
                    name="autoSave" 
                  />
                }
                label="Auto Save Documents"
              />
            </FormGroup>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save Settings
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* User Profile Panel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'background.subtle' }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'background.subtle' }} />
            
            {loading ? (
              // Loading state
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" width="100%" height={120} />
              </Box>
            ) : error ? (
              // Error state
              <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
            ) : (
              // Profile data
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {profileData?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {profileData?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileData?.role?.charAt(0).toUpperCase() + profileData?.role?.slice(1)}
                  </Typography>
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AlternateEmail color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={profileData?.email} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Joined" 
                      secondary={profileData?.created_at ? formatDate(profileData.created_at) : 'N/A'} 
                    />
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Person />}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;