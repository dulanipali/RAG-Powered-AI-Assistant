'use client';
import { AppBar, Container, Toolbar, Typography, Button, Box, CssBaseline, Grid, Paper } from "@mui/material";
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs'; // Import Clerk's useAuth hook
import { useRouter } from 'next/navigation'; // Import useRouter to programmatically navigate

export default function Home() {
    const { isSignedIn } = useAuth(); // Check if the user is signed in
    const router = useRouter(); // Use router for programmatic navigation

    const style = {
        p: 3,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        background: 'white',
        boxShadow: '2',
        borderRadius: '15px',
    }

    const handleGetStarted = () => {
        if (isSignedIn) {
            router.push('/assistant'); // If user is signed in, navigate to assistant page
        } else {
            router.push('/sign-in'); // If user is not signed in, navigate to sign-in page
        }
    }

    return (
        <Container
            maxWidth={false}
            sx={{
                maxHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
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
                    backgroundColor: '#000000',
                    boxShadow: 'none',
                    minWidth: '100vw',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: "'Lato', sans-serif" }}>
                        RateSmart
                    </Typography>
                    <Link href="/sign-in" passHref>
                        <Button sx={{
                            mx: 1,
                            color: 'white',
                            '&:hover': { backgroundColor: '#28231D' },
                            transition: 'background-color 0.3s ease',
                            borderRadius: '20px',
                        }}>Login</Button>
                    </Link>
                    <Link href="/sign-up" passHref>
                        <Button
                            sx={{
                                mx: 1,
                                color: 'white',
                                '&:hover': { backgroundColor: '#28231D' },
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
                    alignItems: 'center',
                    textAlign: 'center',
                    overflowX: 'hidden',
                    width: '100vw',
                    height: '100vh',
                    padding: 0,
                    margin: 0,
                }}
            >
                {/* Title Section */}
                <Box sx={{
                    backgroundColor: '#EDCFFC',
                    width: '100vw',
                    height: '100vh',
                    py: 8,
                    px: 4,
                    margin: 0,
                }}>
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            animation: `fadeIn 2s ease`,
                            fontFamily: "'Lato', sans-serif",
                        }}
                    >
                        RateSmart
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 4,
                            fontFamily: "'Lato', sans-serif",
                        }}
                    >
                        Your Personal Guide to Finding the Best Professors and Courses
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#000000',
                            '&:hover': { backgroundColor: '#000055' },
                            fontSize: '1.2rem',
                            px: 4,
                            py: 1,
                            borderRadius: '20px',
                            fontFamily: "'Lato', sans-serif",
                        }}
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </Button>
                </Box>
                <Box sx={{
                    width: '100vw',
                    minHeight: '100vh',
                    py: 8,
                    px: 4,
                    backgroundColor: 'white',
                    textAlign: "center",
                    padding: "50px",
                    margin: 0,
                }}>
                    <Typography variant="h4" component="h2" align="center" gutterBottom>
                        Features
                    </Typography>
                    <Typography>Start chatting with our assistant by clicking Get Started. Sign in for more features!</Typography>
                    <Grid container spacing={4} sx={{ padding: '30px' }}>
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
                    backgroundColor: '#000000',
                    color: '#fff',
                    py: 2,
                    textAlign: 'center',
                    minWidth: '100vw',
                    margin: 0,
                }}
            >
                <Typography variant="body2">
                    © 2024 RateSmart. All rights reserved.
                </Typography>
            </Box>
        </Container>
    );
}
