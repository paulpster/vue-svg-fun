<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- do something more original -->
    <p style="width: 75%;text-align:left;">
      This is a vue.js V2 app to explore mathematically driven SVG graphics.<br />
      <router-link to="/circles">Apollonius</router-link> is working, mostly.
      Drag and drop to allow for changing the initial configuration for the
      drawing is working pretty well.<br /><router-link to="/grids"
        >Grids</router-link
      >
      are working with zoom (mouse wheel) and pan. There are a few more grids I
      want to add to the collection.<br />Other things to work on:
    </p>
    <ul>
      <li><b>DONE:</b> Componentize the SVG canvas.</li>
      <li><b>DONE:</b> Componentize the SVG drag and drop stuff.</li>
      <li><b>DONE:</b> Add pan and zoom to the SVG canvas.</li>
      <li>Allow for recursive drawing inside chosen inner circles.</li>
      <li>
        Printing would be nice. This works. but not quite the way I would like.
      </li>
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
        Maybe create a back end some time to save the settings used to create a
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
