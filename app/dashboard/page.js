'use client'
import { AppBar, Popper, Grow, ClickAwayListener, MenuList, MenuItem, Toolbar, Typography, Button, Box, Paper, Stack } from "@mui/material";
import Link from 'next/link';
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from '@mui/icons-material/Menu';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'


export default function Dashboard() {

    //MenuList
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

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    //Menu Navigation
    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            bgcolor="#FEF7FF"
        >
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
                        onClick={handleToggle}>
                    </MenuIcon>
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
                                            <MenuItem onClick={() => handleNavigation('/saved')}>Saved Searches</MenuItem>
                                            <MenuItem onClick={() => handleNavigation('/')}>Logout</MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: "'Lato', sans-serif", paddingLeft: '20px' }}>
                        RateSmart
                    </Typography>
                    <Link href="/" passHref>
                        < Button sx={{
                            mx: 1,
                            color: 'white',
                            '&:hover': { backgroundColor: '#28231D' },
                            transition: 'background-color 0.3s ease',
                            borderRadius: '20px',
                        }}>
                            Sign Out
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Stack bgcolor={'#FEF7FF'} spacing={5} padding={8} alignItems={'center'}>
                <Typography variant="h4">Hi User! Welcome to RateSmart</Typography>
                <Typography variant="h6">Want to find professors you'd like?</Typography>
                <Link href="/assistant" passHref>
                    <Button variant="outlined" sx={{
                        bgcolor: "#65558F", color: 'white', borderRadius: '20px', borderColor: '#65558F',
                        '&:hover': { backgroundColor: '#28031D' },
                        transition: 'background-color 0.3s ease',
                        fontFamily: "'Lato', sans-serif",
                    }}>Chat with Assistant</Button>
                </Link>
                <Typography variant="h6">Already know who you want?</Typography>
                **Insert Search here**
                <Typography variant="h6">View Saved Searches/Professors</Typography>
            </Stack>
        </Box>
    )
}