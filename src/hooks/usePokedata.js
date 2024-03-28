import { useCallback, useEffect, useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import { fetchDirectory, fetchFile } from "../api/gitlab";

export default function usePokedata(version = "main") {
  const [cachedPokemonRefs, setCachedPokemonRefs] = useLocalStorage("cachedPokemonRefs-" + version, {});
  const [langData, setLangData] = useLocalStorage("langData-" + version, null);
  const [loadingSpawns, setLoadingSpawns] = useState(true);

  useEffect(() => {
    let running = true;
    const fetchAllSpawns = async () => {
      setLoadingSpawns(true);
      const currentKnownPokemon = [];
      let page = Math.ceil(Object.keys(cachedPokemonRefs).length / 20) + 1;
      while (true) {
        const data = await fetchDirectory(
          "common/src/main/resources/data/cobblemon/spawn_pool_world",
          { page, recursive: true, version }
        );
        if (!running) return;
        if (data.length === 0)
          break;
        page++;
        currentKnownPokemon.push(...data);
        setCachedPokemonRefs(p => currentKnownPokemon.reduce((acc, { name, type, path }) => type === "blob" ? { ...acc, [name]: { path } } : acc, p));
      }
      setLoadingSpawns(false);
    };
    fetchAllSpawns();
    return () => {
      running = false;
    };
  }, []);

  useEffect(() => {
    async function fetchLangData() {
      const data = await fetchFile(
        "common/src/main/resources/assets/cobblemon/lang/en_us.json",
        { version }
      );
      setLangData(data);
    }
    if (!langData) fetchLangData();
  }, [setLangData, version]);

  const pokemon = useMemo(() => {
    if (!langData) return [];
    return Object.entries(cachedPokemonRefs).map(([fileName, { path }]) => ({
      label: langData[`cobblemon.species.${/_(.*)\./g.exec(fileName)[1]}.name`],
      value: path
    }));
  }, [langData]);

  return { pokemon, loadingSpawns };
}