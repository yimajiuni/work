<template>
  <div>
    <!--<div class="h-screen w-screen flex flex-col items-center bg-gray-100 p-10">
      <div class="flex justify-center">
        <button
          @click="resetGrid"
          class="btn border hover:bg-red-700 text-blue-500 font-bold py-2 px-4 rounded"
        >Reset</button>
        <button
          @click="saveGrid"
          class="btn ml-2 border hover:bg-blue-700 text-blue-500 font-bold py-2 px-4 rounded"
        >Save</button>
        <button
          @click="addWidget"
          class="btn ml-2 border hover:border-blue-700 text-blue-500
          font-bold py-2 px-4 rounded"
        >Add Widget</button>
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
    <!--<div class="grid-stack h-full w-full">
        <widget v-for="widget in widgets" :widget="widget" :key="widget.text"/>
      </div>
    </div>-->
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
            <div class="flex-grow-1 draggable"></div>
            <div>
              <button class="btn" @click="deleteWidget(widget.id)">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            <span class="text">{{ widget.id }}</span>
          </div>
        </div>
      </div>
  </div>
<div
      class="container shelf-books"
      role="main"
    >
      <div class="row">
        <div class="col" v-if="books.length === 0">
          <p class="text-center">登録された本はありません。</p>
        </div>
        <div class="col my-3"
          v-for="{ id, title, image } in books"
          :key="id"
          cols="6"
          md="4"
          lg="3"
        >
          <div
            class="card shelf-books__item"
            :img-src="image"
            img-alt=""
            :title="title"
            title-tag="h2"
            :aria-label="title"
          >
          <div class="text-right">
            <button class="btn" variant="outline-danger"
              @click="$emit('delete-book', id)">
                <i class="bi bi-trash"></i>
                削除
            </button>
          </div>
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
  /*import cloneDeep from 'lodash-es/cloneDeep';
  import Widget from '@/components/ShelfWidget.vue';*/
/*
  const initialWidgets = [
    {
      id: 'widget0',
      text: 'first widget',
      layout: {
        x: 0,
        y: 0,
        width: 4,
        height: 2,
      },
    },
    {
      id: 'widget1',
      text: 'second widget',
      layout: {
        x: 4,
        y: 0,
        width: 4,
        height: 4,
      },
    },
  ];*/
  /*
  let storageWidgets = localStorage.getItem('widgets');
  if (storageWidgets) {
    storageWidgets = JSON.parse(storageWidgets);
  } else {
    storageWidgets = cloneDeep(initialWidgets);
  }*/
  
  let grid;
  const gridOptions = {
    float: true,
    cellHeight: 100,
    handleClass: "draggable",
    disableResize: true,
    maxRow: 20,
  };
  const info = ref("");
  const initWidgets = [
    { id: "initWidget-1", w: 2, h: 2 },
    { id: "initWidget-2", w: 2, h: 2 },
    { id: "initWidget-3", w: 2, h: 2 },
    { id: "initWidget-4", w: 2, h: 2 },
  ];
  const widgets = ref(initWidgets);
  
  const loadLayout = () => {
    const loadedWidgets = JSON.parse(
      localStorage.getItem("gridstack-layout") || "[]"
    );
    if (loadedWidgets.length) {
      widgets.value = loadedWidgets;
    }
  };

  export default {
    /*components: {
      Widget,
    },*/
    props: {
      books: {
        type: Array,
        required: true,
      },
  },
    data() {
      return {
        rid: null,
        /*widgets: storageWidgets,*/
      };
    },/*
    methods: {
      resetGrid() {
        this.widgets = cloneDeep(initialWidgets);
        localStorage.setItem('widgets', JSON.stringify(this.widgets));
      },
      saveGrid() {
        this.grid.engine.nodes.forEach((node) => {
          const widget = this.widgets.find((w) => w.id === node.id);
          if (widget) {
            widget.layout = {
              x: node.x,
              y: node.y,
              width: node.width,
              height: node.height,
            };
          }
        });
        localStorage.setItem('widgets', JSON.stringify(this.widgets));
      },
      addWidget() {
        const index = this.widgets.length;
        const x = 4 * Math.round(index % 3);
        const y = Math.round(index / 3) * 4;
        const widget = {
          id: `widget${index}`,
          text: `widget ${index}`,
          layout: {
            x,
            y,
            width: 4,
            height: 4,
          },
        };
        this.widgets.push(widget);
        this.$nextTick(() => {
          debugger;
          this.grid.makeWidget(`#${widget.id}`);
        });
      },
    },
    mounted() {
      this.grid = GridStack.init({
        acceptWidgets: true,
      });
    },*/
    methods: {
      addNewWidget() {
      const uniqueId = Date.now().toString(16);
      const widget = {
        id: `widget-${uniqueId}`,
        w: Math.floor(Math.random() * 2) ? 2 : 4,
        h: Math.floor(Math.random() * 2) ? 2 : 4,
      };
      console.log("おっとっと");
      widgets.value.push(widget);
      nextTick(() => {
        makeWidget(widget);
      });
    },
 
    clearWidgets() {
      widgets.value = [];
      grid.removeAll();
    },

    deleteWidget(id) {
      const index = widgets.value.findIndex((widget) => widget.id === id);
      if (index === -1) {
        return;
      };
      console.log("おっとっと2");
      const elSelector = `#${id}`;
      grid.removeWidget(elSelector);
      widgets.value.splice(index, 1);
    },

    saveLayout() {
      const layouts = grid.save();
      localStorage.setItem("gridstack-layout", JSON.stringify(layouts));
    },

    deleteLayout() {
      localStorage.removeItem("gridstack-layout");
    },
  },

  mounted() {
    grid = GridStack.init(gridOptions);
    loadLayout();
    nextTick(() => {
      makeWidgets();
    });
    grid.on("dragstop", (_, element) => {
      const node = element.gridstackNode;
      info.value = `you just dragged node #${node?.id} to {x: ${node?.x}, y: ${node?.y}}`;
    });
  },
};
  const makeWidget = (widget) => {
    const elSelector = `#${widget.id}`;
    grid.makeWidget(elSelector);
    console.log("おっとっと3");
  };
  const makeWidgets = () => {
    widgets.value.forEach((widget) => {
      makeWidget(widget);
    });
  };
  </script>
  
  <style scoped>
  .draggable {
    cursor: move;
  }/*
  .shelf-books__item .card-body {
    padding: 0.75rem;
    background-color: #fafafa;
  }
  .text-right {
    margin-right:10rem;
  }
  .shelf-books__item .card-title {
    margin-top: 0.25rem;
    font-size: 1rem;
    text-align: center;
    overflow: hidden;
  }*/
  </style>