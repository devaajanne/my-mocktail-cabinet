import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Container, Button, Toolbar, Typography, Grid } from "@mui/material";
import Mocktails from "./Mocktails";

const Home: React.FC = () => {
  const navigateTo = useNavigate();
  const [page, setPage] = useState("all");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You are logged out");
      navigateTo("/");
    } catch (error: any) {
      alert(error.message);
      console.error(`Error: ${error.message}`);
    }
  };

  function handlePageChange(page: string) {
    setPage(page);
  }

  return (
    <>
      <Container maxWidth='lg'>
        <AppBar position='static'>
          <Toolbar>
            <Box sx={{ flex: 1 }} />

            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant='h5' noWrap>
                My mocktail cabinet
              </Typography>
            </Box>

            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Button color='inherit' onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Grid container alignItems='center' justifyContent='center' spacing={6} direction='row' sx={{ mt: 2 }}>
          <Button variant='contained' onClick={() => handlePageChange("all")}>
            All mocktails
          </Button>
          <Button variant='contained' onClick={() => handlePageChange("cabinet")}>
            My cabinet
          </Button>
        </Grid>
        <Grid container>
          <Grid>
            <Mocktails page={page} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
