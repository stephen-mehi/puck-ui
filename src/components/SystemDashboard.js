import { Button, Container, Typography, Grid, Card, CardContent, Box, CircularProgress } from '@mui/material';
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

    const [respMsg, setRespMsg] = useState("");

    useEffect(() => {

        const interval = setInterval(() => {
            fetchData();
        }, 1000); // Polling interval in milliseconds (e.g., every second)

        // Cleanup function to clear interval when component unmounts or useEffect re-runs
        return () => clearInterval(interval);

    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://192.168.1.12:30671/System/state');
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setRespMsg(error.message);
            setLoading(false);
        }
    };


    const run = async () => {
        try {
            const response = await fetch('http://192.168.1.12:30671/System/run-status/run/default', {
                method: 'POST', // HTTP method
                headers: {
                    'Content-Type': 'application/json', // Set content type if sending JSON
                },
                // Add body if necessary
                // body: JSON.stringify({ key: 'value' }), // Example of request body
            });

            if (!response.ok) {
                throw new Error('Network response was not ok' + (await response.text()).substring(0, 250));
            }

            const result = await response.json(); // Parse JSON if response is JSON
            console.log('Success:', result); // Handle success (e.g., show a message)
        } catch (error) {
            console.error('Error:', error); // Handle error (e.g., show an error message)
            setRespMsg(error.message);
        }
    };

    const stopRun = async () => {
        try {
            const response = await fetch('http://192.168.1.12:30671/System/run-status/idle', {
                method: 'POST', // HTTP method
                headers: {
                    'Content-Type': 'application/json', // Set content type if sending JSON
                },
                // Add body if necessary
                // body: JSON.stringify({ key: 'value' }), // Example of request body
            });

            if (!response.ok) {
                throw new Error('Network response was not ok' + (await response.text()).substring(0, 250));
            }

            const result = await response.json(); // Parse JSON if response is JSON
            console.log('Success:', result); // Handle success (e.g., show a message)
        } catch (error) {
            console.error('Error:', error); // Handle error (e.g., show an error message)
            setRespMsg(error.message);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <Container>

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

                        <Button onClick={run}>
                            Run
                        </Button>

                        <Button onClick={stopRun}>
                            Stop
                        </Button>

                        <Typography variant='body1'>{respMsg}</Typography>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>

    );
}

export default SystemDashboard;
