import { Box, Stack, Paper, FormControl, TextField, FormLabel, Button } from '@mui/material';

export default function RegisterPage() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", marginTop: 20 }}>
      <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh" }}>
        <h1>recollect</h1>
        <p>track your library and loans!</p>
        <Paper elevation={3} sx={{ padding: 4, width: "300px" }}>
            <Stack spacing={2} direction="column">
                <FormControl fullWidth>
                    <FormLabel htmlFor="username">username</FormLabel>
                    <TextField id="username" type="text" name="username" variant="outlined" placeholder="fscottfitzy" required />
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel htmlFor="email">email</FormLabel>
                    <TextField id="email" type="email" name="email" variant="outlined" placeholder="your@email.com" required />
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel htmlFor="password">password</FormLabel>
                    <TextField id="password" type="password" name="password" variant="outlined" placeholder="••••••" required />
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel htmlFor="confirm-password">confirm password</FormLabel>
                    <TextField id="confirm-password" type="password" name="confirm-password" variant="outlined" placeholder="••••••" required />
                </FormControl>
                <Button variant="contained" color="primary" fullWidth>register</Button>
                <p>already have an account? <a href="/login">login</a></p>
            </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}