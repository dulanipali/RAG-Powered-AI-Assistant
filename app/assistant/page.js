'use client'
import { Box, Button, Stack, TextField, AppBar, Toolbar, Typography, Link, Modal, IconButton, Paper, Popper, Grow, ClickAwayListener, MenuList, MenuItem } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import MicIcon from '@mui/icons-material/Mic';
import StarIcon from '@mui/icons-material/Star';
import MenuIcon from '@mui/icons-material/Menu';

import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs';
import { firestore } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function Home() {

  const { isSignedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(); // Log out the user with Clerk
      router.push('/'); // Redirect to the home page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  //State for managing messages and user input
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ])
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef(null)

  // Function to dynamically extract keywords from user input
  const extractKeywords = (message) => {
    const stopWords = [
      'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
      'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she',
      'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
      'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that',
      'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
      'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of',
      'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
      'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
      'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then',
      'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
      'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
      'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
      'will', 'just', 'don', 'should', 'now'
    ];

    const words = message.split(' ');
    const keywords = words.filter(word => !stopWords.includes(word.toLowerCase()));

    return keywords;
  };

  const saveKeyword = (message) => {
    const keywords = extractKeywords(message);
    let storedKeywords = JSON.parse(sessionStorage.getItem('preferenceKeywords')) || [];
    keywords.forEach((keyword) => {
      if (!storedKeywords.includes(keyword)) {
        storedKeywords.push(keyword.toLowerCase());
      }
    });
    sessionStorage.setItem('preferenceKeywords', JSON.stringify(storedKeywords));
  };

  //Handle sending messages
  const sendMessage = async () => {
    saveKeyword(message);

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
    setMessage('')

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  // Initialize the Speech Recognition API if available
  if (typeof window !== 'undefined' && !recognitionRef.current) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
        console.log('Transcript:', transcript) // Debugging line
        setMessage(transcript)
      }
      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error) // Debugging line
        setIsRecording(false)
      }
    } else {
      console.error('Speech Recognition API not supported in this browser.')
    }
  }

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  // Feedback Form
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  };

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleOpen = () => setFeedbackOpen(true);

  const handleSubmit = async () => {
    // Save the rating to Firestore
    if (rating > 0) {
      try {
        await addDoc(collection(firestore, "feedback"), {
          rating: rating,
          timestamp: new Date()
        });
        console.log("Rating saved successfully");
      } catch (error) {
        console.error("Error saving rating: ", error);
      }

    }

    setFeedbackOpen(false);
    setRating(0); // Reset rating after submission
  };

  const handleRating = (value) => {
    setRating(value);
  };

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
      justifyContent="center"
      alignItems="center"
      bgcolor="#FEF7FF"//"#EDCFFC"
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
          {(isSignedIn) ? <><MenuIcon
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? 'composition-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}>
          </MenuIcon><Popper
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
                    transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
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
            </Popper></> : null}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: "'Lato', sans-serif", paddingLeft: '20px' }}>
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
          <Button
            onClick={handleOpen}
            sx={{
              mx: 1,
              color: 'white',
              '&:hover': { backgroundColor: '#28231D' },
              transition: 'background-color 0.3s ease',
              borderRadius: '20px',
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Exit
          </Button>
        </Toolbar>
      </AppBar>
      <Stack
        direction={'column'}
        width="600px"
        height="700px"
        borderRadius={4}
        bgcolor="white"
        boxShadow="0 4px 12px rgba(0,0,0,0.5)"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          padding="0 10px 0 0"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#dddddd",
              borderRadius: "8px",
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={message.role === "assistant" ? "#D6C3E0" : "primary.secondary"}
                //color={message.role === "assistant" ? "white" : "text.primary"}
                border="1px solid black"
                borderRadius={16}
                p={3}
              >
                {/*message.content
                  .split(/(?=\d+\.\s)/) //Split before a number followed by a dot and space
                  .map((line, index) => (
                    line.trim() ? (
                      <Typography key={index} component="div" sx={{ mb: 1 }}>
                        {line.trim()}
                      </Typography>
                    ) : null
                  ))*/}
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2} alignItems="center">
          <MicIcon
            fontSize="large"
            //variant="contained"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? 'Stop Recording' : 'Record'}
          </MicIcon>
          <TextField
            label="Enter your message"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={message == ''}
            sx={{ bgcolor: '#1e1e1e', '&:hover': { bgcolor: '#2d2d2d' } }}
          >
            Send
          </Button>
        </Stack>
      </Stack>

      {/*Feedback form*/}
      <Modal
        open={feedbackOpen}
        onClose={handleSubmit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" align='center'>
            Rate your experience with our Assistant
          </Typography>
          <Stack width="100%" direction="column" spacing={3}>
            <Stack direction="row" spacing={1} mt={2} justifyContent="center">
              {[1, 2, 3, 4, 5].map((value) => (
                <IconButton key={value} onClick={() => handleRating(value)}>
                  <StarIcon
                    sx={{ color: value <= rating ? '#ff5722' : '#ccc' }}
                  />
                </IconButton>
              ))}
            </Stack>
            <Button variant="contained" onClick={() => { handleSubmit() }} disabled={rating === 0} sx={{ bgcolor: '#1e1e1e', '&:hover': { bgcolor: '#2d2d2d' } }}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>

    </Box>
  )
}