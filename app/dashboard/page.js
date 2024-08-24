'use client'
import { AppBar, Container, Toolbar, Typography, Button, Box, CssBaseline, Grid, Paper } from "@mui/material";
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';


export default function Dashboard() {
    return (
        <Container>
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
                    <Link href="/" passHref>
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
                            Sign Out
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box>
                <Typography>Hi User! Welcome to RateSmart</Typography>
                <Typography>What to find professors you'd like?</Typography>
                <Link href="/assistant" passHref>
                    <Button>Chat with Assistant</Button>
                </Link>
                <Typography>Already know who you want?</Typography>
                <Typography>View Saved Searches/Professors</Typography>
            </Box>

        </Container>
    )
}