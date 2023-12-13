<template>
<div>
  <div id="app" class="h-screen w-screen flex flex-col items-center bg-gray-100 p-10">
    <div class="flex justify-center">
      <button
        @click="resetGrid"
        class="btn border bg-red-500 hover:bg-red-700 text-blue-500 font-bold py-2 px-4 rounded"
      >Reset</button>
      <button
        @click="saveGrid"
        class="btn ml-2 border bg-blue-500 hover:bg-blue-700 text-blue-500 font-bold py-2 px-4 rounded"
      >Save</button>
      <button
        @click="addWidget"
        class="btn ml-2 border border-blue-500 hover:border-blue-700 text-blue-500
        font-bold py-2 px-4 rounded"
      >Add Widget</button>
    </div>

    <div class="grid-stack h-full w-full">
      <widget v-for="widget in widgets" :widget="widget" :key="widget.text"/>
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
import 'gridstack/dist/gridstack.min.css';
import cloneDeep from 'lodash-es/cloneDeep';
import Widget from '@/components/ShelfWidget.vue';
import { GridStack } from 'gridstack';

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
];
let storageWidgets = localStorage.getItem('widgets');
if (storageWidgets) {
  storageWidgets = JSON.parse(storageWidgets);
} else {
  storageWidgets = cloneDeep(initialWidgets);
}

export default {
  components: {
    Widget,
  },
  props: {
    books: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      rid: null,
      widgets: storageWidgets,
    };
  },
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
      // By default grid stack has 12 column layout.
      // We devide by 3 to get the appropriate row/column positioning
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
  },
};
</script>

<style scoped>
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
}
</style>
