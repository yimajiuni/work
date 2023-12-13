<template>
  <div>
    <!--<div class="h-screen w-screen flex flex-col items-center bg-gray-100 p-10">
      <div class="flex justify-center">
      </div></div>
    <div class="h-full w-full">
      </div>-->
    <div>
      <button class="m-1 btn btn-secondary" @click="addNewWidget()">
        ウィジェット追加
      </button>
      <button class="m-1 btn btn-secondary" @click="clearWidgets()">
        クリア
      </button>
      <button class="m-1 btn btn-secondary" @click="saveLayout()">
        レイアウトを保存
      </button>
      <button class="m-1 btn btn-secondary" @click="deleteLayout()">
        レイアウトを削除
      </button>
      <button class="m-1 btn btn-secondary" @click="grid.compact()">整列</button>
      {{ info }}
    </div>

    <div class="grid-stack">
      <div
        v-for="widget in widgets"
        :id="widget.id"
        :key="widget.id"
        :gs-id="widget.id"
        :gs-x="widget.x"
        :gs-y="widget.y"
        :gs-h="widget.h"
        :gs-w="widget.w"
      >
        <div class="grid-stack-item-content card shadow">
          <div class="bg-light d-flex">
            <div class="flex-grow-1 draggable">


<!-- Shelfbook Functionality -->
<div class="shelf-books" role="main">
  <!-- Display books for each widget -->
  <div>
    <div class="col" v-if="books.length === 0">
          <p class="text-center">登録された本はありません。</p>
    </div>
    <div
      v-for="{ id, title, image } in books"
      :key="id"
      class="my-3"
    >
      <div class="col-md-4 col-lg-3">
        <div class="shelf-books__item">
          <img
            :src="image"
            alt=""
            class="card-img-top"
          />
          <div class="card-body">
            <h2 class="card-title" :aria-label="title">{{ title }}</h2>
            <div class="text-end">
              <button
                class="btn btn-outline-danger"
                @click="$emit('delete-book', id)"
              >
                <i class="bi-trash"></i>
                削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

            </div>
            <div>
              <button class="btn" @click="deleteWidget(widget.id)">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            <!-- Display widget content or additional functionality here -->
            <test-modal-three
            class="ml-auto"
            @add-book="onAddBook"
          >
          </test-modal-three>
            <span class="text">{{ widget.id }}</span>
          </div>
        </div>
      </div>
  </div>

  </div>
  </template>

  <script>
  import { onMounted, nextTick, ref } from "vue";
  import "gridstack/dist/gridstack.min.css";
  import "gridstack/dist/gridstack-extra.css";
  import "gridstack/dist/gridstack-extra.min.css";
  import { GridStack } from 'gridstack';
  import TestModalThree from '@/components/TestModalThree.vue';

  export default {
    components: {
     TestModalThree,
    },
  props: {
    books: {
      type: Array,
      required: true,
    },
  },/*
  data() {
    return {
      info: "",
    };
  },*/
  setup() {
    
    const grid = ref(null);
    const widgets = ref([
      { id: "initWidget-1", w: 2, h: 2},
      { id: "initWidget-2", w: 2, h: 2},
      { id: "initWidget-3", w: 2, h: 2},
      { id: "initWidget-4", w: 2, h: 2},
    ]);
    const info = ref("");

    const loadLayout = () => {
      const loadedWidgets = JSON.parse(localStorage.getItem("gridstack-layout") || "[]");
      if (loadedWidgets.length) {
        widgets.value = loadedWidgets;
      }
    };

    const addNewWidget = () => {
      const uniqueId = Date.now().toString(16);
      const widget = {
        id: `widget-${uniqueId}`,
        w: Math.floor(Math.random() * 2) ? 2 : 4,
        h: Math.floor(Math.random() * 2) ? 2 : 4,
      };
      widgets.value.push(widget);
      nextTick(() => {
        makeWidget(widget);
      });
    };

    const clearWidgets= () => {
      widgets.value = [];
      grid.value.removeAll();
      console.warn("おっとっと１")
    };

    const deleteWidget= (id) =>  {
      const index = widgets.value.findIndex((widget) => widget.id === id);
      if (index === -1) {
        return;
      };
      console.log("おっとっと2");
      const elSelector = `#${id}`;
      grid.value.removeWidget(elSelector);
      widgets.value.splice(index, 1);
    };

    const saveLayout = () => {
      const layouts = grid.value.save();
      console.log("おっとっと3");
      localStorage.setItem("gridstack-layout", JSON.stringify
      (layouts));
    };

    const deleteLayout = () => {
      localStorage.removeItem("gridstack-layout");
    };

    const makeWidget = (widget) => {
      const elSelector = `#${widget.id}`;
      grid.value.makeWidget(elSelector);
    };

    const makeWidgets = () => {
      widgets.value.forEach((widget) => {
        makeWidget(widget);
      });
    };

    const compactGrid = () => {
      grid.value.compact();
    };

  const onAddBook = async (book) => {
    this.books.push(book);
      this.$emit('add-book', book);
      console.log("追加");
    };

    onMounted(() => {
      grid.value = GridStack.init({
        float: true,
        cellHeight: 100,
        handleClass: "draggable",
        disableResize: false,
        maxRow: 20,
        acceptWidgets: true,
      });

      loadLayout();
      nextTick(() => {
        makeWidgets();
      });
      grid.value.on("dragstop", (_, element) => {
        const node = element.gridstackNode;
        info.value = `you just dragged node #${node?.id} to {x: ${node?.x}, y: ${node?.y}}`;
      });
    });

    return {
      grid,
      widgets,
      addNewWidget,     
      addNewWidget,
      clearWidgets,
      deleteWidget,
      saveLayout,
      deleteLayout,
      compactGrid,
      info,
      onAddBook,
    };
  },
};


  </script>
  
  <style scoped>
  .draggable {
    cursor: move;
  }
  </style>
  