import  { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Button, Divider, 
  Grid, TextField, Alert, CircularProgress, Stack, 
  IconButton, Tooltip, useTheme, Tabs, Tab
} from '@mui/material';
import { 
  CloudUpload, Fingerprint, VerifiedUser, 
  ContentCopy, CheckCircle, InfoOutlined
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

/**
 * API Configuration
 * Modify these endpoints to match your backend API
 */

const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.http://89.116.122.39:8000';
// Remove trailing slash if present
const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

const API = {
  UPLOAD: apiUrl + '/documents/upload-test',
  VERIFY_FILE: apiUrl + '/verification/verify',
  VERIFY_HASH: apiUrl + '/documents/verify-hash'
};


/**
 * TabPanel component to handle tab content display
 */
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const DocumentVerification = () => {
  const theme = useTheme();
  const { token } = useAuth();
  const [tabValue, setTabValue] = useState(0); // State for controlling tabs
  
  // File upload states
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Verification states
  const [fileToVerify, setFileToVerify] = useState(null);
  const [hashToVerify, setHashToVerify] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  // Clipboard state
  const [copied, setCopied] = useState(false);
  
  /**
   * Tab change handler
   */
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset states when switching tabs
    setFile(null);
    setFileToVerify(null);
    setHashToVerify('');
    setResult(null);
    setVerificationResult(null);
  };
  
  /**
   * Document upload handler
   * Registers a document on the blockchain
   */
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // API call to upload document
      const response = await fetch(API.UPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to upload document');
      }
      
      setResult({
        success: true,
        message: "Document successfully registered on blockchain",
        data: data,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      setResult({
        success: false,
        message: error.message || 'An error occurred during upload',
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Document verification handler
   * Validates if a document exists on the blockchain
   */
  const handleVerification = async (e) => {
    e.preventDefault();
    if ((!fileToVerify && !hashToVerify) || (fileToVerify && hashToVerify)) {
      setVerificationResult({
        success: false,
        message: 'Please provide either a file OR a document hash, not both',
      });
      return;
    }
    
    setVerifying(true);
    setVerificationResult(null);
    
    try {
      if (fileToVerify) {
        // File-based verification
        const formData = new FormData();
        formData.append('file', fileToVerify);
        
        const response = await fetch(API.VERIFY_FILE, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || 'Failed to verify document');
        }
        
        setVerificationResult({
          success: true,
          message: data.verified 
            ? "Document verification successful! Document exists on blockchain." 
            : "Document verification failed. Document not found on blockchain.",
          data: data,
        });
      } else if (hashToVerify) {
        // Hash-based verification
        const response = await fetch(`${API.VERIFY_HASH}/${hashToVerify}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || 'Failed to verify document hash');
        }
        
        setVerificationResult({
          success: true,
          message: data.verified 
            ? "Hash verification successful! Document exists on blockchain." 
            : "Hash verification failed. Document not found on blockchain.",
          data: data,
        });
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      setVerificationResult({
        success: false,
        message: error.message || 'An error occurred during verification',
      });
    } finally {
      setVerifying(false);
    }
  };
  
  /**
   * Copy to clipboard utility
   */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Document Verification
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Register documents on the blockchain for immutable verification or verify existing documents
        </Typography>
      </Box>
      
      {/* Main Content Area with Tabs */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid',
          borderColor: 'background.subtle',
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        {/* Tab Navigation */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'background.subtle',
            '& .MuiTab-root': {
              py: 2
            }
          }}
        >
          <Tab 
            icon={<CloudUpload />} 
            label="Register Document" 
            iconPosition="start"
          />
          <Tab 
            icon={<VerifiedUser />} 
            label="Verify Document" 
            iconPosition="start"
          />
        </Tabs>
        
        {/* Register Document Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload a document to register it on the blockchain for secure, immutable storage and future verification.
            </Typography>
            
            <Divider sx={{ my: 2, borderColor: 'background.subtle' }} />
            
            {/* File Upload Form */}
            <Box component="form" onSubmit={handleFileUpload} sx={{ mt: 3 }}>
              {/* Dropzone Area */}
              <Box 
                sx={{ 
                  border: '2px dashed',
                  borderColor: 'background.subtle',
                  borderRadius: theme.shape.borderRadius,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'background.subtle',
                  cursor: 'pointer',
                  mb: 3,
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Click to upload a document
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Supported formats: PDF, DOC, DOCX, TXT
                </Typography>
                {file && (
                  <Alert severity="success" sx={{ mt: 2, textAlign: 'left' }}>
                    File selected: {file.name}
                  </Alert>
                )}
              </Box>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                disabled={!file || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Fingerprint />}
              >
                {loading ? 'Processing...' : 'Register on Blockchain'}
              </Button>
              
              {/* Results Display */}
              {result && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity={result.success ? "success" : "error"}>
                    {result.message}
                  </Alert>
                  
                  {result.success && result.data && (
                    <Paper sx={{ mt: 2, p: 2, bgcolor: 'background.subtle' }}>
                      <Stack spacing={1.5}>
                        {/* Document ID Display */}
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Document ID
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                              {result.data.document_id}
                            </Typography>
                            <Tooltip title="Copy ID">
                              <IconButton 
                                size="small" 
                                onClick={() => copyToClipboard(result.data.document_id)}
                              >
                                {copied ? <CheckCircle fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
                        {/* Blockchain Transaction Display */}
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Blockchain Transaction
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                              {result.data.ethereum_tx}
                            </Typography>
                            <Tooltip title="Copy Transaction">
                              <IconButton 
                                size="small" 
                                onClick={() => copyToClipboard(result.data.ethereum_tx)}
                              >
                                {copied ? <CheckCircle fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </TabPanel>
        
        {/* Verify Document Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Verify if a document or document hash exists on the blockchain to confirm authenticity.
            </Typography>
            
            <Divider sx={{ my: 2, borderColor: 'background.subtle' }} />
            
            {/* Verification Section */}
            <Box sx={{ mt: 3 }}>
              <Tooltip title="Either upload a file OR enter a document hash, not both">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Verification Method
                  </Typography>
                  <InfoOutlined fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Box>
              </Tooltip>
              
              {/* Verification Form */}
              <Box component="form" onSubmit={handleVerification}>
                {/* File Upload Option */}
                <Box 
                  sx={{ 
                    border: '2px dashed',
                    borderColor: 'background.subtle',
                    borderRadius: theme.shape.borderRadius,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'background.subtle',
                    cursor: 'pointer',
                    mb: 3,
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}
                  onClick={() => document.getElementById('file-verify').click()}
                >
                  <input
                    type="file"
                    id="file-verify"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      setFileToVerify(e.target.files[0]);
                      setHashToVerify(''); // Clear hash when file selected
                    }}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <VerifiedUser sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Upload a document to verify
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Or use document hash below
                  </Typography>
                  {fileToVerify && (
                    <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
                      File selected: {fileToVerify.name}
                    </Alert>
                  )}
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                  OR
                </Typography>
                
                {/* Hash Input Option */}
                <TextField
                  fullWidth
                  label="Document Hash"
                  variant="outlined"
                  value={hashToVerify}
                  onChange={(e) => {
                    setHashToVerify(e.target.value);
                    setFileToVerify(null); // Clear file when hash entered
                  }}
                  placeholder="Enter document hash to verify"
                  sx={{ mb: 3 }}
                />
                
                {/* Verify Button */}
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  disabled={(!fileToVerify && !hashToVerify) || verifying}
                  startIcon={verifying ? <CircularProgress size={20} /> : <Fingerprint />}
                >
                  {verifying ? 'Verifying...' : 'Verify Document'}
                </Button>
              </Box>
              
              {/* Verification Results */}
              {verificationResult && (
                <Box sx={{ mt: 3 }}>
                  <Alert 
                    severity={
                      verificationResult.success 
                        ? (verificationResult.data?.verified ? "success" : "warning") 
                        : "error"
                    }
                    icon={
                      verificationResult.success && verificationResult.data?.verified 
                        ? <CheckCircle /> 
                        : undefined
                    }
                  >
                    {verificationResult.message}
                  </Alert>
                  
                  {/* Display Additional Information if Verification Successful */}
                  {verificationResult.success && verificationResult.data?.verified && (
                    <Paper sx={{ mt: 2, p: 2, bgcolor: 'background.subtle' }}>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Document Hash
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                              {verificationResult.data.doc_hash || hashToVerify}
                            </Typography>
                            <Tooltip title="Copy Hash">
                              <IconButton 
                                size="small" 
                                onClick={() => copyToClipboard(verificationResult.data.hash || hashToVerify)}
                              >
                                {copied ? <CheckCircle fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
                        {/* Show Metadata if Available */}
                        {verificationResult.data.metadata && (
                          <>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Original Filename
                              </Typography>
                              <Typography variant="body2">
                                {verificationResult.data.metadata.file_name}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Registration Date
                              </Typography>
                              <Typography variant="body2">
                                {new Date(verificationResult.data.metadata.timestamp).toLocaleString()}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Stack>
                    </Paper>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default DocumentVerification;