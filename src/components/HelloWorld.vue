<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- do something more original -->
    <p>
      This is a vue.js V2 app to explore mathematically driven SVG graphics.
      Right now Apollonius is the only one working, mostly. Drag and drop to
      allow for changing the initial configuration for the drawing seems to be
      working pretty well. Other things to work on:
    </p>
    <ul>
      <li>Componentize the SVG canvas.</li>
      <li>Componentize the SVG drag and drop stuff.</li>
      <li>Add pan and zoom to the SVG canvas.</li>
      <li>Allow for recursive drawing inside chosen inner circles.</li>
      <li>Printing would be nice.</li>
      <li>Style this thing, make it look nicer.</li>
      <li>
        Add some kind of help to show how I came up with the math to do the
        drawing.
      </li>
      <li>
        Add some animated elements to the animated drawing so that one can see
        where the last circle was drawn.
      </li>
      <li>
        Maybe create a back end some time to save the settings use to create a
        particular drawing.
      </li>
      <li>Well, make all the other drawing things work also...</li>
      <li>Dream up new stuff to do...</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  text-align: initial;
}
a {
  color: #42b983;
}
</style>
