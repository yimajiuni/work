User
<template>
  <div>
    <input type="file" @change="onFileChange" />
    <!---<button @click="processImage">Process Image</button>--->

    <div v-if="isValidImageFile !== null">
      <p>Image File Status: {{ isValidImageFile ? "Valid" : "Invalid" }}</p>
      <img
        :src="imageFileEncoded"
        alt="Processed Image"
        v-if="isValidImageFile"
        class="add-image"
      />
    </div>
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
      <div
        class="invalid-feedback"
        id="title-error"
        aria-label="タイトル入力エラー"
        role="alert"
      >
        タイトルを入力してください
      </div>
    </div>
  </div>
</template>

<script>
import { postBook } from "@/services/bookService";
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
      imageFile: null,
      imageFileEncoded: "",
      isValidImageFile: null,
      isValidTitle: false,
      isLoading: false,
      title: "",
    };
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

    async onFileChange(event) {
      this.isLoading = true;
      // Handle file change event

      console.log("サブミット-1");
      this.imageFile = event.target.files[0];
      await this.processImage();
      this.onSubmit();
      this.isLoading = false;
    },

    async onSubmit() {
      // 書籍データをJSON Serverに送信する
      this.isLoading = true;
      const response = await postBook(this.title, this.imageFileEncoded).catch(
        (err) => {
          this.imageFileEncoded = false;
          console.error(err.message);
        }
      );
      this.isLoading = false;

      console.log("サブミット1");
      if (!response) return;
      console.log("kore");

      // TODO: Emitting a event
      const { id, title, image } = response.data;
      this.$emit("add-book", { id, title, image });
      console.log("koko");
      console.log("kkok");
      this.title = "";
      this.validated = false;

      console.log("Form submission successful.");
      this.isLoading = false;
    },

    async processImage() {
      // Process the image and update state
      if (this.imageFile) {
        console.log("サブミット0");
        try {
          this.imageFileEncoded = await encodeImage(this.imageFile);
          this.isValidImageFile = true;
          this.onSubmit();
        } catch (err) {
          this.isValidImageFile = false;
          console.error(err.message);
          this.isLoading = false;
        }
      } else {
        this.isValidImageFile = null;
      }
    },
  },
};
</script>
<style scoped>
.add-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 5px;
}
</style>
