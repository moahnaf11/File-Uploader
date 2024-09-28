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
          userId: id
        }
      } 
    },
  });

  console.log(folder);
  return folder;
}

module.exports = {
  prisma,
  addUser,
  getUser,
  addFolder,
};
