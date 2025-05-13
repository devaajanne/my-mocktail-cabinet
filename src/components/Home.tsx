import React from "react";
import { signOut } from "firebase/auth";
import auth from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Container, Button, Toolbar, Typography } from "@mui/material";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You are logged out");
      navigate("/");
    } catch (error: any) {
      alert(error.message);
      console.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Container maxWidth='lg'>
        <AppBar sx={{ backgroundColor: "#141414" }}>
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
      </Container>
    </>
  );
};

export default Home;
