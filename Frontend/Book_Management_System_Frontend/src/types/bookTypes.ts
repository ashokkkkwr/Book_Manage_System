export interface Book {
  bookId: string;
  title: string;
  isbn: string;
  description: string;
  publicationDate: string;
  publisherName: string;
  genreName: string;
  language: string;
  authorFullName: string;
  format: string;
  price: number;
  stockCount: number;
  bookImagePath: string;
  publisher: Publisher;
  genre: Genre;
  author: Author;
}

export interface Author {
  authorId: string;
  firstName: string;
  lastName: string;
}

export interface Genre {
  genreId: string;
  name: string;
}

export interface Publisher {
  publisherId: string;
  name: string;
}