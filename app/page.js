'use client'
import { AppBar, Container, Toolbar, Typography, Button, Box, CssBaseline, Grid, Paper } from "@mui/material";
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';


export default function Home() {

    const style = {
        p: 3,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        background: 'white',
        boxShadow: '2',
        borderRadius: '15px',
    }


    return (
        <Container
            maxWidth={false}
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#E3F2FD',
                padding: 0,
                margin: 0,
                overflowX: 'hidden',
            }}
        >
            <Head>
                <title>RateSmart</title>
                <meta name="description" content="Rate my professor assistant for professor recommendations" />
                <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
            </Head>

            <CssBaseline />

            <AppBar
                position="static"
                sx={{
                    backgroundColor: '#5C6BC0',
                    boxShadow: 'none',
                    width: '100%',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: "'Lato', sans-serif" }}>
                        RateSmart
                    </Typography>
                    <Link href="/sign-in" passHref>
                        <Button color="inherit" sx={{ mx: 1 }}>Login</Button>
                    </Link>
                    <Link href="/sign-up" passHref>
                        <Button
                            color="inherit"
                            sx={{
                                mx: 1,
                                backgroundColor: '#42A5F5',
                                '&:hover': { backgroundColor: '#1E88E5' },
                                transition: 'background-color 0.3s ease',
                                borderRadius: '20px',
                                fontFamily: "'Lato', sans-serif",
                            }}
                        >
                            Sign Up
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    flexGrow: 1,
                    flexDirection: 'column',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 8,
                    px: 4,
                    overflowX: 'hidden',
                    width: '100%',
                }}
            >
                {/* Title Section */}
                <Box>
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: '#5C6BC0',
                            animation: `fadeIn 2s ease`,
                            fontFamily: "'Lato', sans-serif",
                        }}
                    >
                        RateSmart
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: '#9575CD',
                            mb: 4,
                            fontFamily: "'Lato', sans-serif",
                        }}
                    >
                        Your Personal Guide to Finding the Best Professors and Courses
                    </Typography>
                    <Link href="/assistant" passHref>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#9575CD',
                                '&:hover': { backgroundColor: '#7E57C2' },
                                fontSize: '1.2rem',
                                px: 4,
                                py: 1,
                                borderRadius: '20px',
                                fontFamily: "'Lato', sans-serif",
                            }}
                        >
                            Get Started
                        </Button>
                    </Link>
                </Box>


                <Box sx={{ backgroundColor: 'white', my: 6, textAlign: "justify" }}>
                    <Typography variant="h4" component="h2" align="center" gutterBottom>
                        Features
                    </Typography>
                    <Typography>Start chatting with our assistant by clicking Get Started. Sign in for more features!</Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={style}>
                                <Typography variant="h5">Real-time answers</Typography>
                                <Typography>
                                    Our AI intelligently breaks down your text into concise flashcards.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={style}>
                                <Typography variant="h5">Save favourites</Typography>
                                <Typography>
                                    Save your favourite professors and past searches.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={style}>
                                <Typography variant="h5" gutterBottom>Personalized Recommendations</Typography>
                                <Typography>
                                    Tailor-made recommendations that fits your specific needs and preferences.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={style}>
                                <Typography variant="h5" gutterBottom>Speech to Text availability</Typography>
                                <Typography>
                                    Don't want to type? Talk idk
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>



                </Box>
            </Box>

            <Box
                sx={{
                    backgroundColor: '#5C6BC0',
                    color: '#fff',
                    py: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2">
                    Â© 2024 RateSmart. All rights reserved.
                </Typography>
            </Box>
        </Container>
    );
}