
// build and read file path

import { copyFileSync } from 'node:fs';
import path from 'node:path'

// const filePath = projectRoot + "/uploads" + filename ----- not good practice

// path.join : uses the correct separator for the current os
// i.e mac = /users/zeki/project/file.txt
// window = c:\users\zeki\project\file.txt
// it creates a path string
// it will not create the folder
// it does not check whether the file exists or not

// process.cwd : the folder from where the node js process was started

const projectRoot = process.cwd();
console.log(projectRoot)


const userId = '42';
const originalName = 'profile.photo.png';

const uploadFilePath = path.join(
    projectRoot,
    "upload",
    'users',
    userId,
    originalName
);
console.log(uploadFilePath)


// final part of a path(i.e file name)
const fileName = path.basename(uploadFilePath);
console.log(fileName)

// file extension
const fileExtension = path.extname(uploadFilePath);
console.log(fileExtension)

// file parent folder
const fileParentDir = path.dirname(uploadFilePath);
console.log(fileParentDir)
