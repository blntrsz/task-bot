import {useState} from 'react'
import { CssBaseline, GlobalStyles } from '@mui/joy';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import StyledEngineProvider from "@mui/joy/styles/StyledEngineProvider";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const customTheme = extendTheme({});

export function Providers({children}: React.PropsWithChildren<{}>) {
  const [client] = useState(() => new QueryClient())

  return <QueryClientProvider client={client}>
    <StyledEngineProvider injectFirst>
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
    {children}
    </CssVarsProvider>
    </StyledEngineProvider>
  </QueryClientProvider>
}
