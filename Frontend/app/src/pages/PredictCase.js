import { useAuth } from '../context/AuthContext';
import {
  Container, Typography, Box, Paper, Button, Divider,
   Alert, CircularProgress, Stack, Card, CardContent
} from '@mui/material';
import { useState } from 'react';

const PredictCase = () => {
//   const theme = useTheme();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
  const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const predictUrl = apiUrl + '/documents/predict-case';

  const handlePrediction = async () => {
    try {
      setLoading(true);
      const response = await fetch(predictUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
        const result = await response.json();
        if (result.error) { 
            setData({ error: "Internal server error. Please try again." });
            console.log("Error:", result.error);
            return;
        }
      setData(result);
    } catch (error) {
      console.error('Error during prediction:', error);
      setData({ error: "Internal server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  

return (
    <Container maxWidth="md">
        <Box mt={5}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Predict Legal Case Outcome
                </Typography>

                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Predict the result of your latest document
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrediction}
                    disabled={loading}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Predict'}
                </Button>

                {data && (
                    <Box mt={4}>
                        {data.error ? (
                            <Alert severity="error">{data.error}</Alert>
                        ) : (
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Prediction:{" "}
                                        <strong style={{ color: data.prediction ? 'green' : 'red' }}>
                                            {data.prediction === 1 ? 'Positive' : 'Negative'}
                                        </strong>
                                    </Typography>

                                    <Typography variant="subtitle1" gutterBottom>
                                        Confidence:{" "}
                                        {Array.isArray(data.probability)
                                            ? (Math.max(...data.probability) * 100).toFixed(2) + "%"
                                            : "N/A"}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle2" gutterBottom>
                                        Case Details:
                                    </Typography>

                                    <Stack spacing={1}>
                                        {data.features ? (
                                            <>
                                                <Typography><strong>First Party:</strong> {data.features.first_party}</Typography>
                                                <Typography><strong>Second Party:</strong> {data.features.second_party}</Typography>
                                                <Typography><strong>Decision Type:</strong> {data.features.decision_type}</Typography>
                                                <Typography><strong>Disposition:</strong> {data.features.disposition}</Typography>
                                            </>
                                        ) : (
                                            <Typography color="text.secondary">No case details available.</Typography>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    </Container>
);
};

export default PredictCase;
