import { useState, useEffect } from "react";
import {
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
import AppDialog from "./AppDialog";

interface Page {
  page: string;
}

const Mocktails: React.FC<Page> = ({ page }) => {
  const [mocktailList, setMocktailList] = useState<ShortMocktailInfo[] | null>([]);
  const [mocktail, setMocktail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [mocktailDialogOpen, setMocktailDialogOpen] = useState(false);
  const [duplicateAlertDialogOpen, setDuplicateAlertDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

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
    setMocktailDialogOpen(true);
  }

  function handleCloseDialog() {
    setMocktailDialogOpen(false);
    setDuplicateAlertDialogOpen(false);
    setAddDialogOpen(false);
    setRemoveDialogOpen(false);
  }

  function handleAddMocktailToCabinet(mocktail: ShortMocktailInfo) {
    addMocktailToCabinet(mocktail, setDuplicateAlertDialogOpen, setAddDialogOpen);
  }

  function handleRemoveMocktailFromCabinet(docId: string) {
    removeMocktailFromCabinet(docId, setRemoveDialogOpen);
    fetchData();
  }

  return (
    <>
      <Container sx={{ marginTop: 4 }}>
        <Grid container alignItems='center' justifyContent='center' sx={{ height: 20, mb: 4 }}>
          {loading ? <CircularProgress aria-label='Loading drinks' /> : null}
        </Grid>

        <AppDialog source={"duplicateAlert"} open={duplicateAlertDialogOpen} handleCloseDialog={handleCloseDialog} />
        <AppDialog source={"add"} open={addDialogOpen} handleCloseDialog={handleCloseDialog} />
        <AppDialog source={"remove"} open={removeDialogOpen} handleCloseDialog={handleCloseDialog} />

        <Grid container alignItems='center' justifyContent='center' spacing={2}>
          {mocktailList &&
            mocktailList.map((drink) => (
              <Grid key={drink.idDrink}>
                <Card role='region' aria-labelledby={`card-title-${drink.idDrink}`} sx={{ width: 300 }}>
                  <CardHeader
                    avatar={<Avatar src={drink.strDrinkThumb} alt={drink.strDrink} sx={{ width: 60, height: 60 }} />}
                    title={
                      <Typography variant='h6' id={`card-title-${drink.idDrink}`}>
                        {drink.strDrink}
                      </Typography>
                    }
                  />
                  <CardActions>
                    <Button
                      onClick={() => handleOpenDialog(drink)}
                      aria-label={`See more information about ${drink.strDrink}`}>
                      See more info
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>

      <Dialog
        open={mocktailDialogOpen}
        aria-labelledby='mocktail-dialog-title'
        aria-describedby='mocktail-dialog-description'>
        {mocktail && (
          <>
            <DialogTitle id='mocktail-dialog-title'>{mocktail.strDrink}</DialogTitle>
            <DialogContent id='mocktail-dialog-description'>
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
                <Button
                  onClick={() => handleAddMocktailToCabinet(mocktail)}
                  aria-label={`Add ${mocktail.strDrink} to my cabinet`}>
                  Add to my cabinet
                </Button>
              ) : (
                <Button
                  onClick={() => handleRemoveMocktailFromCabinet(mocktail.docId)}
                  aria-label={`Remove ${mocktail.strDrink} from my cabinet`}>
                  Remove from my cabinet
                </Button>
              )}
              <Button onClick={handleCloseDialog} aria-label='Close details dialog'>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Mocktails;
