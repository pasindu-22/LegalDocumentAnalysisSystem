import React, { useState } from 'react';
import { 
  Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, 
  ListItem, ListItemIcon, ListItemText, Divider, Avatar,
  useTheme, useMediaQuery, 
} from '@mui/material';
import { 
  Menu as MenuIcon, Dashboard, Chat, Description, 
  Settings, ChevronLeft, Search, NotificationsOutlined,
  AccountCircle, Logout, EditNote,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const AppLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(!isMobile);
  const { logout, user } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Chat Assistant', icon: <Chat />, path: '/chat' },
    { text: 'Document Analysis', icon: <Description />, path: '/documents' },
    { text: 'Draft Contract', icon: <EditNote />, path: '/drafts' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: `calc(100% - ${open ? DRAWER_WIDTH : 0}px)` },
          ml: { sm: `${open ? DRAWER_WIDTH : 0}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" fontWeight="600">
              LegalAI
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" size="large">
              <Search />
            </IconButton>
            <IconButton color="inherit" size="large">
              <NotificationsOutlined />
            </IconButton>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.main',
                ml: 1
              }}
            >
              <AccountCircle />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: open ? DRAWER_WIDTH : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : 64,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          px: [1],
          py: 2
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: open ? 'space-between' : 'center',
            width: '100%' 
          }}>
            {open && (
              <Typography variant="h6" color="primary" fontWeight="600" sx={{ ml: 1 }}>
                LegalAI
              </Typography>
            )}
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeft />
            </IconButton>
          </Box>
        </Toolbar>
        <Divider sx={{ borderColor: 'background.subtle' }} />
        
        <Box sx={{ py: 2 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  mb: 0.5,
                  px: 2,
                  py: 1.5,
                  cursor: 'pointer',
                  '&.Mui-selected': {
                    backgroundColor: 'background.subtle',
                    borderRadius: theme.shape.borderRadius,
                    '&:hover': {
                      backgroundColor: 'background.subtle',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    borderRadius: theme.shape.borderRadius,
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    minWidth: open ? 40 : 36,
                    justifyContent: open ? 'start' : 'center'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 500 : 400,
                  }} 
                />}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        
        { /* Logout section */}
        <Divider sx={{ borderColor: 'background.subtle' }} />
        <Box sx={{ p: 2 }}>
          <ListItem 
            button
            onClick={handleLogout}
            sx={{
              cursor: 'pointer',
              borderRadius: theme.shape.borderRadius,
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.08)'
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: 'error.main',
                minWidth: open ? 40 : 36,
                justifyContent: open ? 'start' : 'center'
              }}
            >
              <Logout />
            </ListItemIcon>
            {open && <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                fontSize: '0.9rem'
              }} 
            />}
          </ListItem>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ 
      flexGrow: 1,
      p: 3, 
      width: { sm: `calc(100% - ${open ? DRAWER_WIDTH : 64}px)` }, // Updated to account for collapsed drawer
      mt: 8,
      height: 'calc(100vh - 64px)', // Adjust for AppBar height
      overflow: 'auto', // Only this element should scroll
      display: 'flex',
      flexDirection: 'column'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;