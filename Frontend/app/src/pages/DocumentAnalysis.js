import React, { useState } from "react";

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
  backgroundColor: "#1a1a1a", // deep charcoal gray
  color: "#e5e7eb",           // light gray text
  fontFamily: "'Segoe UI', 'Roboto', sans-serif",
  minHeight: "100vh",
  padding: "20px",
},
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    headerTitle: {
      fontSize: "2.2rem",
      color: "#4a90e2",
      margin: "0 0 10px 0",
    },
    headerSubtitle: {
      fontSize: "1.1rem",
      color: "#95a5a6",
      margin: 0,
    },
   main: {
  backgroundColor: "#1f1f1f",        // dark base
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
  border: "1px solid #2a2a2a",
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
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      minHeight: "400px",
      borderRadius: "16px",
      padding: "40px",
    },
    fileInputWrapper: {
      width: "100%",
      maxWidth: "500px",
    },
    fileInput: {
      display: "none",
    },
    fileInputLabel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px",
      backgroundColor: "rgba(0, 0, 0)",
      backdropFilter: "blur(10px)",
      color: "#d0d4d8",
      border: "2px dashed #7f8c8d",
      borderRadius: "10px",
      fontSize: "1.1rem",
      fontWeight: 500,
      transition: "all 0.3s ease",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      cursor: "pointer",
    },
    fileInputLabelHover: {
      borderColor: "#3498db",
      backgroundColor: "#2c3e50",
    },
    textInputContainer: {
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    textInput: {
      width: "100%",
      padding: "15px",
      borderRadius: "5px",
      fontSize: "1rem",
      fontFamily: "inherit",
      resize: "vertical",
      backgroundColor: "#121212",
  color: "#e5e7eb",
  border: "1px solid #2f2f2f",
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
      backgroundColor: "#0c1b2a",
      padding: "30px",
      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.4)",
      color: "#e3e9f0",
      fontSize: "1rem",
      marginTop: "40px",
      lineHeight: "1.6",
      border: "1px solid #1c2e44",
    },
    resultSection: {
      marginBottom: "25px",
    },
    resultSectionTitle: {
      color: "#ffffff",
      fontSize: "1.5rem",
      marginBottom: "20px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      paddingBottom: "10px",
    },
    resultSectionMainTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#ffffff",
      textAlign: "center",
      marginBottom: "30px",
      letterSpacing: "0.5px",
      borderBottom: "2px solid rgba(255, 255, 255, 0.15)",
      paddingBottom: "12px",
      textTransform: "uppercase",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    },
    uploadPreview: {
      display: "flex",
      alignItems: "center",
      marginTop: "20px",
      gap: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      padding: "12px 16px",
      border: "2px solid rgba(0, 0, 0,0.1)",
      color: "#e0e3e7",
    },

    uploadIcon: {
      width: "40px",
      height: "40px",
    },

    uploadFileName: {
      fontSize: "0.95rem",
      color: "#a0a7ad",
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
        <h2 style={styles.resultSectionMainTitle}>Analysis Results</h2>

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
              <p>{parsedSummary.summary}</p>

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
              {!file ? (
                <>
                  <div style={styles.fileInputWrapper}>
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      accept=".txt,.pdf,.docx"
                      style={styles.fileInput}
                    />
                    <label htmlFor="file-upload" style={styles.fileInputLabel}>
                      <img
                        src="https://media.lordicon.com/icons/wired/gradient/2-cloud-upload.svg"
                        alt="Upload Icon"
                        style={{
                          width: "60px",
                          height: "60px",
                          marginBottom: "10px",
                        }}
                      />
                      <div>
                        <strong>Click here to upload a file</strong>
                      </div>
                    </label>
                    <p
                      style={{
                        color: "#a0a7ad",
                        fontSize: "0.9rem",
                        marginTop: "12px",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      We support .TXT, .DOCX, and text-based PDFs.
                    </p>
                  </div>
                </>
              ) : (
                <div style={styles.uploadPreview}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/510/510657.png"
                    alt="Uploaded file icon"
                    style={styles.uploadIcon}
                  />
                  <span style={styles.uploadFileName}>{file.name}</span>
                </div>
              )}

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
