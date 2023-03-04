import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import React from "react";

type SaveBarProp = {
  selectedData: { start: number; end: number };
};

export function SaveBar({ selectedData }: SaveBarProp) {
  const list = [{ title: "The Shawshank Redemption", year: 1994 }];
  const options = list.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });
  function generateDateFormat(date: number) {
    const dateTime = new Date(date);
    const day = dateTime.getDay();
    const month = dateTime.getMonth();
    const year = dateTime.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const { start, end } = {
    start: generateDateFormat(selectedData.start),
    end: generateDateFormat(selectedData.end),
  };
  const handleSave = (e) => {
    e.preventDefault();
  };
  return (
    <Box sx={{ minWidth: 190, display: "flex" }}>
      <span>
        Selected from: <b>{start}</b> to: <b>{end}</b>
      </span>
      <Autocomplete
        id="grouped-demo"
        options={options.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="With categories" />
        )}
      />
      <Button variant="contained" onClick={(e) => handleSave(e)}>
        Save
      </Button>
    </Box>
  );
}
