<template>
  <b-container
    class="shelf-books"
    role="main"
  >
    <b-row>
      <b-col v-if="books.length === 0">
        <p class="text-center">登録された本はありません。</p>
      </b-col>
      <b-col
        v-for="{ id, title, image } in books"
        :key="id"
        class="my-3"
        cols="6"
        md="4"
        lg="3"
      >
        <b-card
          class="shelf-books__item"
          :img-src="image"
          img-alt=""
          :title="title"
          title-tag="h2"
          :aria-label="title"
        >
       <div class="text-right">
            <!-- TODO: 以下のb-buttonをクリックしたときに、カスタムイベントを発行する -->
            <!-- イベント名は 'delete-book' としてください -->
            <b-button variant="outline-danger"
            @click="$emit('delete-book', id)">
              <b-icon-trash></b-icon-trash>
              削除
              </b-button>
              </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {
  BButton,
  BCard,
  BCol,
  BContainer,
  BIconTrash,
  BRow,
} from 'bootstrap-vue';

export default {
  components: {
    BButton,
    BCard,
    BCol,
    BContainer,
    BIconTrash,
    BRow,
  },
  props: {
    books: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.shelf-books__item .card-body {
  padding: .75rem;
  background-color: #fafafa;
}

.shelf-books__item .card-title {
  margin-top: .25rem;
  font-size: 1rem;
  text-align: center;
  overflow: hidden;
}
</style>
