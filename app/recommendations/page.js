'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack } from "@mui/material";
import Link from 'next/link';
import reviewsData from '../../reviews.json'; // Ensure the path is correct

export default function Recommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to search reviews based on stored keywords
    const searchReviews = () => {
        try {
            setLoading(true);
            const storedKeywords = JSON.parse(sessionStorage.getItem('preferenceKeywords')) || [];
            console.log('Stored Keywords:', storedKeywords);
            const uniqueProfessors = new Set();
            const matchingReviews = reviewsData.reviews.filter(review => {
                return storedKeywords.some(keyword => {
                    const lowerCaseReview = review.review.toLowerCase();
                    const lowerCaseKeyword = keyword.toLowerCase();

                    const keywordIndex = lowerCaseReview.indexOf(lowerCaseKeyword);
                    if (keywordIndex !== -1) {
                        const negativeWords = [
                            'not', 'hardly', 'barely', 'scarcely', 'tough',
                            'hard to keep up', 'independent', 'dry', 'strictly',
                            'boring', 'drag', 'heavy', 'work hard', 'goes off on tangents',
                            'expects a lot', 'demands a lot', 'hard time', 'fast-paced',
                            'challenging', 'strict', 'confusing', 'moves quickly',
                            'hard to stay awake', 'need to stay on top of the work',
                            'can go off-topic'
                        ];
                        const context = lowerCaseReview.substring(Math.max(0, keywordIndex - 30), keywordIndex);
                        const hasNegativeQualifier = negativeWords.some(negWord => context.includes(negWord));

                        if (!hasNegativeQualifier && !uniqueProfessors.has(review.professor)) {
                            uniqueProfessors.add(review.professor);
                            return true;
                        }
                    }
                    return false;
                });
            });
            setRecommendations(matchingReviews);
        } catch (err) {
            setError('Failed to search reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedKeywords = JSON.parse(sessionStorage.getItem('preferenceKeywords')) || [];
        if (storedKeywords.length > 0) {
            searchReviews();
        } else {
            setLoading(false); // No preferences to search for
        }
    }, []);

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bgcolor="#FEF7FF"
            padding={4}
            sx={{ fontFamily: "'Roboto', sans-serif" }}
        >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontFamily: "'Montserrat', sans-serif" }}>
                Recommended Professors
            </Typography>

            <Typography variant="h6" sx={{ marginBottom: 4, color: "#555", textAlign: 'center', maxWidth: '80%' }}>
                Here are some professors recommended based on your preferences.
            </Typography>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Stack spacing={3} marginTop={4} width="100%" maxWidth="800px">
                    {recommendations.length > 0 ? recommendations.map((professor, index) => (
                        <Box key={index} bgcolor="#FFFFFF" padding={3} borderRadius="16px"
                            sx={{
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05) rotate(1deg)',
                                },
                                fontFamily: "'Roboto', sans-serif"
                            }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: "'Montserrat', sans-serif" }}>
                                {professor.professor}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#777" }}>
                                Teaches: {professor.subject}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#777" }}>
                                Rating: {professor.stars}/5
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                Review: {professor.review}
                            </Typography>
                        </Box>
                    )) : (
                        <Typography>No matching professors found for your query.</Typography>
                    )}
                </Stack>
            )}

            <Link href="/dashboard" passHref>
                <Button variant="contained" sx={{
                    marginTop: 4,
                    borderRadius: '20px',
                    backgroundColor: "#65558F",
                    color: 'white',
                    padding: '10px 20px',
                    textTransform: 'none',
                    fontFamily: "'Montserrat', sans-serif",
                    '&:hover': {
                        backgroundColor: "#53396D",
                    }
                }}>
                    Back to Dashboard
                </Button>
            </Link>
        </Box>
    );
}
