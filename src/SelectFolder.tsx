import React from 'react';
import {
  Box,
  Button,







  Table,
  TableBody,
  TableCell,

  TableHead,
  TableRow
} from '@material-ui/core';

export function SelectFolder({ fileNames, handleOpenDirectory, next }: {
  handleOpenDirectory: () => void;
  next: () => void;
  fileNames: (FileSystemHandle & { newName?: string; })[];
}) {
  return (
    <Box margin={4}>
      <Button
        onClick={handleOpenDirectory}
        color="primary"
        variant="contained"
      >
        Open Directory
      </Button>

      <Button
        onClick={next}
        disabled={fileNames.length == 0}
        style={{
          marginLeft: 10,
        }}
        color="primary"
        variant="contained"
      >
        Continue
      </Button>
      <Box marginTop={4}>
        <Table>
          <TableHead>
            <TableCell>File Name</TableCell>
          </TableHead>
          <TableBody>
            {fileNames.map((file) => (
              <TableRow key={file.name}>
                <TableCell>{file.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
