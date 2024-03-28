import PropTypes from "prop-types";
import {
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

export default function ListBox({ items, selected, setSelected }) {
  const [search, setSearch] = useState("");

  const filteredList = useMemo(
    () =>
      items
        .filter(({ label }) =>
          label.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 20),
    [items, search]
  );

  const handleItemSelect = useCallback(
    (value) => {
      setSelected((p) => {
        if (p.includes(value)) {
          return p.filter((e) => e !== value);
        } else {
          return p.concat(value);
        }
      });
    },
    [setSelected]
  );

  return (
    <Stack direction="column" sx={{ flexBasis: 0, minWidth: 0, flexGrow: 1 }}>
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        label="Search..."
      />
      <List sx={{ height: "100%", overflowY: "auto" }}>
        {filteredList.length ? (
          filteredList.map(({ value, label }) => (
            <ListItemButton
              key={value}
              onClick={() => handleItemSelect(value)}
              sx={{
                cursor: "pointer",
              }}
            >
              <ListItemIcon>
                <Checkbox checked={!!selected.find((item) => item === value)} />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </ListItemButton>
          ))
        ) : (
          <ListItemButton disabled>None found...</ListItemButton>
        )}
      </List>
    </Stack>
  );
}

ListBox.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  setSelected: PropTypes.func,
};
