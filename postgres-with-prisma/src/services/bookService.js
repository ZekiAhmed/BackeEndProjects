const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function addBook(title, publisedDate, authorId) {
  try {
    const newlyCreatedBook = await prisma.book.create({
      data: {
        title,
        publisedDate,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true },
    });

    return newlyCreatedBook;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getAllBooks() {
  try {
    const books = await prisma.book.findMany({
      include: { author: true },
    });

    return books;
  } catch (e) {
    throw e;
  }
}

async function getBookById(id) {
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!book) {
      throw new Error(`Book with id ${id} not found`);
    }

    return book;
  } catch (e) {
    throw e;
  }
}


module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };