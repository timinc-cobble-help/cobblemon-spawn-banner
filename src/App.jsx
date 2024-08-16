import { Button, CssBaseline, Stack } from "@mui/material";
import usePokedata from "./hooks/usePokedata";
import TransferList from "./components/TransferList";
import { useCallback, useState } from "react";
import JSZip from "jszip";
import removeSpawn from "./data/removeSpawn.json";
import { saveAs } from "file-saver";
import LoadingScreen from "./components/LoadingScreen";

const version = "1.5.2";

function App() {
  const { pokemon, loadingSpawns } = usePokedata(version);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    const zip = new JSZip();
    for (const { value: path } of selected) {
      const splitPath = path.split("/");
      const dataIndex = splitPath.indexOf("data");
      const finalPath = splitPath.slice(dataIndex).join("/");
      zip.file(finalPath, JSON.stringify(removeSpawn, null, 2));
    }
    zip.file(
      "pack.mcmeta",
      JSON.stringify(
        {
          pack: {
            pack_format: 10,
            description: `Removes vanilla Cobblemon spawns for ${selected
              .map((e) => e.label)
              .join(", ")}`,
          },
        },
        null,
        2
      )
    );
    await zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "removals.zip");
    });
    setLoading(false);
  }, [selected]);

  const handleClearCache = useCallback(() => {
    localStorage.removeItem("cachedPokemonRefs-" + version);
    localStorage.removeItem("langData-" + version);
    window.location.reload();
  }, []);

  if (loadingSpawns) {
    return <LoadingScreen detail="Spawn Data" />;
  }

  if (loading) {
    return <LoadingScreen detail="Zip File" />;
  }

  return (
    <>
      <CssBaseline />
      <Stack direction="column" sx={{ height: "100vh" }} p={1} gap={1}>
        {pokemon && (
          <TransferList
            items={pokemon}
            selected={selected}
            setSelected={setSelected}
          />
        )}
        <Button variant="contained" onClick={handleDownload}>
          Download
        </Button>
        <Button variant="contained" color="warning" onClick={handleClearCache}>Clear Cache</Button>
      </Stack>
    </>
  );
}

export default App;
