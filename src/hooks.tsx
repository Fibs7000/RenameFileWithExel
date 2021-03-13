import React, { useState } from 'react';

export function useGenerateRenamedFiles(
  fileReplacements: { old: string; new: string }[],
  fileNames: (
    | (FileSystemDirectoryHandle & { newName?: string | undefined })
    | (FileSystemFileHandle & { newName?: string | undefined })
  )[],
  setFileNames: React.Dispatch<
    React.SetStateAction<
      (
        | (FileSystemDirectoryHandle & { newName?: string | undefined })
        | (FileSystemFileHandle & { newName?: string | undefined })
      )[]
    >
  >,
  next: () => void,
) {
  return () => {
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
}
export function useRenameFiles(
  directoryHandle: FileSystemDirectoryHandle | undefined,
  fileNames: (
    | (FileSystemFileHandle & { newName?: string | undefined })
    | (FileSystemDirectoryHandle & { newName?: string | undefined })
  )[],
  onSuccess: () => void,
) {
  const [writingInProgress, setWritingInProgress] = useState(0);

  return {
    rename: async () => {
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
      setWritingInProgress(0);
      onSuccess();
    },
    writeProgress: writingInProgress,
  };
}

export function useGetFilesFromDirectory() {
  const [
    directoryHandle,
    setDirectoryHandle,
  ] = useState<FileSystemDirectoryHandle>();
  const [fileNames, setFileNames] = useState<
    (FileSystemHandle & { newName?: string })[]
  >([]);

  return {
    selectDirectory: async () => {
      let handle = await window.showDirectoryPicker();
      setDirectoryHandle(handle);
      let files = [];
      for await (const file of handle.values())
        if (file.kind == 'file') files.push(file);
      setFileNames(files.sort((a, b) => a.name.localeCompare(b.name)));
    },

    directoryHandle,
    setDirectoryHandle,
    fileNames,
    setFileNames,
  };
}
