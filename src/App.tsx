import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  Box,
  Button,
  Container,
  Grid,
  Input,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';

interface AppProps {}

function parseData(data: string) {
  return data
    .trim()
    .split(/\r\n|\n|\r/)
    .map((row) => row.split('\t'));
}

function App({}: AppProps) {
  const [
    directoryHandle,
    setDirectoryHandle,
  ] = useState<FileSystemDirectoryHandle>();
  const [writingInProgress, setWritingInProgress] = useState(0);
  const [successObject, setSuccessObject] = useState<{ filePath: string }>();
  const [fileNames, setFileNames] = useState<
    (FileSystemHandle & { newName?: string })[]
  >([]);
  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(0);

  var [fileReplacements, setFileReplacements] = useState<
    { old: string; new: string }[]
  >(new Array(50).fill({ old: '', new: '' }));

  console.log(
    '🚀 ~ file: App.tsx ~ line 38 ~ App ~ fileReplacements',
    fileReplacements,
  );

  const handleClick = async () => {
    // let [handle] = await window.showOpenFilePicker();
    // let res = await directoryOpen({ recursive: true });
    // for (const file of res) {
    //   console.log("File: ", file.name, file.type);
    // }

    let handle = await window.showDirectoryPicker();
    setDirectoryHandle(handle);
    let files = [];
    for await (const file of handle.values())
      if (file.kind == 'file') files.push(file);
    setFileNames(files);
  };

  const handleClick2 = async () => {
    if (!directoryHandle) return;
    let permission = await directoryHandle.requestPermission({
      mode: 'readwrite',
    });
    if (permission != 'granted') {
      alert("Can't write to directory! Please accept write permission!");
      return;
    }

    // let handle = await directoryHandle.getDirectoryHandle("name", { create: true });
    let handle = await directoryHandle.getDirectoryHandle('renamed', {
      create: true,
    });
    setWritingInProgress(0);
    try {
      let count = 0;
      for (const file of fileNames) {
        setWritingInProgress((count++ / fileNames.length) * 100);
        if (!file.newName) continue;
        let fileHandle = await handle.getFileHandle(file.newName, {
          create: true,
        });
        let writableStream = await fileHandle.createWritable();
        let fileBlob = await (file as FileSystemFileHandle).getFile();
        await writableStream.write(fileBlob);
        await writableStream.close();
      }
    } catch (error) {
      alert(error.message || error);
    }
    setSuccessObject({ filePath: handle.name });
    setWritingInProgress(0);
    next();
  };

  const handleGenerateRewrites = () => {
    for (const rewrite of fileReplacements) {
      if (rewrite.new.length == 0 || rewrite.old.length == 0) continue;
      let currentFile = fileNames.find(
        (f) => f.name.split('.')[0] == rewrite.old,
      );

      console.log('currentFile', currentFile);
      if (!currentFile) continue;

      currentFile.newName = currentFile.name.replace(rewrite.old, rewrite.new);
    }

    setFileNames([...fileNames]);
    next();
  };

  const next = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault()
    const data = parseData(e.clipboardData.getData('text/plain'));
    setFileReplacements(
      data.map(([oldVal, newVal]) => ({ old: oldVal, new: newVal })),
    );
  }

  useEffect(() => {
    if (fileReplacements.length == 0)
      setFileReplacements([{ new: '', old: '' }]);
  }, [fileReplacements]);

  return (
    <Container maxWidth="md">
      <Box margin={5}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep == 0 && (
          <Box margin={4}>
            <Button onClick={handleClick} color="primary" variant="contained">
              Open Directory
            </Button>

            <Button
              onClick={next}
              disabled={fileNames.length == 0}
              style={{ marginLeft: 10 }}
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
        )}

        {activeStep == 1 && (
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
              disabled={fileNames.length == 0}
              style={{ marginLeft: 10 }}
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
                              setFileReplacements((files) =>
                                files.map((value, j) =>
                                  i == j
                                    ? { ...value, old: e.target.value }
                                    : value,
                                ),
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={v.new}
                            onChange={(e) =>
                              setFileReplacements((files) =>
                                files.map((value, j) =>
                                  i == j
                                    ? { ...value, new: e.target.value }
                                    : value,
                                ),
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}

        {activeStep == 2 && (
          <Box margin={4}>
            <Button
              onClick={() => setActiveStep((step) => step - 1)}
              color="primary"
              variant="contained"
            >
              Back
            </Button>
            <Button
              onClick={handleClick2}
              color="primary"
              variant="contained"
              style={{ marginLeft: 10 }}
            >
              Write Files
            </Button>
            {writingInProgress!=0 && (
              <LinearProgress
                variant="determinate"
                value={writingInProgress}
                style={{ marginTop: 20 }}
              />
            )}
            <Box marginTop={4}>
              <TableContainer onPaste={handlePaste}>
                <Table>
                  <TableHead>
                    <TableCell>Old name</TableCell>
                    <TableCell>New name</TableCell>
                  </TableHead>
                  <TableBody>
                    {fileNames.map((file, i) => (
                      <TableRow key={i}>
                        <TableCell>{file.name}</TableCell>
                        <TableCell>
                          {file.newName ?? 'Could not find matching entry'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
        {activeStep > 2 && (
          <Box margin={4}>
            <h1>Success!</h1>
            {/* {successObject && <p>See data at {successObject.filePath}</p>} */}
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
        )}
        {/* <HorizontalLinearStepper/> */}
      </Box>
    </Container>
  );
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}

function getSteps() {
  return ['Select Directory', 'Select Excel columns', 'Write Files'];
}

function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = getSteps();

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography>{getStepContent(activeStep)}</Typography>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                >
                  Skip
                </Button>
              )}
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
