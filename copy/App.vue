<template>
  <div id="app">
    <shelf-header @add-book="onAddBook"></shelf-header>
    <shelf-message></shelf-message>
    <!-- TODO: ShelfBooksコンポーネントからdelete-bookイベントが発行されたら、onDeleteBookメソッドが呼び出されるようにする -->
    <shelf-books :books="books"
    @delete-book="onDeleteBook"></shelf-books>
  </div>
</template>

<script>
import ShelfBooks from '@/components/ShelfBooks.vue';
import ShelfHeader from '@/components/ShelfHeader.vue';
import ShelfMessage from '@/components/ShelfMessage.vue';
import { getBooks, deleteBook } from '@/services/bookService';

export default {
  components: { ShelfBooks, ShelfHeader, ShelfMessage },

  data() {
    return { books: [] };
  },

  async created() {
    this.books = await getBooks().catch((err) => {
      console.error(err.message);
      this.makeToast('エラーの発生', '書籍データを取得できませんでした。');
    });
  },

  methods: {
    makeToast(title, msg) {
      this.$bvToast.toast(msg, {
        autoHideDelay: 5000,
        title,
        variant: 'danger',
      });
    },
    onAddBook(book) {
      this.books.push(book);
    },
    async onDeleteBook(id) {
      const response = await deleteBook(id).catch((err) => console.error(err.message));

      if (!response || response.status !== 200) {
        this.makeToast('エラーの発生', '書籍を削除できませんでした。');
      }

      this.books = this.books.filter((book) => book.id !== id);
    },
  },
};
</script>
