import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";

type AppDialogProps = {
  source: string;
  open: boolean;
  handleDialogClose: () => void;
};

export default function AppDialog({ source, open, handleDialogClose }: AppDialogProps) {
  let ariaTitle: string = "";
  let ariaDescription: string = "";
  let message: string = "";

  switch (source) {
    case "login":
      ariaTitle = "login";
      ariaDescription = "login";
      message = "Log in succesful!";
      break;
    case "signup":
      ariaTitle = "signup";
      ariaDescription = "signup";
      message = "Sign up succesful!";
      break;
    case "logout":
      ariaTitle = "logout";
      ariaDescription = "logout";
      message = "Log out succesful!";
      break;
    case "add":
      ariaTitle = "add";
      ariaDescription = "add";
      message = "Mocktail added to your cabinet.";
      break;
    case "remove":
      ariaTitle = "remove";
      ariaDescription = "remove";
      message = "Mocktail removed from your cabinet.";
      break;
    case "duplicateAlert":
      ariaTitle = "duplicatealert";
      ariaDescription = "duplicatealert";
      message = "This mocktail is already added to your cabinet!";
      break;
    default:
      ariaTitle = "error";
      ariaDescription = "error";
      message = "An error occurred";
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
          <Button onClick={handleDialogClose} aria-label='Close dialog'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
