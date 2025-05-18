import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";

type AppDialogProps = {
  source: string;
  open: boolean;
  handleCloseDialog: () => void;
};

export default function AppDialog({ source, open, handleCloseDialog }: AppDialogProps) {
  let ariaTitle: string = "";
  let ariaDescription: string = "";
  let message: string = "";

  if (source === "duplicateAlert") {
    ariaTitle = "duplicatealert";
    ariaDescription = "duplicatealert";
    message = "This mocktail is already added to your cabinet!";
  } else if (source == "add") {
    ariaTitle = "add";
    ariaDescription = "add";
    message = "Mocktail added to your cabinet.";
  } else {
    ariaTitle = "remove";
    ariaDescription = "remove";
    message = "Mocktail removed from your cabinet.";
  }

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby={`duplicate-${ariaTitle}-title`}
        aria-describedby={`duplicate-${ariaTitle}-description`}>
        <DialogContent>
          <Typography id={`duplicate-${ariaDescription}-description`}>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} aria-label='Close dialog'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
