import { useCallback, useEffect, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";
import { fetchDirectory, fetchFile } from "../api/gitlab";

export default function usePokedata(version = "main") {
  const [cachedPokemonRefs, setCachedPokemonRefs] = useLocalStorage("cachedPokemonRefs-" + version, []);
  const [langData, setLangData] = useLocalStorage("langData-" + version, null);

  const huntForPokemon = useCallback(
    async (pokemonName) => {
      const currentKnownPokemon = [...cachedPokemonRefs];
      while (
        !currentKnownPokemon.some(({ name }) => name.endsWith(`${pokemonName}.json`))
      ) {
        const data = await fetchDirectory(
          "common/src/main/resources/data/cobblemon/spawn_pool_world",
          { page: currentKnownPokemon.length / 20 + 1, recursive: true, version }
        );
        if (data.length === 0)
          throw new Error("Pokemon not found: " + pokemonName);
        currentKnownPokemon.push(...data);
      }
      setCachedPokemonRefs(currentKnownPokemon);
      return currentKnownPokemon.find(
        ({ name }) => name.endsWith(`${pokemonName}.json`)
      );
    },
    [cachedPokemonRefs, setCachedPokemonRefs, version]
  );

  useEffect(() => {
    async function fetchLangData() {
      const data = await fetchFile(
        "common/src/main/resources/assets/cobblemon/lang/en_us.json",
        { version }
      );
      setLangData(data);
    }
    fetchLangData();
  }, [setLangData, version]);

  const pokemon = useMemo(() => {
    if (!langData) return [];
    return Object.entries(langData)
      .filter(([k]) => {
        return /cobblemon\.species\.[^.]+\.name/.test(k);
      })
      .map(([k, v]) => ({
        value: k.match(/cobblemon\.species\.([^.]+)\.name/)[1],
        label: v,
      }));
  }, [langData]);

  return { huntForPokemon, pokemon };
}