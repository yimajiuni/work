<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <button @click="triggerWatcher">Trigger Watcher</button>

    <div>
      <p>Image File: {{ imageFile }}</p>
      <p>Image File Encoded: {{ imageFileEncoded }}</p>
      <p>IsValidImageFile: {{ isValidImageFile }}</p>
    </div>
  </div>
</template>

<script>
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
  watch: {
    imageFile() {
      console.log('Watcher triggered');
      if (this.imageFile) {
        encodeImage(this.imageFile)
          .then((res) => {
            console.log('Image encoded successfully:', res);
            this.imageFileEncoded = res;
            this.isValidImageFile = true;
          })
          .catch((err) => {
            this.isValidImageFile = false;
            console.error(err.message);
          });
      } else {      
        console.log('Image file is null');
        this.isValidImageFile = null;
      }
    },
  },
  methods: {
    handleFileChange(event) {//event object contains information about the selected file(s). 
      this.imageFile = event.target.files[0];//retrieves the first selected file
    },//The selected file is assigned to the imageFile data property.
    triggerWatcher() {// simulates a change in the imageFile by creating a new File object(you can replace this with actual user interactions)
      //sample contentはuploadした絵 sample.txtはそのタイトル type:
      this.imageFile = new File(['sample content'], 'sample.txt', { type: 'text/plain' });
    },
  },
};
</script>
