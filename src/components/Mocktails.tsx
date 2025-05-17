import { useState, useEffect } from "react";
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

import {
  getAllMocktails,
  getMocktailById,
  getCabinetMocktails,
  addMocktailToCabinet,
  removeMocktailFromCabinet,
  getMocktailFromCabinet,
} from "../api/ApiCalls";

import type { ShortMocktailInfo, LongMocktailInfo } from "../types/Mocktails";

interface Page {
  page: string;
}

const Mocktails: React.FC<Page> = ({ page }) => {
  const [mocktailList, setMocktailList] = useState<ShortMocktailInfo[] | null>([]);
  const [mocktail, setMocktail] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    let data;

    if (page === "all") {
      data = await getAllMocktails();
    } else {
      data = await getCabinetMocktails();
    }
    setMocktailList(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [page]);

  async function handleOpenDialog(drink: any) {
    let data;
    if (page === "all") {
      data = await getMocktailById(drink.idDrink);
    } else {
      data = await getMocktailFromCabinet(drink.docId);
    }

    setMocktail(data);
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
  }

  function handleAddMocktailToCabinet(mocktail: ShortMocktailInfo) {
    addMocktailToCabinet(mocktail, setAlertMessage);
    setDialogOpen(false);
  }

  function handleRemoveMocktailFromCabinet(docId: string) {
    removeMocktailFromCabinet(docId);
    setDialogOpen(false);
    fetchData();
  }

  return (
    <>
      <Container sx={{ marginTop: 4 }}>
        <Grid container alignItems='center' justifyContent='center' sx={{ height: 60, mb: 4 }}>
          {loading ? (
            <CircularProgress />
          ) : alertMessage ? (
            <Alert severity='warning' onClose={() => setAlertMessage(null)}>
              <AlertTitle>Sorry!</AlertTitle>
              {alertMessage}
            </Alert>
          ) : null}
        </Grid>

        <Grid container alignItems='center' justifyContent='center' spacing={2}>
          {mocktailList &&
            mocktailList.map((drink) => (
              <Grid key={drink.idDrink}>
                <Card>
                  <CardHeader
                    avatar={<Avatar src={drink.strDrinkThumb} alt={drink.strDrink} sx={{ width: 60, height: 60 }} />}
                    title={<Typography variant='h6'>{drink.strDrink}</Typography>}
                  />
                  <CardActions>
                    <Button onClick={() => handleOpenDialog(drink)}>See more info</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>

      <Dialog open={dialogOpen}>
        {mocktail && (
          <>
            <DialogTitle>{mocktail.strDrink}</DialogTitle>
            <DialogContent>
              <Typography sx={{ mb: 2 }}>Glass: {mocktail.strGlass}</Typography>

              {Object.entries(mocktail)
                .filter(([key, value]) => key.startsWith("strIngredient") && value)
                .map(([key, ingredient], index) => {
                  const measure = mocktail[`strMeasure${index + 1}` as keyof LongMocktailInfo];
                  return <Typography key={key}>{measure ? `${measure} ${ingredient}` : ""}</Typography>;
                })}

              <Typography sx={{ mt: 2 }}>{mocktail.strInstructions}</Typography>
            </DialogContent>
            <DialogActions>
              {page === "all" ? (
                <Button onClick={() => handleAddMocktailToCabinet(mocktail)}>Add to my cabinet</Button>
              ) : (
                <Button onClick={() => handleRemoveMocktailFromCabinet(mocktail.docId)}>Remove from my cabinet</Button>
              )}
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Mocktails;
