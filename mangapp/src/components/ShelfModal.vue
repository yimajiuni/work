<template>
  <div>
    <button
      class="btn btn-primary book-registration__show-btn"
      variant="outline-success"
      data-bs-toggle="modal"
      data-bs-target="#book-registration__modal"
    >
      <i class="bi bi-bookmark-plus"></i>書籍の登録
    </button>

    <div
      class="modal"
      ref="modal"
      id="book-registration__modal"
      hide-footer
      title="書籍の登録"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <form
            :validated="validated"
            @submit.prevent="onSubmit"
          >
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
            <div class="input-group mb-8">
              <label for="title">タイトル</label>
              <input
                id="title"
                v-model="title"
                required
                :state="isValidTitle"
                type="text"
                aria-describedby="title-error"
              />
              <div class="invalid-feedback"
                id="title-error"
                aria-label="タイトル入力エラー"
                role="alert"
              >
                タイトルを入力してください
              </div>
            </div>
            <div class="input-group mb-4">
              <label for="file-uploader">表紙画像</label>
              <!-- v-model="imageFile" -->
              <input
                id="file-uploader"
                accept="image/*"
                browse-text="参照"
                type="file"
                class="form-control mb-2"
                drop-placeholder="ファイルをここにドラッグ&ドロップしてください"
                placeholder="画像ファイルを選択してください"
                required
                :state="isValidImageFile"
                aria-describedby="file-uploader-error"
              />
              <div
                class="invalid-feedback"
                id="file-uploader-error"
                :state="isValidImageFile"
                aria-label="画像ファイルのエラー"
                role="alert"
              >
                この画像ファイルは選択できません。
              </div>
              <img
                :blank="!imageFileEncoded"
                blank-color="#ccc"
                height="80"
                :src="imageFileEncoded"
                alt="アップロード画像"
              />
            </div>
            <p
              v-if="isFailed"
              class="text-danger"
              role="alert"
            >
              登録に失敗しました。
            </p>
            <button
              class="btn btn-primary mt-3"
              :disabled="isPosting"
              type="submit"
              variant="outline-success"
              @click="onClick"
            >
              保存する
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postBook } from '@/services/bookService';

// 状態の定数
const IS_DEFAULT = 'IS_DEFAULT';
const IS_POSTING = 'IS_POSTING'; // データを送信中
const IS_FAILED = 'IS_FAILED'; // データを送信できなかった

const encodeImage = (file) => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  });
};

export default {
  data() {
    return {
      currentState: IS_DEFAULT,
      imageFile: null,
      imageFileEncoded: '',
      isValidImageFile: null,
      postBookError: null,
      title: '',
      validated: false,
    };
  },

  computed: {
    isValidTitle() {
      if (!this.validated || !this.title) return null;
      return this.title.trim().length > 0;
    },
    isValidInputs() {
      return this.isValidTitle && this.isValidImageFile;
    },
    isPosting() {
      return this.currentState === IS_POSTING;
    },
    isFailed() {
      return this.currentState === IS_FAILED;
    },
  },

  watch: {
    imageFile() {
      if (this.imageFile) {
        encodeImage(this.imageFile)
          .then((res) => {
            this.imageFileEncoded = res;
            this.isValidImageFile = true;
          })
          .catch((err) => {
            this.isValidImageFile = false;
            console.error(err.message);
          });
      } else {
        this.isValidImageFile = null;
      }
    },
  },

  methods: {
    // 状態を変更する
    toDefault() {
      this.currentState = IS_DEFAULT;
    },
    toPosting() {
      this.currentState = IS_POSTING;
    },
    toFailed() {
      this.currentState = IS_FAILED;
    },

    onClick() {
      this.validated = true;
    },
    async onSubmit() {
      if (!this.isValidInputs) return;

      this.toPosting();

      // 書籍データをJSON Serverに送信する
      const response = await postBook(this.title, this.imageFileEncoded).catch((err) => {
        this.toFailed();
        console.error(err.message);
      });

      if (!response) return;
      this.toDefault();

      // TODO: カスタムイベントを発行する
      const { id, title, image } = response.data;
      this.$emit('add-book', { id, title, image });

      this.hideModal();
      this.imageFile = null;
      this.imageFileEncoded = '';
      this.title = '';
      this.validated = false;
    },
    hideModal() {
      this.$bvModal.hide('book-registration');
    },
  },
};
</script>

<style scoped>
.book-registration__show-btn {
  font-size: 1.2rem;
}
</style>
