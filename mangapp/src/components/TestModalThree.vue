<template>
  <div>
    <input type="file" @change="onFileChange" />
    <button @click="processImage">Process Image</button>

    <div v-if="isValidImageFile !== null">
      <p>Image File Status: {{ isValidImageFile ? 'Valid' : 'Invalid' }}</p>
      <img :src="imageFileEncoded" alt="Processed Image" v-if="isValidImageFile" class="add-image"/>
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
              <div class="invalid-feedback"
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
import { postBook } from '@/services/bookService';
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
      imageFileEncoded: '',
      isValidImageFile: null,
    };
  },
  
  methods: {

    toDefault() {
      this.currentState = IS_DEFAULT;
    },
    
    onFileChange(event) {
      // Handle file change event

      console.log("サブミット-1");
      this.imageFile = event.target.files[0];
      this.processImage();
      this. onSubmit();
    },

    async processImage() {
      // Process the image and update state
      if (this.imageFile) {

      console.log("サブミット0");
        try {
          this.imageFileEncoded = await encodeImage(this.imageFile);
          this.isValidImageFile = true;
        } catch (err) {
          this.isValidImageFile = false;
          console.error(err.message);
        }
      } else {
        this.isValidImageFile = null;
      }
    },

    async onSubmit() {
      

      // 書籍データをJSON Serverに送信する
      //？一度画像選択後、また選択してキャンセルすると、はじめに選択したbase64データと空のデータがpostされる
      const response = await postBook(this.title, this.imageFileEncoded).catch((err) => {
        
        this.imageFileEncoded = false;
          console.error(err.message);
      });
      if (!response) return;
      this.toDefault();

      // TODO: Emitting a mock event, replace with actual data from the response
      const { id, title, image } = response.data;
      this.$emit('add-book', { id, title, image });

      // Resetting form-related data
      this.hideModal();
      this.imageFile = null;
      this.imageFileEncoded = '';
      this.title = '';
      this.validated = false;

      console.log('Form submission successful.');
    },
  },
};
</script>
<style scoped>

.add-image {
  width: 100%; /* Set the desired width */
  /*height: 100px; /* Set the desired height */
  object-fit: cover; /* Maintain aspect ratio and cover the container */
  margin: 5px; /* Add margin for spacing between images */
}
</style>
