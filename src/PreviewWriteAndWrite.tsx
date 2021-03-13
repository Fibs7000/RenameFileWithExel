import React from 'react';
import {
  Box,
  Button,



  LinearProgress,



  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';

export function PreviewWriteAndWrite({
  fileNames,
  handleRenameFiles,
  setActiveStep,
  writingInProgress,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  handleRenameFiles: () => void;
  writingInProgress: number | undefined;
  fileNames: any[];
}) {
  return (
    <Box margin={4}>
      <Button
        onClick={() => setActiveStep((step: number) => step - 1)}
        color="primary"
        variant="contained"
      >
        Back
      </Button>
      <Button
        onClick={handleRenameFiles}
        color="primary"
        variant="contained"
        style={{
          marginLeft: 10,
        }}
      >
        Write Files
      </Button>
      {writingInProgress != 0 && (
        <LinearProgress
          variant="determinate"
          value={writingInProgress}
          style={{
            marginTop: 20,
          }} />
      )}
      <Box marginTop={4}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableCell>Old name</TableCell>
              <TableCell>New name</TableCell>
            </TableHead>
            <TableBody>
              {fileNames.map(
                (
                  file: { name: React.ReactNode; newName: any; },
                  i: string | number | null | undefined
                ) => (
                  <TableRow key={i}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      {file.newName ?? 'Could not find matching entry'}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
