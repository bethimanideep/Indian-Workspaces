// components/Navbar.js
import { Box, Flex, Link, IconButton, useColorMode, Spacer, Button } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import LoginSignupModal from './LoginSignupModal' // Import the new component
import React from 'react' 
const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Box px={4} py={2} bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}>
      <Flex alignItems="center">
        {/* Logo or Title */}
        <Box>
          <Link href="/" fontWeight="bold" fontSize="lg" _hover={{ textDecoration: 'none' }}>
            MyApp
          </Link>
        </Box>
        <Spacer />

        {/* Navigation Links */}
        <Box display={{ base: 'none', md: 'block' }}>
          <Link px={2} href="/">Home</Link>
          <Link px={2} href="/about">About</Link>
          <Link px={2} href="/contact">Contact</Link>
        </Box>

        {/* Light/Dark Mode Toggle */}
        <IconButton
          ml={4}
          aria-label="Toggle light/dark mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="outline"
        />
        
        {/* Login and Signup Buttons */}
        <Button ml={4} onClick={toggleModal} colorScheme="teal">
          Login / Signup
        </Button>
      </Flex>

      {/* Modal for Login/Signup */}
      <LoginSignupModal isOpen={isOpen} onClose={toggleModal} />
    </Box>
  )
}

export default Navbar
