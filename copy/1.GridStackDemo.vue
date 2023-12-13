<template>
    <div>
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
  
  let grid;
  const gridOptions = {
    float: true,
    cellHeight: 100,
    handleClass: "draggable",
    disableResize: false,
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
  
  onMounted(() => {
    grid = GridStack.init(gridOptions);
    loadLayout();
    nextTick(() => {
      makeWidgets();
    });
    grid.on("dragstop", (_, element) => {
      const node = element.gridstackNode;
      info.value = `you just dragged node #${node?.id} to {x: ${node?.x}, y: ${node?.y}}`;
    });
  });
  
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
  
  const clearWidgets = () => {
    widgets.value = [];
    grid.removeAll();
  };
  
  const deleteWidget = (id) => {
    const index = widgets.value.findIndex((widget) => widget.id === id);
    if (index === -1) {
      return;
    }
    const elSelector = `#${id}`;
    grid.removeWidget(elSelector);
    widgets.value.splice(index, 1);
  };
  
  const saveLayout = () => {
    const layouts = grid.save();
    localStorage.setItem("gridstack-layout", JSON.stringify(layouts));
  };
  
  const deleteLayout = () => {
    localStorage.removeItem("gridstack-layout");
  };
  
  const makeWidget = (widget) => {
    const elSelector = `#${widget.id}`;
    grid.makeWidget(elSelector);
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
  }
  </style>
  