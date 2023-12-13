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
