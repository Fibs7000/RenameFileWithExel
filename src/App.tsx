import {
  Box,
  Container,
  Link,
  Step,
  StepLabel,
  Stepper,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import { Finished } from './Finished';
import {
  useGenerateRenamedFiles,
  useGetFilesFromDirectory,
  useRenameFiles,
} from './hooks';
import { PreviewWriteAndWrite } from './PreviewWriteAndWrite';
import { SelectExcelRenamings } from './SelectExcelRenamings';
import { SelectFolder } from './SelectFolder';

function App() {
  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(0);

  const next = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  var [fileReplacements, setFileReplacements] = useState<
    { old: string; new: string }[]
  >(new Array(50).fill({ old: '', new: '' }));

  const {
    selectDirectory: handleOpenDirectory,
    directoryHandle,
    fileNames,
    setDirectoryHandle,
    setFileNames,
  } = useGetFilesFromDirectory();

  const { rename, writeProgress } = useRenameFiles(
    directoryHandle,
    fileNames,
    () => next(),
  );

  const handleGenerateRewrites = useGenerateRenamedFiles(
    fileReplacements,
    fileNames,
    setFileNames,
    next,
  );

  useEffect(() => {
    if (fileReplacements.length == 0)
      setFileReplacements([{ new: '', old: '' }]);
  }, [fileReplacements]);

  return (
    <Box flex={1} style={{ display: 'flex' }} flexDirection="column">
      <Box flex={1}>
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
              <SelectFolder
                fileNames={fileNames}
                handleOpenDirectory={handleOpenDirectory}
                next={next}
              ></SelectFolder>
            )}

            {activeStep == 1 && (
              <SelectExcelRenamings
                length={fileNames.length}
                setActiveStep={setActiveStep}
                fileReplacements={fileReplacements}
                setFileReplacements={setFileReplacements}
                handleGenerateRewrites={handleGenerateRewrites}
              ></SelectExcelRenamings>
            )}

            {activeStep == 2 && (
              <PreviewWriteAndWrite
                writingInProgress={writeProgress}
                fileNames={fileNames}
                setActiveStep={setActiveStep}
                handleRenameFiles={rename}
              ></PreviewWriteAndWrite>
            )}
            {activeStep > 2 && (
              <Finished
                setDirectoryHandle={setDirectoryHandle}
                setFileNames={setFileNames}
                setActiveStep={setActiveStep}
                setFileReplacements={setFileReplacements}
              ></Finished>
            )}
          </Box>
        </Container>
      </Box>
      <Container maxWidth="md">
        <Box margin={5} display="flex" justifyContent="space-between">
          <Link
            href={'https://www.seekinnovation.at/team/fabio-moretti'}
            align="right"
          >
            Created by Fabio Moretti
          </Link>
          <Link
            href={'https://github.com/Fibs7000/RenameFileWithExel'}
            align="right"
          >
            View on Github
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

function getSteps() {
  return ['Select Directory', 'Select Excel columns', 'Write Files'];
}

export default App;
