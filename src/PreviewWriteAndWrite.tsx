import {
  Box,
  Button,
  Icon,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@material-ui/core';
import React from 'react';

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
              <TableCell>Current File Name</TableCell>
              <TableCell>New File Name</TableCell>
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
                      {file.newName ?? <Tooltip title="There is no file with the same name as in the excel table. This Item will be skipped and will not be renamed. Please add or change the entries in the previous page to resolve this warning." ><Box flexDirection="row" display="flex"><Icon color="error">info</Icon><Typography style={{marginLeft: 15}} color="error">Could not find matching excel entry</Typography></Box></Tooltip>}
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
