import { Container, Typography, Grid, Card, CardContent, Box, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import customTheme from './Theme';
import { ThemeProvider } from '@mui/material/styles';


function SystemDashboard() {

    const [data, setData] = useState({
        thermoBlockTemperature: null,
        groupHeadTemperature: null,
        thermoBlockTemperatureSetPoint: null,
        groupHeadTemperatureSetPoint: null,
        pressure: null,
        pumpSpeed: null,
        runState: "None",
        recirculationValveState: "None",
        groupHeadValveState: "None",
        backFlushValveState: "None"
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const interval = setInterval(() => {
            fetchData();
        }, 1000); // Polling interval in milliseconds (e.g., every second)

        // Cleanup function to clear interval when component unmounts or useEffect re-runs
        return () => clearInterval(interval);

    }, []);

    const fetchData = async () => {
        try {
            // Replace with your API endpoint
            const response = await fetch('http://localhost:5135/System/state');
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <Container>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                                System State
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                        </Grid>
                    </Grid>
                )}
            </Container>
        </ThemeProvider>

    );
}

export default SystemDashboard;