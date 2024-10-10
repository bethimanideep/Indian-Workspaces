// theme.js
import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',  // Default to light mode
  useSystemColorMode: false,  // Disable automatic system color mode
}

const theme = extendTheme({ config })

export default theme
