import { Button, CssBaseline, Stack } from "@mui/material";
import usePokedata from "./hooks/usePokedata";
import TransferList from "./components/TransferList";
import { useCallback, useState } from "react";
import JSZip from "jszip";
import removeSpawn from "./data/removeSpawn.json";
import { saveAs } from "file-saver";

function App() {
  const { huntForPokemon, pokemon } = usePokedata("1.4.1");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    const zip = new JSZip();
    for (const { value } of selected) {
      const { path } = await huntForPokemon(value);
      const splitPath = path.split("/");
      const dataIndex = splitPath.indexOf("data");
      const finalPath = splitPath.slice(dataIndex).join("/");
      console.log(finalPath);
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
  }, [huntForPokemon, selected]);

  return (
    <>
      <CssBaseline />
      {loading ? (
        <div>Loading...</div>
      ) : (
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
        </Stack>
      )}
    </>
  );
}

export default App;
