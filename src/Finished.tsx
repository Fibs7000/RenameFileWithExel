import React from 'react';
import {
  Box,
  Button
} from '@material-ui/core';

export function Finished({ setActiveStep, setDirectoryHandle, setFileNames, setFileReplacements }: {
  setFileNames: (arg0: never[]) => void;
  setActiveStep: (arg0: number) => void;
  setDirectoryHandle: (arg0: undefined) => void;
  setFileReplacements: (arg0: never[]) => void;
}) {
  return (
    <Box margin={4}>
      <h1>Success!</h1>
      <p>
        Renamed file are in writen to the folder <b>"renamed"</b>
      </p>
      <Button
        onClick={() => {
          setFileNames([]);
          setActiveStep(0);
          setDirectoryHandle(undefined);
          setFileReplacements([]);
        }}
        color="primary"
        variant="contained"
      >
        Start over
      </Button>
    </Box>
  );
}
