import PropTypes from "prop-types";
import { Stack } from "@mui/system";
import { useCallback, useMemo, useState } from "react";
import ListBox from "./ListBox";
import { Button } from "@mui/material";

export default function TransferList({ items, selected, setSelected }) {
  const [selectedSelected, setSelectedSelected] = useState([]);
  const [selectedUnselected, setSelectedUnselected] = useState([]);

  const itemsByKey = useMemo(
    () =>
      items.reduce(
        (acc, { value, ...etc }) => ({ ...acc, [value]: { ...etc, value } }),
        {}
      ),
    [items]
  );

  const unselected = useMemo(() => {
    return items.filter(
      (item) =>
        !selected.find((selectedItem) => item.value === selectedItem.value)
    );
  }, [items, selected]);
  
  const handleSelectAll = useCallback(() => {
    setSelected(items);
  }, [items]);

  const handleSelectNone = useCallback(() => {
    setSelected([]);
  }, []);

  const handleShiftSelected = useCallback(() => {
    setSelected((p) => [
      ...p,
      ...selectedSelected.map((value) => itemsByKey[value]),
    ]);
    setSelectedSelected([]);
  }, [itemsByKey, selectedSelected, setSelected]);

  const handleShiftUnselected = useCallback(() => {
    setSelected((p) => p.filter((e) => !selectedUnselected.includes(e.value)));
    setSelectedUnselected([]);
  }, [selectedUnselected, setSelected]);

  return (
    <Stack direction="row" sx={{ flexBasis: 0, minHeight: 0, flexGrow: 1 }}>
      <ListBox
        items={unselected}
        selected={selectedSelected}
        setSelected={setSelectedSelected}
      />
      <Stack direction="column" justifyContent="center" gap={3}>
        <Button onClick={handleSelectAll} variant="contained">
          &gt;&gt;
        </Button>
        <Button onClick={handleShiftSelected} variant="contained">
          &gt;
        </Button>
        <Button onClick={handleShiftUnselected} variant="contained">
          &lt;
        </Button>
        <Button onClick={handleSelectNone} variant="contained">
          &lt;&lt;
        </Button>
      </Stack>
      <ListBox
        items={selected}
        selected={selectedUnselected}
        setSelected={setSelectedUnselected}
      />
    </Stack>
  );
}

TransferList.propTypes = {
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
