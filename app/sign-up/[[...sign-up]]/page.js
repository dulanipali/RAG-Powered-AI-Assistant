'use client';

import { AppBar, Typography, Container, Button, Toolbar, Box } from '@mui/material';
import Link from 'next/link';
import { SignUp, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
    const router = useRouter();
    const { isLoaded, signUp } = useSignUp();

    useEffect(() => {
        if (isLoaded && signUp) {
            // Check if the sign-up is completed successfully
            if (signUp.status === 'complete') {
                // Redirect to the Free Dashboard
                router.push('/dashboard');
            }
        }
    }, [isLoaded, signUp, router]);

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                minHeight: '100vh',
                backgroundColor: '#EDCFFC',
                padding: '0',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Roboto, sans-serif' }}>
                        RateSmart
                    </Typography>
                    <Link href="/sign-in" passHref>
                        <Button
                            sx={{
                                mx: 1,
                                color: 'white',
                                '&:hover': { backgroundColor: '#28231D' },
                                transition: 'background-color 0.3s ease',
                                borderRadius: '20px',
                                fontFamily: "'Lato', sans-serif",
                            }} >Login</Button>
                    </Link>
                </Toolbar>
            </AppBar>

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8, flexGrow: 1 }}
            >
                <Typography variant="h4" sx={{ color: '#000000', mb: 4 }}>
                    Sign Up
                </Typography>
                <Box
                    sx={{
                        backgroundColor: '#D1C4E9',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        afterSignUpUrl="/dashboard"  // Redirects to the Free Dashboard
                    />
                </Box>
            </Box>
        </Container>
    );
}