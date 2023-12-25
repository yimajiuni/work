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
      <button class="m-1 btn btn-secondary" @click="grid.compact()">
        整列
      </button>
      <!-- {{ info }}-->
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
              <div>
                <div
                  v-for="{ id, title, image } in books[widget.bookIndex]"
                  :title="widget.bookIndex"
                  :key="id"
                  class="my-3"
                >
                  <img :src="image" alt="" class="card-img-top" />
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
            <div>
              <button class="btn" @click="deleteWidget(widget.id)">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            <!-- Display widget content or additional functionality here -->
            <test-modal-three class="ml-auto" @add-book="onAddBook">
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
import { GridStack } from "gridstack";
import TestModalThree from "@/components/TestModalThree.vue";

function makeInitialData(books) {
  // TODO: make sure that all the books in `bookIndex` are actually in `books`
  return [
    { id: "initWidget-1", w: 2, h: 2, bookIndex: 0 },
    { id: "initWidget-2", w: 2, h: 2, bookIndex: 1 },
    { id: "initWidget-3", w: 2, h: 2, bookIndex: 2 },
    { id: "initWidget-4", w: 2, h: 2, bookIndex: 3 },
  ];
}

function loadLocalStorage(books) {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem("gridstack-layout") || "null");
  } catch (error) {
    console.warn(error);
  }
  return (data && data.widgets) || makeInitialData(books);
}

export default {
  components: {
    TestModalThree,
  },
  props: {
    books: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {};
  },
  setup(props) {
    const grid = ref(null);
    const widgets = ref([]);
    const info = ref("");

    const nextBook = (widget) => {
      widget.a++;
      widget.b++;
    };

    const addNewWidget = () => {
      const uniqueId = Date.now().toString(16);

      const widget = {
        id: `widget-${uniqueId}`,
        w: Math.floor(Math.random() * 2) ? 2 : 4,
        h: Math.floor(Math.random() * 2) ? 2 : 4,
        a: widgets.value.length,
        b: widgets.value.length + 1,
      };
      widgets.value.push(widget);

      nextTick(() => {
        makeWidget(widget);
      });
    };

    const clearWidgets = () => {
      widgets.value = [];
      grid.value.removeAll();
    };

    const deleteWidget = (id) => {
      const index = widgets.value.findIndex((widget) => widget.id === id);
      if (index === -1) {
        return;
      }
      const elSelector = `#${id}`;
      grid.value.removeWidget(elSelector);
      widgets.value.splice(index, 1);
    };
    const saveLayout = () => {
      const layout = grid.value.save();
      console.log({ layout });
      localStorage.setItem(
        "gridstack-layout",
        JSON.stringify({
          widgets: widgets.value.map((widget) => {
            const { x, y, w, h } =
              layout.find((gridWidget) => gridWidget.id === widget.id) || {};
            return {
              ...widget,
              x,
              y,
              w,
              h,
            };
          }),
        })
      );
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
      this.$emit("add-book", book);
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
      widgets.value = loadLocalStorage(props.books);
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
      info,
      nextBook,
      addNewWidget,
      clearWidgets,
      deleteWidget,
      saveLayout,
      deleteLayout,
      compactGrid,
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
