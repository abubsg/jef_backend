// library for storing and editing data

// dependencies
const fs = require("fs");
const path = require("path");

// container for the module
const lib = {};

// JSON parser => Parse a JSON string to an object
const parseJsonToObj = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// base directory of the data folder
lib.baseDir = path.join(__dirname, "../.data/");

// base directory Path for retrieving media;
lib.baseDirPath = path.join(__dirname, "../");

// create a file directory for storing media
lib.createDir = (dirName, pathName, callback) => {
  fs.mkdir(pathName + "/" + dirName, (err) => {
    if (err) {
      callback("Directory already exists");
    } else {
      callback(false);
    }
  });
};

// delete a file directory
lib.deleteDir = (dirName, callback) => {
  // unlink the folder
  fs.rmdir(dirName, { recursive: true }, (err) => {
    if (err) {
      callback("error deleting file");
    } else {
      callback(false);
    }
  });
};

// write data to file
lib.create = (dir, fileName, data, callback) => {
  // open file for writing
  fs.open(
    lib.baseDir + dir + "/" + fileName + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("error closing new file");
              }
            });
          } else {
            callback("error writing to new file");
          }
        });
      } else {
        callback("Could not create file, it may already exist");
      }
    }
  );
};

// read data from file
lib.read = (dir, fileName, callback) => {
  fs.readFile(lib.baseDir + dir + "/" + fileName + ".json", "utf8", (err, data) => {
    if (!err && data) {
      const parsedData = parseJsonToObj(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

//  update data in a file
lib.update = (dir, fileName, data, callback) => {
  //  open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + fileName + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        //   truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            //  write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("error closing the existing file");
                  }
                });
              } else {
                callback("error writing to existing file");
              }
            });
          } else {
            callback("error truncating file");
          }
        });
      } else {
        callback("could not open the file for updating, it may not exist yet");
      }
    }
  );
};

// delete a file
lib.delete = (filePath, callback) => {
  // unlink the file
  fs.unlink(lib.baseDirPath + filePath, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("error deleting file");
    }
  });
};

module.exports = lib;
