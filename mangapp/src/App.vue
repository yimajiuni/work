<script>
import ShelfHeader from '@/components/ShelfHeader.vue';
import GridPics from '@/components/GridPics.vue';
import { getBooks, deleteBook } from '@/services/bookService';
export default {
  components: { ShelfHeader, GridPics },

/*ページ読み込みと同時にdb.jsonの本ロード*/
  data() {
    return { books: [] };
  },
  async created() {
    try {
      this.books = await getBooks()
    }catch(err) {
      console.error(err.message);
      /*this.makeAlert('エラーの発生', '書籍データを取得できませんでした。');*/
    };
  },
/*トーストメッセージ*/
  methods: {
    makeAlert(title, msg) {
      window.alert(`${title}\n\n${msg}`);
    },
/*本の追加...GridPicsにてイベント発行されたら本が追加される*/
/*GridPicsの関数と合算すればいいのでは？*/
    async onAddBook(book) {
      this.books.push(book);
      console.log("ついか");
      this.makeAlert('成功', '書籍が追加されました。');

    },

    async onDeleteBook(id) {
      try {
        const response = await deleteBook(id);
        if (!response || response.status !== 200) {
          this.makeAlert('エラーの発生', '書籍を削除できませんでした。');
        }
        this.books = this.books.filter((book) => book.id !== id);
      } catch (err) {
        console.error(err.message);
        this.makeAlert('エラーの発生', '書籍を削除できませんでした。');
      }
    },
  },
};
</script>

<template>
  <div>
    <shelf-header></shelf-header>
    <!-- TODO: ShelfBooksコンポーネントからdelete-bookイベントが発行されたら、onDeleteBookメソッドが呼び出されるようにする -->
    <grid-pics :books="books"
      @delete-book="onDeleteBook" @add-book="onAddBook"></grid-pics>
  </div>
</template>
