import React from 'react';
import {
  Box,
  Button,







  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';

export function SelectExcelRenamings({ fileReplacements, handleGenerateRewrites, length, setActiveStep, setFileReplacements }: {
  setActiveStep: (cb: (step: number) => number) => void;
  handleGenerateRewrites: () => void;
  length: number;
  fileReplacements: { old: string; new: string; }[];
  setFileReplacements: React.Dispatch<
    React.SetStateAction<
      {
        old: string;
        new: string;
      }[]
    >
  >;
}) {
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = parseData(e.clipboardData.getData('text/plain'));
    setFileReplacements(
      data.map(([oldVal, newVal]) => ({ old: oldVal, new: newVal }))
    );
  };
  return (
    <Box margin={4}>
      <Button
        onClick={() => setActiveStep((step) => step - 1)}
        color="primary"
        variant="contained"
      >
        Back
      </Button>
      <Button
        onClick={handleGenerateRewrites}
        disabled={length == 0}
        style={{
          marginLeft: 10,
        }}
        color="primary"
        variant="contained"
      >
        Continue
      </Button>
      <Box marginTop={4}>
        <TableContainer onPaste={handlePaste}>
          <Table>
            <TableHead>
              <TableCell>Old name</TableCell>
              <TableCell>New name</TableCell>
            </TableHead>
            <TableBody>
              {fileReplacements.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <TextField
                      value={v.old}
                      onChange={(e) => {
                        console.log('changing...');
                        setFileReplacements((files) => files.map((value, j) => i == j ? { ...value, old: e.target.value } : value
                        )
                        );
                      }} />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={v.new}
                      onChange={(e) => setFileReplacements((files) => files.map((value, j) => i == j ? { ...value, new: e.target.value } : value
                      )
                      )} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
function parseData(data: string) {
  return data
    .trim()
    .split(/\r\n|\n|\r/)
    .map((row) => row.split('\t'));
}
