const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// add user to db after sign up
async function addUser(firstname, lastname, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
      },
    });
    console.log(user);
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function getUser(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log(user);
    return user;
  } catch (err) {
    console.log(err);
  }
}
// add folder for particular user!
async function addFolder(id, name) {
  const folder = await prisma.folder.create({
    data: {
      name: name,
      user: {
        connect: {
          id: id,
        },
      },
    },
  });

  console.log("added folder", folder);
  console.log(id === folder.userId);
  return folder;
}

// get users folders
async function getFolders(id) {
  const folders = await prisma.folder.findMany({
    where: {
      userId: id,
    },
  });
  console.log("folders", folders);
  return folders;
}

// delete folder
async function deleteFolder(id) {
  const folder = await prisma.folder.delete({
    where: {
      id: id,
    },
  });

  console.log("deleted folder", folder);
  return folder;
}

// edit folder
async function editFolder(id, name) {
  const folder = await prisma.folder.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });

  console.log("edited folder", folder);
  return folder;
}

// get all files

async function getFiles (id) {
  const files = await prisma.folder.findUnique({
    where: {
      id: id      
    },
    include: {
      files: true
    }
  });

  console.log("files", files);
  return files;

}

// save file url to database
async function addFileUrl(url, id, filename, time, bytes, publicId) {
  const date = new Date(time);
  const file = await prisma.file.create({
    data: {
      name: filename,
      url: url,
      createdAt: time,
      size: bytes,
      publicId: publicId,
      folder: {
        connect: {
          id: id
        }
      }
    },
  })

  console.log("file uploaded", file);
  return file;

}

// get single file

async function getFile(id) {
  const file = await prisma.file.findUnique({
    where: {
      id: id
    }
  })

  console.log("single file", file);
  return file;
}

async function deleteFile(id) {
  const file = await prisma.file.delete({
    where: {
      id: id
    }
  })

  console.log("deleted file", file);
  return file;
}


module.exports = {
  prisma,
  addUser,
  getUser,
  addFolder,
  getFolders,
  deleteFolder,
  editFolder,
  getFiles,
  addFileUrl,
  getFile,
  deleteFile
};
