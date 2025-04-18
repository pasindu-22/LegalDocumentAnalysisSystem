import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Button, 
  TextField, Divider, List, ListItem, 
  ListItemText, CircularProgress 
} from '@mui/material';
import { CloudUpload, Description } from '@mui/icons-material';

const DocumentAnalysis = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
      setResults(null);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    
    setAnalyzing(true);
    
    // Mock analysis - in a real app, this would call your backend API
    setTimeout(() => {
      setAnalyzing(false);
      setResults({
        title: file.name,
        type: "Contract",
        parties: ["ABC Corp.", "XYZ Inc."],
        key_clauses: [
          "Non-compete agreement (Section 5.2)",
          "Confidentiality clause (Section 7.1)",
          "Termination provisions (Section 12.4)"
        ],
        risk_factors: [
          "Ambiguous payment terms",
          "Missing force majeure clause",
          "Unclear liability limitations"
        ],
        compliance_score: 78
      });
    }, 2000);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Document Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload a legal document to analyze its content, extract key information, and identify potential issues.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upload Document
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              border: '2px dashed #ccc', 
              borderRadius: 2, 
              p: 3, 
              textAlign: 'center', 
              mb: 3 
            }}>
              <input
                accept=".pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  Choose File
                </Button>
              </label>
              
              {file && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Selected: {file.name}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <TextField
              fullWidth
              label="Additional Notes (Optional)"
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
            />
            
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ mt: 3 }}
              disabled={!file || analyzing}
              onClick={handleAnalyze}
              startIcon={analyzing ? <CircularProgress size={20} /> : <Description />}
            >
              {analyzing ? 'Analyzing...' : 'Analyze Document'}
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {analyzing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="body1">Analyzing document content...</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This may take a moment
                </Typography>
              </Box>
            ) : results ? (
              <Box>
                <Typography variant="h6">{results.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Document Type: {results.type}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Parties Involved:</Typography>
                    <List dense>
                      {results.parties.map((party, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemText primary={party} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Compliance Score:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        position: 'relative',
                        display: 'inline-flex',
                        mr: 2
                      }}>
                        <CircularProgress 
                          variant="determinate" 
                          value={results.compliance_score} 
                          color={results.compliance_score > 70 ? "success" : "warning"}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            component="div"
                            color="text.secondary"
                          >{`${Math.round(results.compliance_score)}%`}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        {results.compliance_score > 70 
                          ? "Good compliance score" 
                          : "Needs improvement"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle2" sx={{ mt: 3 }} gutterBottom>
                  Key Clauses:
                </Typography>
                <List dense>
                  {results.key_clauses.map((clause, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemText primary={clause} />
                    </ListItem>
                  ))}
                </List>
                
                <Typography variant="subtitle2" sx={{ mt: 3, color: 'error.main' }} gutterBottom>
                  Potential Risk Factors:
                </Typography>
                <List dense>
                  {results.risk_factors.map((risk, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemText primary={risk} />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button variant="outlined" sx={{ mr: 1 }}>
                    Export Report
                  </Button>
                  <Button variant="contained">
                    Full Analysis
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                color: 'text.secondary'
              }}>
                <Description sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                <Typography>
                  Upload and analyze a document to see results
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentAnalysis;