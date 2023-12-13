
<template>
  <div>
    <button @click="testEncodeImage">Test Encode Image</button>
  </div>
</template>


<script>


export default {
  methods: {
    encodeImage(file) {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
        console.log("エンコ");
      });
    },
    async testEncodeImage() {
      // For testing purposes, you can create a File object (replace this with an actual file input)
      const file = new File(["sample content"], "sample.txt", { type: "text/plain" });

      try {
        const result = await this.encodeImage(file);
        console.log("Encoded result:", result);
      } catch (error) {
        console.error("Error encoding image:", error.message);
      }
    },
  },
};
</script>

<style scoped>
.book-registration__show-btn {
  font-size: 1.2rem;
}
</style>
