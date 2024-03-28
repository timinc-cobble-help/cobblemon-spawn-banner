import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CssBaseline,
  LinearProgress,
  Typography,
} from "@mui/material";

export default function LoadingScreen({ detail }) {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Card>
          <CardHeader title="Loading..." subheader={detail} />
          <CardContent>
            <LinearProgress />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
