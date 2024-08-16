import { useEffect, useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import { fetchFile } from "../api/gitlab";

export default function usePokedata(version = "main") {
  const [cachedPokemonRefs, setCachedPokemonRefs] = useLocalStorage("cachedPokemonRefs-" + version, {});
  const [langData, setLangData] = useLocalStorage("langData-" + version, null);
  const [loadingSpawns, setLoadingSpawns] = useState(true);

  useEffect(() => {
    let running = true;

    const fetchAllSpawns = async () => {
      setLoadingSpawns(true);
      const found = [];
      let link = "https://gitlab.com/api/v4/projects/cable-mc%2Fcobblemon/repository/tree?id=cable-mc/cobblemon&path=common/src/main/resources/data/cobblemon/spawn_pool_world&per_page=100&recursive=true&ref=1.5.2&pagination=keyset&order_by=id";
      do {
        const response = await fetch(link);
        const results = await response.json();
        found.push(...results);

        link = response.headers.get("link")?.match(/<(.*)>/)?.[1];
      } while (link && running);
      if (!running) return;
      setCachedPokemonRefs(p => found.reduce((acc, { name, type, path }) => type === "blob" ? { ...acc, [name]: { path } } : acc, p));
      setLoadingSpawns(false);
    };
    fetchAllSpawns();

    return () => {
      running = false;
    };
  }, [setCachedPokemonRefs]);

  useEffect(() => {
    async function fetchLangData() {
      const data = await fetchFile(
        "common/src/main/resources/assets/cobblemon/lang/en_us.json",
        { version }
      );
      setLangData(data);
    }
    if (!langData) fetchLangData();
  }, [langData, setLangData, version]);

  const pokemon = useMemo(() => {
    if (langData)
      console.log(Object.entries(langData));
    if (!langData) return [];
    return Object.entries(cachedPokemonRefs).map(([fileName, { path }]) => ({
      label: langData[`cobblemon.species.${/_(.*)\./g.exec(fileName)[1]}.name`],
      value: path
    }));
  }, [cachedPokemonRefs, langData]);

  return { pokemon, loadingSpawns };
}