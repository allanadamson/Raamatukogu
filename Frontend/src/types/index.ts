export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
}

export interface ApiResponse {
  data: Book[];
  // Lisa siia muud väljad, kui bäkend saadab nt paginationi infot
}   