import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Text,
  Box,
  Input,
} from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons'; // Import Chakra UI's TimeIcon

const LoginSignupModal = ({ isOpen, onClose }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // State to hold the OTP input as an array
  const [email, setEmail] = useState(''); // State to hold the email input
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP was sent

  // Start timer countdown
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setIsTimerActive(false); // Stop the timer when it reaches 0
      setOtpSent(false); // Reset OTP sent status
      setOtp(['', '', '', '']); // Clear OTP input
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleSubmit = async () => {
    if (email) {
      try {
        // Send email to the server
        const response = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }), // Send the email in req.body
        });

        if (response.ok) {
          setIsTimerActive(true); // Start the timer on successful submission
          setOtpSent(true); // Mark OTP as sent
          setTimer(30); // Reset timer to 30 seconds
        } else {
          // Handle error (e.g., show an error message)
          console.error('Failed to send email');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      // Handle case where email is not entered
      console.error('Email is required');
    }
  };

  const handleOtpVerify = async () => {
    const otpValue = otp.join(''); // Join OTP array to a string
    if (otpValue.length === otp.length && email) {
      try {
        // Send OTP and email to the server for verification
        const response = await fetch('http://localhost:8080/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp: otpValue }), // Send email and OTP in req.body
        });

        if (response.ok) {
          // Handle successful OTP verification (e.g., show a success message or redirect)
          console.log('OTP verified successfully');
          onClose(); // Close the modal after verification
        } else {
          // Handle verification error (e.g., show an error message)
          console.error('Failed to verify OTP');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Complete the OTP and email is required');
    }
  };

  const handleResendOTP = () => {
    // Logic for resending the OTP goes here
    setOtp(['', '', '', '']); // Reset the OTP input
    setTimer(30); // Reset the timer when OTP is resent
    handleSubmit(); // Resend the email to get a new OTP
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field when the current field is filled
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpPaste = (index, event) => {
    const pastedData = event.clipboardData.getData('Text'); // Get the pasted text
    const newOtp = [...otp];

    // Populate the OTP fields based on the pasted data
    pastedData.split('').forEach((char, idx) => {
      if (idx < newOtp.length) {
        newOtp[idx] = char.trim(); // Fill the corresponding field
      }
    });

    setOtp(newOtp);
    // Focus on the last input after pasting
    document.getElementById(`otp-input-${Math.min(index + pastedData.length - 1, newOtp.length - 1)}`).focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'ArrowRight') {
      if (index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus(); // Move to the right input
      }
    } else if (event.key === 'ArrowLeft') {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus(); // Move to the left input
      }
    } else if (event.key === 'Backspace') {
      event.preventDefault(); // Prevent default backspace behavior
      if (otp[index]) {
        handleOtpChange(index, ''); // Clear the current input
      } else if (index > 0) {
        handleOtpChange(index - 1, ''); // Clear previous input
        document.getElementById(`otp-input-${index - 1}`).focus(); // Move to the previous input
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        width="90vw"
        maxW="500px"
        borderRadius="md"
        height="auto" // Dynamic height based on state
        p={8}
      >
        <ModalHeader>Login or Signup</ModalHeader>
        <ModalCloseButton />
        <ModalBody mt={-4}>
          <Stack spacing={4}>
            {/* Sign-in buttons */}
            <a href="http://localhost:8080/auth/google">
              <Button colorScheme="red" width="100%">
                Sign in with Google
              </Button>
            </a>
            <a href="https://github.com/login/oauth/authorize?client_id=Ov23lirRJ2EOUFu1keae&scope=user:email">
              <Button
                bg="#333" // GitHub dark gray
                color="#FFFFFF" // White text
                width="100%"
                _hover={{ bg: "#444" }} // Lighter gray on hover
              >
                Sign in with GitHub
              </Button>
            </a>
            <a href="http://localhost:8080/auth/facebook">
              <Button colorScheme="blue" width="100%">
                Sign in with Facebook
              </Button>
            </a>

            {/* Manual email authentication */}
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
              />
            </FormControl>

            {/* OTP Entry Section */}
            {isTimerActive && otpSent && ( // Show OTP section only after sending OTP
              <>
                <FormLabel>Enter OTP</FormLabel>
                <Stack direction="row" spacing={2} justify="center">
                  {otp.map((value, index) => (
                    <Box
                      key={index}
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={4}
                      width="50px"
                      height="50px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Input
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onPaste={(e) => handleOtpPaste(index, e)} // Handle paste event
                        onKeyDown={(e) => handleKeyDown(index, e)} // Handle keyboard navigation
                        textAlign="center"
                        variant="unstyled"
                        fontSize="lg"
                        border="none"
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px blue.500',
                        }}
                      />
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={4}>
                  <TimeIcon boxSize={6} color="orange.500" />
                  <Text fontSize="lg">{timer} seconds</Text>
                  <Button onClick={handleResendOTP} isDisabled={timer > 0}>
                    Resend OTP
                  </Button>
                </Stack>
                <Button colorScheme="teal" onClick={handleOtpVerify}>
                  Verify OTP
                </Button>
              </>
            )}

            {!isTimerActive && !otpSent && ( // Show the submit button when OTP is not sent
              <Button colorScheme="teal" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginSignupModal;
