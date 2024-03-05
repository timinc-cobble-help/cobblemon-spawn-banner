export async function fetchFile(filename, { type = "json", version = "main" } = {}) {
  const response = await fetch(
    `https://gitlab.com/api/v4/projects/cable-mc%2Fcobblemon/repository/files/${filename.replaceAll(
      "/",
      "%2F"
    )}/raw?ref=${version}`
  );

  switch (type) {
    case "json":
      return response.json();
    case "text":
      return response.text();
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export async function fetchDirectory(
  dirname,
  { page = 1, recursive = false, pageSize = 20, version = "main" } = {}
) {
  const response = await fetch(
    `https://gitlab.com/api/v4/projects/cable-mc%2Fcobblemon/repository/tree?id=cable-mc%2Fcobblemon&page=${page}&pagination=keyset&path=${dirname.replaceAll(
      "/",
      "%2F"
    )}&per_page=${pageSize}&recursive=${recursive}&ref=${version}`
  );
  const data = await response.json();
  return data;
}