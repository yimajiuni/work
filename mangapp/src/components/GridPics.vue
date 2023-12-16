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
      v-for="{ id, title, image } in widget.books|| books.slice(widget.a, widget.b)"
      :key="id"
      class="my-3"
    ><!--<p>{{ widget.a,widget.b }}</p>-->
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
      required: false,
    },
  },
  data() {
    return {
    };
  },
  setup(props) {
//setup内のmethodからpropsのbooksにアクセスするためにpropsをsetupに渡し、booksにはpropsを代入  
    const grid = ref(null);
    const widgets = ref([
      { id: "initWidget-1", w: 2, h: 2, a: 0, b: 1, },
      { id: "initWidget-2", w: 2, h: 2, a: 1, b: 2  },
      { id: "initWidget-3", w: 2, h: 2, a: 2, b: 3  },
      { id: "initWidget-4", w: 2, h: 2, a: 3, b: 4  },
    ]);
    const info = ref("");
    
  const nextBook = (widget) => {
    widget.a++;
    widget.b++;
    console.log("Updated a, b:", widget.a, widget.b);//ここ◯
  };

  const loadLayout = () => {
      const savedData = JSON.parse(localStorage.getItem("gridstack-layout") || "[]");
      if (savedData.layouts) {
    grid.value.load(savedData.layouts); // Load the layout data into GridStack
  }

  if (savedData.widgets) {
    widgets.value = savedData.widgets; // Update your custom widget data
  }
    };

    const addNewWidget = () => {
      const uniqueId = Date.now().toString(16);
      console.log(`おっとっと`,props.books);

      
      const widget = {
        id: `widget-${uniqueId}`,
        w: Math.floor(Math.random() * 2) ? 2 : 4,
        h: Math.floor(Math.random() * 2) ? 2 : 4,
        a: widgets.value.length,
        b: widgets.value.length+1,
        
      };
      widgets.value.push(widget);
      
      //addwidget後のdisplay
      nextTick(() => {
        makeWidget(widget);
        /*nextBook(widget);*/
        console.log("After nextBook:", widget.a, widget.b);//ここ◯

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
//books arrayの値に対して2つの値を切り出す処理を繰り返す
    const widgetsWithBooks = widgets.value.map((widget) => {
    const subsetStart = widget.a;
    const subsetEnd = widget.b;
    const subset = props.books.slice(subsetStart, subsetEnd);
    console.log("おっとっと3");
    return {
      ...widget,
      books: subset,
      a: subsetStart, // Include the 'a' property in the widget
      b: subsetEnd,   // Include the 'b' property in the widget
    };
  });
//変形後レイアウト上書き保存できない＞このラインで出来る、がデータがダブル
  //新規絵をポスト後保存できない(サーバーに保存はされている)
//セーブの仕方の問題
  const layoutData = {
    layouts: grid.value.save(), // Save the layout data generated by GridStack
    widgets: widgetsWithBooks,   // Save your custom widget data
  };

  localStorage.setItem("gridstack-layout", JSON.stringify(layoutData));
};

    const deleteLayout = () => {
      localStorage.removeItem("gridstack-layout");
      console.log("おっとっと4");
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
      console.log("おっとっと追加");
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
//ロード後のレイアウトと絵
      loadLayout();
      nextTick(() => {
        makeWidgets();
      });
      grid.value.on("dragstop", (_, element) => {
        const node = element.gridstackNode;
        info.value = `you just dragged node #${node?.id} to {x: ${node?.x}, y: ${node?.y}}`;
      });
    });
//any variable, function, or reactive object that you want to use in the template or
// expose to other parts of your component needs to be included in the return object of the setup function. 
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
  
