import axios from 'axios';

const dbAccessor = axios.create({
  // baseURLは、単体テストをするための設定
  baseURL: import.meta.env.VUE_APP_HOST_DB || '',
});

export const getBooks = async () => {
  const { data } = await dbAccessor.get('/books');
  return data;
};
export const postBook = (title, image) => dbAccessor.post('/books', { title, image });
export const deleteBook = (id) => dbAccessor.delete(`/books/${id}`);


/*import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const dbAccessor = axios.create({
  baseURL: import.meta.env.VUE_APP_HOST_DB || '',
});

export const getBooks = async () => {
  const { data } = await dbAccessor.get('/books');
  return data;
};

export const postBook = (title, image) => {
  // Generate a UUID using uuid
  const uuid = uuidv4();

  // Use the generated UUID in the post request
  return dbAccessor.post('/books', { id: uuid, title, image });
};

export const deleteBook = (id) => dbAccessor.delete(`/books/${id}`);
*/