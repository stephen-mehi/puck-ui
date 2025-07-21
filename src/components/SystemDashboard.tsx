import { Button, Container, Typography, Grid, Card, CardContent, Snackbar, Alert, Box, CircularProgress, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import customTheme from './Theme';
import { ThemeProvider } from '@mui/material/styles';

// API base URL (move to .env or config in real projects)
const API_BASE_URL = 'http://192.168.1.12:30671';

interface SystemState {
    thermoBlockTemperature: number | null;
    groupHeadTemperature: number | null;
    thermoBlockTemperatureSetPoint: number | null;
    groupHeadTemperatureSetPoint: number | null;
    pressure: number | null;
    pumpSpeed: number | null;
    runState: string;
    recirculationValveState: string;
    groupHeadValveState: string;
    backFlushValveState: string;
}

const initialSystemState: SystemState = {
    thermoBlockTemperature: null,
    groupHeadTemperature: null,
    thermoBlockTemperatureSetPoint: null,
    groupHeadTemperatureSetPoint: null,
    pressure: null,
    pumpSpeed: null,
    runState: 'None',
    recirculationValveState: 'None',
    groupHeadValveState: 'None',
    backFlushValveState: 'None',
};

function SystemStateCard({ data }: { data: SystemState }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="body1" gutterBottom>
                    ThermoBlock: {data.thermoBlockTemperature ?? 'N/A'} °C
                </Typography>
                <Typography variant="body1" gutterBottom>
                    GroupHead: {data.groupHeadTemperature ?? 'N/A'} °C
                </Typography>
                <Typography variant="body1" gutterBottom>
                    ThermoBlock Set Point: {data.thermoBlockTemperatureSetPoint ?? 'N/A'} °C
                </Typography>
                <Typography variant="body1" gutterBottom>
                    GroupHead Set Point: {data.groupHeadTemperatureSetPoint ?? 'N/A'} °C
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Pump Speed: {data.pumpSpeed ?? 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Pressure: {data.pressure ?? 'N/A'} bar
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Run State: {data.runState ?? 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Recirculation Valve: {data.recirculationValveState ?? 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    GroupHead Valve: {data.groupHeadValveState ?? 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    BackFlush Valve: {data.backFlushValveState ?? 'N/A'}
                </Typography>
            </CardContent>
        </Card>
    );
}

function SystemDashboard() {
    const [data, setData] = useState<SystemState>(initialSystemState);
    const [loading, setLoading] = useState(true); // Only for initial load or actions
    const [refreshing, setRefreshing] = useState(false); // For background polling
    const [error, setError] = useState("");
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const [actionInProgress, setActionInProgress] = useState(false);

    useEffect(() => {
        fetchData(true); // Initial load
        const interval = setInterval(() => {
            fetchData(false); // Background refresh
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setRefreshing(true);
            const response = await fetch(`${API_BASE_URL}/System/state`);
            if (!response.ok) throw new Error('Failed to fetch system state');
            const data = await response.json();
            setData(data);
            setError(""); // Clear error on success
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error instanceof Error) {
                setError(error.message);
                setSnackbar({ open: true, message: error.message, severity: 'error' });
            } else {
                setError('Error fetching data, unknown error type');
                setSnackbar({ open: true, message: 'Error fetching data, unknown error type', severity: 'error' });
            }
        } finally {
            if (isInitial) setLoading(false);
            else setRefreshing(false);
        }
    };

    const run = async () => {
        setActionInProgress(true);
        try {
            const response = await fetch(`${API_BASE_URL}/System/run-status/run/default`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + (await response.text()).substring(0, 250));
            }
            const result = await response.json();
            setSnackbar({ open: true, message: 'System started successfully', severity: 'success' });
            fetchData(); // Refresh state after action
        } catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                setError(error.message);
                setSnackbar({ open: true, message: error.message, severity: 'error' });
            } else {
                setError('Error, unknown error type');
                setSnackbar({ open: true, message: 'Error, unknown error type', severity: 'error' });
            }
        } finally {
            setActionInProgress(false);
        }
    };

    const stopRun = async () => {
        setActionInProgress(true);
        try {
            const response = await fetch(`${API_BASE_URL}/System/run-status/idle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + (await response.text()).substring(0, 250));
            }
            const result = await response.json();
            setSnackbar({ open: true, message: 'System stopped successfully', severity: 'success' });
            fetchData(); // Refresh state after action
        } catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                setError(error.message);
                setSnackbar({ open: true, message: error.message, severity: 'error' });
            } else {
                setError('Error, unknown error type');
                setSnackbar({ open: true, message: 'Error, unknown error type', severity: 'error' });
            }
        } finally {
            setActionInProgress(false);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <Box p={5}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Typography variant="h4" gutterBottom>
                            System State
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        <Box display="flex" flexDirection="column" alignItems="stretch">
                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <SystemStateCard data={data} />
                            )}
                            <Box mt={2} display="flex" gap={2}>
                                <Tooltip
                                    title={
                                        loading
                                            ? 'Fetching system state...'
                                            : error
                                                ? 'Failed to fetch system state'
                                                : actionInProgress
                                                    ? 'Action in progress...'
                                                    : ''
                                    }
                                    disableHoverListener={!(loading || error || actionInProgress)}
                                    disableFocusListener={!(loading || error || actionInProgress)}
                                >
                                    <span>
                                        <Button
                                            onClick={run}
                                            disabled={actionInProgress || loading || !!error}
                                            variant="contained"
                                            color="primary"
                                        >
                                            {actionInProgress ? <CircularProgress size={24} /> : 'Run'}
                                        </Button>
                                    </span>
                                </Tooltip>
                                <Tooltip
                                    title={
                                        loading
                                            ? 'Fetching system state...'
                                            : error
                                                ? 'Failed to fetch system state'
                                                : actionInProgress
                                                    ? 'Action in progress...'
                                                    : ''
                                    }
                                    disableHoverListener={!(loading || error || actionInProgress)}
                                    disableFocusListener={!(loading || error || actionInProgress)}
                                >
                                    <span>
                                        <Button
                                            onClick={stopRun}
                                            disabled={actionInProgress || loading || !!error}
                                            variant="contained"
                                            color="secondary"
                                        >
                                            {actionInProgress ? <CircularProgress size={24} /> : 'Stop'}
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Box>
                            {error && (
                                <Typography variant='body1' color='error' mt={2}>{error}</Typography>
                            )}
                            {refreshing && !loading && (
                                <Box mt={2} display="flex" alignItems="center">
                                    <CircularProgress size={20} />
                                    <Typography variant="body2" ml={1}>Refreshing...</Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}

export default SystemDashboard;
