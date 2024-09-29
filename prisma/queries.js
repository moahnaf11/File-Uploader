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

module.exports = {
  prisma,
  addUser,
  getUser,
  addFolder,
  getFolders,
  deleteFolder,
  editFolder
};
