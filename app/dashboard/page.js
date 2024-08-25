'use client';
import { AppBar, Popper, Grow, ClickAwayListener, MenuList, MenuItem, Toolbar, Typography, Button, Box, Paper, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem as MuiMenuItem, FormControl, InputLabel, Grid } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import reviewsData from '../../reviews.json';
import { useClerk, useUser } from '@clerk/nextjs';

export default function Dashboard() {
    const { signOut } = useClerk();
    const { user } = useUser(); // Get the current user

    // MenuList
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
    };

    const handleLogout = async () => {
        try {
            await signOut(); // Log out the user with Clerk
            router.push('/'); // Redirect to the home page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Search functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

    // Advanced Search functionality
    const [professorName, setProfessorName] = useState('');
    const [subject, setSubject] = useState('');
    const [rating, setRating] = useState('');

    // Extract unique professor names, subjects, and ratings from reviews data
    const professorNames = Array.from(new Set(reviewsData.reviews.map(review => review.professor)));
    const subjects = Array.from(new Set(reviewsData.reviews.map(review => review.subject)));
    const ratings = Array.from(new Set(reviewsData.reviews.map(review => review.stars.toString())));

    // Store the saved searches
    const [savedSearches, setSavedSearches] = useState([]);

    useEffect(() => {
        const storedSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
        setSavedSearches(storedSearches);
    }, []);

    const handleSearch = () => {
        try {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const results = reviewsData.reviews.filter(review =>
                review.professor.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setSearchResults(results);
            if (results.length === 0) {
                setError('No matching professors found.');
            } else {
                setError(null);

                // Save the search term if results are found
                const updatedSearches = [...savedSearches, searchTerm];
                setSavedSearches(updatedSearches);
                localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
            }
        } catch (err) {
            setError('An error occurred while searching.');
        }
    };

    const handleAdvancedSearch = () => {
        try {
            const lowerCaseProfessorName = professorName.toLowerCase();
            const lowerCaseSubject = subject.toLowerCase();
            const results = reviewsData.reviews.filter(review =>
                review.professor.toLowerCase().includes(lowerCaseProfessorName) &&
                review.subject.toLowerCase().includes(lowerCaseSubject) &&
                (rating === '' || review.stars === parseInt(rating))
            );
            setSearchResults(results);
            if (results.length === 0) {
                setError('No matching professors found.');
            } else {
                setError(null);
                // Save the search term if results are found
                const searchQuery = `${professorName} ${subject} ${rating}`.trim();
                const updatedSearches = [...savedSearches, searchQuery];
                setSavedSearches(updatedSearches);
                localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
            }
        } catch (err) {
            setError('An error occurred while searching.');
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setSearchResults([]);
        setError(null);
        setProfessorName('');
        setSubject('');
        setRating('');
    };

    const toggleAdvancedSearch = () => {
        setAdvancedSearchOpen(prev => !prev);
    };

    // Modal logic
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <Box width="100vw" minHeight="100vh" bgcolor="#FEF7FF" padding={3}>
            {/* Header */}
            <AppBar
                position="static"
                sx={{
                    backgroundColor: '#000000',
                    boxShadow: 'none',
                    width: '100%',
                }}
            >
                <Toolbar>
                    <MenuIcon
                        ref={anchorRef}
                        id="composition-button"
                        aria-controls={open ? 'composition-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        sx={{ cursor: 'pointer' }}
                    />
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement="bottom-start"
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList
                                            autoFocusItem={open}
                                            id="composition-menu"
                                            aria-labelledby="composition-button"
                                            onKeyDown={handleListKeyDown}
                                        >
                                            <MenuItem onClick={() => handleNavigation('/assistant')}>Chat</MenuItem>
                                            <MenuItem onClick={() => handleNavigation('/dashboard')}>Dashboard</MenuItem>
                                            <MenuItem onClick={() => handleNavigation('/recommendations')}>Recommendations</MenuItem>
                                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: "'Lato', sans-serif", paddingLeft: '20px' }}>
                        RateSmart
                    </Typography>
                    <Button sx={{
                        mx: 1,
                        color: 'white',
                        '&:hover': { backgroundColor: '#28231D' },
                        transition: 'background-color 0.3s ease',
                        borderRadius: '20px',
                    }}
                        onClick={handleLogout}>
                        Sign Out
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Grid container spacing={3} mt={3}>
                {/* Main Section */}
                <Grid item xs={12} md={8}>
                    <Box padding={3} bgcolor="white" borderRadius="12px" boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)">
                        <Typography
                            variant="h4"
                            sx={{
                                background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                fontFamily: "'Lato', sans-serif",
                                mb: 2,
                            }}
                        >
                            Hi {user?.firstName || 'User'}! Welcome to RateSmart
                        </Typography>

                        {/* Search Bar */}
                        <TextField
                            label="Search for a professor"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: '20px' }}
                        />
                        <Stack direction="row" spacing={2} marginBottom="20px">
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                sx={{ bgcolor: '#65558F', '&:hover': { bgcolor: '#53396D' } }}
                            >
                                Search
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={toggleAdvancedSearch}
                                sx={{ bgcolor: '#ffffff', color: '#65558F', '&:hover': { bgcolor: '#f0f0f0' } }}
                            >
                                Advanced Search
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={handleClear}
                                sx={{ bgcolor: '#ffffff', color: '#65558F', '&:hover': { bgcolor: '#f0f0f0' } }}
                            >
                                Clear
                            </Button>
                        </Stack>

                        {/* Advanced Search Fields */}
                        {advancedSearchOpen && (
                            <Stack spacing={2} marginBottom="20px">
                                <FormControl fullWidth>
                                    <InputLabel>Professor Name</InputLabel>
                                    <Select
                                        value={professorName}
                                        onChange={(e) => setProfessorName(e.target.value)}
                                    >
                                        {professorNames.map((name, index) => (
                                            <MuiMenuItem key={index} value={name}>{name}</MuiMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Subject</InputLabel>
                                    <Select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    >
                                        {subjects.map((subj, index) => (
                                            <MuiMenuItem key={index} value={subj}>{subj}</MuiMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Rating</InputLabel>
                                    <Select
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    >
                                        {ratings.map((rate, index) => (
                                            <MuiMenuItem key={index} value={rate}>{rate}</MuiMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    onClick={handleAdvancedSearch}
                                    sx={{ bgcolor: '#65558F', '&:hover': { bgcolor: '#53396D' } }}
                                >
                                    Search
                                </Button>
                            </Stack>
                        )}

                        {/* Error or Search Results */}
                        {error ? (
                            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
                        ) : (
                            <Stack spacing={3} marginTop={4}>
                                {searchResults.map((professor, index) => (
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
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Grid>

                {/* Side Section */}
                <Grid item xs={12} md={4}>
                    <Box padding={3} bgcolor="white" borderRadius="12px" boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)">
                        <Typography variant="h6" sx={{ fontFamily: "'Lato', sans-serif" }}>View Search History</Typography>
                        <Button variant="outlined" onClick={handleModalOpen} sx={{
                            bgcolor: "#65558F", color: 'white', borderRadius: '20px', borderColor: '#65558F',
                            '&:hover': { backgroundColor: '#28031D' },
                            transition: 'background-color 0.3s ease',
                            fontFamily: "'Lato', sans-serif",
                            width: '100%',
                            marginBottom: '16px'
                        }}>
                            View List
                        </Button>

                        {/* Modal to display saved searches */}
                        <Dialog open={modalOpen} onClose={handleModalClose}>
                            <DialogTitle>Saved Searches/Professors</DialogTitle>
                            <DialogContent>
                                {savedSearches.length > 0 ? (
                                    <ul>
                                        {savedSearches.map((search, index) => (
                                            <li key={index}>{search}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Typography>No saved searches/professors found.</Typography>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleModalClose} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Typography variant="h6" sx={{ fontFamily: "'Lato', sans-serif" }}>Need Recommendations?</Typography>
                        <Button variant="outlined" sx={{
                            bgcolor: "#65558F", color: 'white', borderRadius: '20px', borderColor: '#65558F',
                            '&:hover': { backgroundColor: '#28031D' },
                            transition: 'background-color 0.3s ease',
                            fontFamily: "'Lato', sans-serif",
                            width: '100%'
                        }}
                            onClick={() => handleNavigation('/recommendations')}>
                            View Recommendations
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
