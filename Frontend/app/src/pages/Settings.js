import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Switch, FormGroup, FormControlLabel, 
  TextField, Button, Divider, Alert 
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true,
    apiEndpoint: 'http://localhost:8000/api',
    apiKey: '********-****-****-****-************',
  });

  const [saved, setSaved] = useState(false);

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

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Application Settings
            </Typography>
            <Divider sx={{ my: 2 }} />
            
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
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="API Endpoint"
                name="apiEndpoint"
                value={settings.apiEndpoint}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="API Key"
                name="apiKey"
                value={settings.apiKey}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                type="password"
              />
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save Settings
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;