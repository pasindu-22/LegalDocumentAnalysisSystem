// import React, { useState } from 'react';
// import {
//   Box, Typography, Paper, Grid, Button,
//   TextField, Divider, List, ListItem,
//   ListItemText, CircularProgress
// } from '@mui/material';
// import { CloudUpload, Description } from '@mui/icons-material';

// const DocumentAnalysis = () => {
//   const [file, setFile] = useState(null);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [results, setResults] = useState(null);

//   const handleFileChange = (event) => {
//     if (event.target.files[0]) {
//       setFile(event.target.files[0]);
//       setResults(null);
//     }
//   };

//   const handleAnalyze = () => {
//     if (!file) return;

//     setAnalyzing(true);

//     // Mock analysis - in a real app, this would call your backend API
//     setTimeout(() => {
//       setAnalyzing(false);
//       setResults({
//         title: file.name,
//         type: "Contract",
//         parties: ["ABC Corp.", "XYZ Inc."],
//         key_clauses: [
//           "Non-compete agreement (Section 5.2)",
//           "Confidentiality clause (Section 7.1)",
//           "Termination provisions (Section 12.4)"
//         ],
//         risk_factors: [
//           "Ambiguous payment terms",
//           "Missing force majeure clause",
//           "Unclear liability limitations"
//         ],
//         compliance_score: 78
//       });
//     }, 2000);
//   };

//   return (
//     <Box>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Document Analysis
//       </Typography>
//       <Typography variant="body1" color="text.secondary" paragraph>
//         Upload a legal document to analyze its content, extract key information, and identify potential issues.
//       </Typography>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={5}>
//           <Paper sx={{ p: 3, height: '100%' }}>
//             <Typography variant="h6" gutterBottom>
//               Upload Document
//             </Typography>
//             <Divider sx={{ my: 2 }} />

//             <Box sx={{
//               border: '2px dashed #ccc',
//               borderRadius: 2,
//               p: 3,
//               textAlign: 'center',
//               mb: 3
//             }}>
//               <input
//                 accept=".pdf,.doc,.docx,.txt"
//                 style={{ display: 'none' }}
//                 id="file-upload"
//                 type="file"
//                 onChange={handleFileChange}
//               />
//               <label htmlFor="file-upload">
//                 <Button
//                   variant="contained"
//                   component="span"
//                   startIcon={<CloudUpload />}
//                 >
//                   Choose File
//                 </Button>
//               </label>

//               {file && (
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="body2">
//                     Selected: {file.name}
//                   </Typography>
//                 </Box>
//               )}
//             </Box>

//             <TextField
//               fullWidth
//               label="Additional Notes (Optional)"
//               multiline
//               rows={4}
//               variant="outlined"
//               margin="normal"
//             />

//             <Button
//               variant="contained"
//               fullWidth
//               sx={{ mt: 3 }}
//               disabled={!file || analyzing}
//               onClick={handleAnalyze}
//               startIcon={analyzing ? <CircularProgress size={20} /> : <Description />}
//             >
//               {analyzing ? 'Analyzing...' : 'Analyze Document'}
//             </Button>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={7}>
//           <Paper sx={{ p: 3, height: '100%' }}>
//             <Typography variant="h6" gutterBottom>
//               Analysis Results
//             </Typography>
//             <Divider sx={{ my: 2 }} />

//             {analyzing ? (
//               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
//                 <CircularProgress size={60} sx={{ mb: 3 }} />
//                 <Typography variant="body1">Analyzing document content...</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                   This may take a moment
//                 </Typography>
//               </Box>
//             ) : results ? (
//               <Box>
//                 <Typography variant="h6">{results.title}</Typography>
//                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                   Document Type: {results.type}
//                 </Typography>

//                 <Grid container spacing={2} sx={{ mt: 2 }}>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" gutterBottom>Parties Involved:</Typography>
//                     <List dense>
//                       {results.parties.map((party, index) => (
//                         <ListItem key={index} disableGutters>
//                           <ListItemText primary={party} />
//                         </ListItem>
//                       ))}
//                     </List>
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" gutterBottom>Compliance Score:</Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Box sx={{
//                         position: 'relative',
//                         display: 'inline-flex',
//                         mr: 2
//                       }}>
//                         <CircularProgress
//                           variant="determinate"
//                           value={results.compliance_score}
//                           color={results.compliance_score > 70 ? "success" : "warning"}
//                         />
//                         <Box
//                           sx={{
//                             top: 0,
//                             left: 0,
//                             bottom: 0,
//                             right: 0,
//                             position: 'absolute',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                           }}
//                         >
//                           <Typography
//                             variant="caption"
//                             component="div"
//                             color="text.secondary"
//                           >{`${Math.round(results.compliance_score)}%`}</Typography>
//                         </Box>
//                       </Box>
//                       <Typography variant="body2">
//                         {results.compliance_score > 70
//                           ? "Good compliance score"
//                           : "Needs improvement"}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 </Grid>

//                 <Typography variant="subtitle2" sx={{ mt: 3 }} gutterBottom>
//                   Key Clauses:
//                 </Typography>
//                 <List dense>
//                   {results.key_clauses.map((clause, index) => (
//                     <ListItem key={index} disableGutters>
//                       <ListItemText primary={clause} />
//                     </ListItem>
//                   ))}
//                 </List>

//                 <Typography variant="subtitle2" sx={{ mt: 3, color: 'error.main' }} gutterBottom>
//                   Potential Risk Factors:
//                 </Typography>
//                 <List dense>
//                   {results.risk_factors.map((risk, index) => (
//                     <ListItem key={index} disableGutters>
//                       <ListItemText primary={risk} />
//                     </ListItem>
//                   ))}
//                 </List>

//                 <Box sx={{ mt: 3, textAlign: 'right' }}>
//                   <Button variant="outlined" sx={{ mr: 1 }}>
//                     Export Report
//                   </Button>
//                   <Button variant="contained">
//                     Full Analysis
//                   </Button>
//                 </Box>
//               </Box>
//             ) : (
//               <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: 300,
//                 color: 'text.secondary'
//               }}>
//                 <Description sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
//                 <Typography>
//                   Upload and analyze a document to see results
//                 </Typography>
//               </Box>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default DocumentAnalysis;

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   Button,
//   TextField,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   CircularProgress,
// } from "@mui/material";
// import { CloudUpload, Description } from "@mui/icons-material";

// const DocumentAnalysis = () => {
//   const [file, setFile] = useState(null);
//   const [text, setText] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("upload");

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       // Check file extension
//       const extension = selectedFile.name.split(".").pop().toLowerCase();
//       if (["txt", "pdf", "docx"].includes(extension)) {
//         setFile(selectedFile);
//         setError("");
//       } else {
//         setFile(null);
//         setError("Please upload a .txt, .pdf, or .docx file.");
//       }
//     }
//   };

//   const handleTextChange = (e) => {
//     setText(e.target.value);
//   };

//   const analyzeFile = async () => {
//     if (!file) {
//       setError("Please select a file first.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setResult(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:8000/analyze/file/", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       setResult(data);
//     } catch (err) {
//       setError(`Failed to analyze file: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const analyzeText = async () => {
//     if (!text.trim()) {
//       setError("Please enter some text first.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setResult(null);

//     const formData = new FormData();
//     formData.append("text", text);

//     try {
//       const response = await fetch("http://localhost:8000/analyze/text/", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       setResult(data);
//     } catch (err) {
//       setError(`Failed to analyze text: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setResult(null);
//     setError("");
//   };

//   const renderResults = () => {
//     if (!result) return null;

//     const analysis = result.analysis;
//     const llamaSummary = result.llama_summary;

//     // Parse the llama summary if it's a string containing JSON
//     let parsedSummary = llamaSummary;
//     if (llamaSummary && typeof llamaSummary.summary === "string") {
//       try {
//         // Handle JSON wrapped in backticks like: ``` { "json": "here" } ```
//         let summaryText = llamaSummary.summary;

//         // Remove backticks if present
//         if (summaryText.includes("```")) {
//           summaryText = summaryText
//             .replace(/```\s*(?:\w+\s*)?/, "")
//             .replace(/\s*```\s*$/, "");
//         }

//         // Clean up and try to parse if it looks like JSON
//         summaryText = summaryText.trim();
//         if (summaryText.startsWith("{") && summaryText.endsWith("}")) {
//           const summaryData = JSON.parse(summaryText);
//           // Replace the summary object with the parsed data
//           parsedSummary = {
//             ...llamaSummary,
//             ...summaryData,
//           };
//         }
//       } catch (e) {
//         console.error("Failed to parse summary JSON:", e, llamaSummary.summary);
//       }
//     }

//     return (
//       <div className="results-container">
//         <h2>Analysis Results</h2>

//         <div className="result-section">
//           <h3>Document Statistics</h3>
//           <p>Text Length: {analysis.text_length} characters</p>
//           <p>Sentence Count: {analysis.sentence_count}</p>
//         </div>

//         <div className="result-section">
//           <h3>Legal Terms Found</h3>
//           {analysis.legal_terms_found &&
//           analysis.legal_terms_found.length > 0 ? (
//             <ul>
//               {analysis.legal_terms_found.map((term, index) => (
//                 <li key={index}>{term}</li>
//               ))}
//             </ul>
//           ) : (
//             <p>No specific legal terms identified.</p>
//           )}
//         </div>

//         <div className="result-section">
//           <h3>Entities Detected</h3>
//           {analysis.entities && analysis.entities.length > 0 ? (
//             <ul>
//               {analysis.entities.slice(0, 15).map((entity, index) => (
//                 <li key={index}>
//                   <strong>{entity.text}</strong> ({entity.type})
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No entities detected.</p>
//           )}
//         </div>

//         <div className="result-section">
//           <h3>Key Phrases</h3>
//           {analysis.key_phrases && analysis.key_phrases.length > 0 ? (
//             <ul>
//               {analysis.key_phrases.map((phrase, index) => (
//                 <li key={index}>{phrase}</li>
//               ))}
//             </ul>
//           ) : (
//             <p>No key phrases identified.</p>
//           )}
//         </div>

//         <div className="result-section">
//           <h3>Summary</h3>
//           {parsedSummary ? (
//             <div>
//               <p>
//                 <strong>Summary:</strong> {parsedSummary.summary}
//               </p>

//               <div>
//                 <h4>Key Clauses:</h4>
//                 {Array.isArray(parsedSummary.key_clauses) &&
//                 parsedSummary.key_clauses.length > 0 ? (
//                   <ul>
//                     {parsedSummary.key_clauses.map((clause, index) => (
//                       <li key={index}>{clause}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No key clauses identified.</p>
//                 )}
//               </div>

//               <div>
//                 <h4>Potential Issues:</h4>
//                 {Array.isArray(parsedSummary.potential_issues) &&
//                 parsedSummary.potential_issues.length > 0 ? (
//                   <ul>
//                     {parsedSummary.potential_issues.map((issue, index) => (
//                       <li key={index}>{issue}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No potential issues identified.</p>
//                 )}
//               </div>

//               <div>
//                 <h4>Parties and Obligations:</h4>
//                 {Array.isArray(parsedSummary.parties_and_obligations) &&
//                 parsedSummary.parties_and_obligations.length > 0 ? (
//                   <ul className="parties-list">
//                     {parsedSummary.parties_and_obligations.map(
//                       (party, index) => (
//                         <li key={index} className="party-item">
//                           <strong>{party.party}</strong>
//                           {party.obligations &&
//                             party.obligations.length > 0 && (
//                               <div className="obligations">
//                                 <h5>Obligations:</h5>
//                                 <ul>
//                                   {party.obligations.map((obligation, idx) => (
//                                     <li key={idx}>{obligation}</li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             )}
//                           {party.rights && party.rights.length > 0 && (
//                             <div className="rights">
//                               <h5>Rights:</h5>
//                               <ul>
//                                 {party.rights.map((right, idx) => (
//                                   <li key={idx}>{right}</li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                         </li>
//                       )
//                     )}
//                   </ul>
//                 ) : (
//                   <p>No parties or obligations identified.</p>
//                 )}
//               </div>

//               <p>
//                 <strong>Processing Time:</strong>{" "}
//                 {parsedSummary.processing_time || "N/A"}
//               </p>
//             </div>
//           ) : (
//             <p>No summary available.</p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Legal Document Analyzer</h1>
//         <p>Upload a document or paste text for legal analysis</p>
//       </header>

//       <main>
//         <div className="tab-container">
//           <div
//             className={`tab ${activeTab === "upload" ? "active" : ""}`}
//             onClick={() => handleTabChange("upload")}
//           >
//             Upload File
//           </div>
//           <div
//             className={`tab ${activeTab === "paste" ? "active" : ""}`}
//             onClick={() => handleTabChange("paste")}
//           >
//             Paste Text
//           </div>
//         </div>

//         <div className="content-container">
//           {activeTab === "upload" ? (
//             <div className="file-upload-container">
//               <div className="file-input-wrapper">
//                 <input
//                   type="file"
//                   id="file-upload"
//                   onChange={handleFileChange}
//                   accept=".txt,.pdf,.docx"
//                 />
//                 <label htmlFor="file-upload" className="file-input-label">
//                   {file ? file.name : "Choose a file (.txt, .pdf, .docx)"}
//                 </label>
//               </div>
//               <button
//                 onClick={analyzeFile}
//                 disabled={!file || loading}
//                 className="analyze-button"
//               >
//                 {loading ? "Analyzing..." : "Analyze Document"}
//               </button>
//             </div>
//           ) : (
//             <div className="text-input-container">
//               <textarea
//                 value={text}
//                 onChange={handleTextChange}
//                 placeholder="Paste your legal text here..."
//                 className="text-input"
//                 rows={10}
//               />
//               <button
//                 onClick={analyzeText}
//                 disabled={!text.trim() || loading}
//                 className="analyze-button"
//               >
//                 {loading ? "Analyzing..." : "Analyze Text"}
//               </button>
//             </div>
//           )}

//           {error && <div className="error-message">{error}</div>}

//           {loading && (
//             <div className="loading">Processing your document...</div>
//           )}

//           {renderResults()}
//         </div>
//       </main>

//       <footer>
//         <p>Legal Document Analysis System </p>
//       </footer>
//     </div>
//   );
// };

// export default DocumentAnalysis;

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, Description } from "@mui/icons-material";

const DocumentAnalysis = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upload");

  // CSS Styles
  const styles = {
    app: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      color: "#333",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    headerTitle: {
      fontSize: "2.2rem",
      color: "#2c3e50",
      margin: "0 0 10px 0",
    },
    headerSubtitle: {
      fontSize: "1.1rem",
      color: "#7f8c8d",
      margin: 0,
    },
    main: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    tabContainer: {
      display: "flex",
      borderBottom: "1px solid #e0e0e0",
    },
    tab: {
      padding: "15px 25px",
      cursor: "pointer",
      fontWeight: 500,
      transition: "all 0.3s ease",
    },
    activeTab: {
      backgroundColor: "#f8f9fa",
      borderBottom: "3px solid #3f51b5",
      color: "#3f51b5",
    },
    contentContainer: {
      padding: "30px",
    },
    fileUploadContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      padding: "20px",
    },
    fileInputWrapper: {
      width: "100%",
      maxWidth: "500px",
    },
    fileInput: {
      display: "none",
    },
    fileInputLabel: {
      display: "block",
      width: "100%",
      padding: "15px",
      backgroundColor: "#f0f0f0",
      border: "1px dashed #ccc",
      borderRadius: "5px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      color: "#666",
      fontSize: "1rem",
    },
    fileInputLabelHover: {
      backgroundColor: "#e0e0e0",
      borderColor: "#aaa",
    },
    textInputContainer: {
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
    },
    textInput: {
      width: "100%",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      fontSize: "1rem",
      fontFamily: "inherit",
      resize: "vertical",
    },
    analyzeButton: {
      backgroundColor: "#3f51b5",
      color: "white",
      padding: "12px 25px",
      borderRadius: "5px",
      border: "none",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginTop: "20px",
      width: "200px",
    },
    analyzeButtonHover: {
      backgroundColor: "#303f9f",
    },
    analyzeButtonDisabled: {
      backgroundColor: "#bdbdbd",
      cursor: "not-allowed",
    },
    errorMessage: {
      backgroundColor: "#ffebee",
      color: "#c62828",
      padding: "10px 15px",
      borderRadius: "5px",
      marginTop: "20px",
      fontSize: "0.9rem",
    },
    loading: {
      textAlign: "center",
      padding: "30px",
      color: "#666",
      fontSize: "1.1rem",
    },
    resultsContainer: {
      marginTop: "40px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      padding: "25px",
      boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
    },
    resultSection: {
      marginBottom: "25px",
    },
    resultSectionTitle: {
      color: "#2c3e50",
      fontSize: "1.3rem",
      marginBottom: "15px",
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: "8px",
    },
    list: {
      paddingLeft: "20px",
      marginTop: "10px",
    },
    listItem: {
      marginBottom: "5px",
    },
    partiesList: {
      listStyleType: "none",
      padding: 0,
    },
    partyItem: {
      backgroundColor: "#f5f5f5",
      padding: "15px",
      borderRadius: "5px",
      marginBottom: "15px",
    },
    obligations: {
      marginTop: "10px",
    },
    rights: {
      marginTop: "10px",
    },
    footer: {
      textAlign: "center",
      padding: "20px",
      marginTop: "40px",
      color: "#7f8c8d",
      fontSize: "0.9rem",
      borderTop: "1px solid #ecf0f1",
    },
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file extension
      const extension = selectedFile.name.split(".").pop().toLowerCase();
      if (["txt", "pdf", "docx"].includes(extension)) {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please upload a .txt, .pdf, or .docx file.");
      }
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const analyzeFile = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/analyze/file/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Failed to analyze file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("text", text);

    try {
      const response = await fetch("http://localhost:8000/analyze/text/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Failed to analyze text: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult(null);
    setError("");
  };

  const renderResults = () => {
    if (!result) return null;

    const analysis = result.analysis;
    const llamaSummary = result.llama_summary;

    // Parse the llama summary if it's a string containing JSON
    let parsedSummary = llamaSummary;
    if (llamaSummary && typeof llamaSummary.summary === "string") {
      try {
        // Handle JSON wrapped in backticks like: ``` { "json": "here" } ```
        let summaryText = llamaSummary.summary;

        // Remove backticks if present
        if (summaryText.includes("```")) {
          summaryText = summaryText
            .replace(/```\s*(?:\w+\s*)?/, "")
            .replace(/\s*```\s*$/, "");
        }

        // Clean up and try to parse if it looks like JSON
        summaryText = summaryText.trim();
        if (summaryText.startsWith("{") && summaryText.endsWith("}")) {
          const summaryData = JSON.parse(summaryText);

          parsedSummary = {
            ...llamaSummary,
            ...summaryData,
          };
        }
      } catch (e) {
        console.error("Failed to parse summary JSON:", e, llamaSummary.summary);
      }
    }

    return (
      <div style={styles.resultsContainer}>
        <h2 style={styles.resultSectionTitle}>Analysis Results</h2>

        <div style={styles.resultSection}>
          <h3 style={styles.resultSectionTitle}>Document Statistics</h3>
          <p>Text Length: {analysis.text_length} characters</p>
          <p>Sentence Count: {analysis.sentence_count}</p>
        </div>

        <div style={styles.resultSection}>
          <h3 style={styles.resultSectionTitle}>Legal Terms Found</h3>
          {analysis.legal_terms_found &&
          analysis.legal_terms_found.length > 0 ? (
            <ul style={styles.list}>
              {analysis.legal_terms_found.map((term, index) => (
                <li key={index} style={styles.listItem}>
                  {term}
                </li>
              ))}
            </ul>
          ) : (
            <p>No specific legal terms identified.</p>
          )}
        </div>

        <div style={styles.resultSection}>
          <h3 style={styles.resultSectionTitle}>Entities Detected</h3>
          {analysis.entities && analysis.entities.length > 0 ? (
            <ul style={styles.list}>
              {analysis.entities.slice(0, 15).map((entity, index) => (
                <li key={index} style={styles.listItem}>
                  <strong>{entity.text}</strong> ({entity.type})
                </li>
              ))}
            </ul>
          ) : (
            <p>No entities detected.</p>
          )}
        </div>

        <div style={styles.resultSection}>
          <h3 style={styles.resultSectionTitle}>Key Phrases</h3>
          {analysis.key_phrases && analysis.key_phrases.length > 0 ? (
            <ul style={styles.list}>
              {analysis.key_phrases.map((phrase, index) => (
                <li key={index} style={styles.listItem}>
                  {phrase}
                </li>
              ))}
            </ul>
          ) : (
            <p>No key phrases identified.</p>
          )}
        </div>

        <div style={styles.resultSection}>
          <h3 style={styles.resultSectionTitle}>Summary</h3>
          {parsedSummary ? (
            <div>
              <p>
                <strong>Summary:</strong> {parsedSummary.summary}
              </p>

              <div style={{ marginTop: "20px" }}>
                <h4 style={{ fontSize: "1.1rem", color: "#34495e" }}>
                  Key Clauses:
                </h4>
                {Array.isArray(parsedSummary.key_clauses) &&
                parsedSummary.key_clauses.length > 0 ? (
                  <ul style={styles.list}>
                    {parsedSummary.key_clauses.map((clause, index) => (
                      <li key={index} style={styles.listItem}>
                        {clause}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No key clauses identified.</p>
                )}
              </div>

              <div style={{ marginTop: "20px" }}>
                <h4 style={{ fontSize: "1.1rem", color: "#34495e" }}>
                  Potential Issues:
                </h4>
                {Array.isArray(parsedSummary.potential_issues) &&
                parsedSummary.potential_issues.length > 0 ? (
                  <ul style={styles.list}>
                    {parsedSummary.potential_issues.map((issue, index) => (
                      <li key={index} style={styles.listItem}>
                        {issue}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No potential issues identified.</p>
                )}
              </div>

              <div style={{ marginTop: "20px" }}>
                <h4 style={{ fontSize: "1.1rem", color: "#34495e" }}>
                  Parties and Obligations:
                </h4>
                {Array.isArray(parsedSummary.parties_and_obligations) &&
                parsedSummary.parties_and_obligations.length > 0 ? (
                  <ul style={styles.partiesList}>
                    {parsedSummary.parties_and_obligations.map(
                      (party, index) => (
                        <li key={index} style={styles.partyItem}>
                          <strong>{party.party}</strong>
                          {party.obligations &&
                            party.obligations.length > 0 && (
                              <div style={styles.obligations}>
                                <h5
                                  style={{
                                    fontSize: "1rem",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Obligations:
                                </h5>
                                <ul style={styles.list}>
                                  {party.obligations.map((obligation, idx) => (
                                    <li key={idx} style={styles.listItem}>
                                      {obligation}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {party.rights && party.rights.length > 0 && (
                            <div style={styles.rights}>
                              <h5
                                style={{
                                  fontSize: "1rem",
                                  marginBottom: "5px",
                                }}
                              >
                                Rights:
                              </h5>
                              <ul style={styles.list}>
                                {party.rights.map((right, idx) => (
                                  <li key={idx} style={styles.listItem}>
                                    {right}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>No parties or obligations identified.</p>
                )}
              </div>

              <p style={{ marginTop: "20px" }}>
                <strong>Processing Time:</strong>{" "}
                {parsedSummary.processing_time || "N/A"}
              </p>
            </div>
          ) : (
            <p>No summary available.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Legal Document Analyzer</h1>
        <p style={styles.headerSubtitle}>
          Upload a document or paste text for legal analysis
        </p>
      </header>

      <main style={styles.main}>
        <div style={styles.tabContainer}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "upload" ? styles.activeTab : {}),
            }}
            onClick={() => handleTabChange("upload")}
          >
            Upload File
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "paste" ? styles.activeTab : {}),
            }}
            onClick={() => handleTabChange("paste")}
          >
            Paste Text
          </div>
        </div>

        <div style={styles.contentContainer}>
          {activeTab === "upload" ? (
            <div style={styles.fileUploadContainer}>
              <div style={styles.fileInputWrapper}>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.docx"
                  style={styles.fileInput}
                />
                <label
                  htmlFor="file-upload"
                  style={styles.fileInputLabel}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#e0e0e0";
                    e.target.style.borderColor = "#aaa";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#f0f0f0";
                    e.target.style.borderColor = "#ccc";
                  }}
                >
                  {file ? file.name : "Choose a file (.txt, .pdf, .docx)"}
                </label>
              </div>
              <button
                onClick={analyzeFile}
                disabled={!file || loading}
                style={{
                  ...styles.analyzeButton,
                  ...(!file || loading ? styles.analyzeButtonDisabled : {}),
                }}
                onMouseOver={(e) => {
                  if (file && !loading) {
                    e.target.style.backgroundColor = "#303f9f";
                  }
                }}
                onMouseOut={(e) => {
                  if (file && !loading) {
                    e.target.style.backgroundColor = "#3f51b5";
                  }
                }}
              >
                {loading ? "Analyzing..." : "Analyze Document"}
              </button>
            </div>
          ) : (
            <div style={styles.textInputContainer}>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Paste your legal text here..."
                style={styles.textInput}
                rows={10}
              />
              <button
                onClick={analyzeText}
                disabled={!text.trim() || loading}
                style={{
                  ...styles.analyzeButton,
                  ...(!text.trim() || loading
                    ? styles.analyzeButtonDisabled
                    : {}),
                  margin: "20px auto",
                  display: "block",
                }}
                onMouseOver={(e) => {
                  if (text.trim() && !loading) {
                    e.target.style.backgroundColor = "#303f9f";
                  }
                }}
                onMouseOut={(e) => {
                  if (text.trim() && !loading) {
                    e.target.style.backgroundColor = "#3f51b5";
                  }
                }}
              >
                {loading ? "Analyzing..." : "Analyze Text"}
              </button>
            </div>
          )}

          {error && <div style={styles.errorMessage}>{error}</div>}

          {loading && (
            <div style={styles.loading}>Processing your document...</div>
          )}

          {renderResults()}
        </div>
      </main>

      <footer style={styles.footer}>
        <p>Legal Document Analysis System </p>
      </footer>
    </div>
  );
};

export default DocumentAnalysis;
