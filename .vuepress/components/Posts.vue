<template>
  <div>
    <div class="categories">
      <button
        @click.prevent="changeCategory(key)"
        v-for="(name, key) in categoryList"
        :key="key"
        class="category"
      >{{ name }}</button>
    </div>
    <div class="posts" v-if="posts.length">
      <router-link :key="post.path" :to="post.path" class="post" v-for="post in posts">
        <div>
          <img :src="$withBase(getImage(post))" alt>
        </div>
        <h2>{{post.frontmatter.title}}</h2>
        <p>{{post.frontmatter.description}}</p>
        <small
          :title="post.frontmatter.date | moment('LLLL')"
        >{{post.frontmatter.date | moment("calendar")}}</small>
        <hr>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getImage, slugify } from "@vpress/utils";

export default {
  props: {
    page: {
      type: String
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filter: {
        category: this.categories
      },
      categoryList: {}
    };
  },
  computed: {
    posts() {
      let currentPage = this.page ? this.page : this.$page.path;
      let posts = this.$site.pages
        .filter(post => {
          const pageMatch = post.path.match(
            new RegExp(`(${currentPage}).+(?=.*html)?`)
          );

          const postCategories = post.frontmatter.category;

          postCategories &&
            postCategories.forEach(c => {
              if (!this.categoryList[slugify(c)]) {
                this.categoryList[slugify(c)] = c;
              }
            });

          const categoryMatch =
            this.filter.category.length === 0 ||
            (postCategories &&
              this.filter.category.includes(postCategories.map(slugify)));
          return pageMatch && categoryMatch;
        })
        .sort((a, b) => {
          return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
        });
      return posts;
    }
  },
  methods: {
    getImage,
    changeCategory(categoryKey) {
      const index = this.filter.category.indexOf(categoryKey);
      index >= 0
        ? this.filter.category.splice(index, 1)
        : this.filter.category.push(categoryKey);
    }
  }
};
</script>
<style lang="stylus" scoped>
@css {
  .posts {
    @apply me-font-sans;
  }
  .post {
    @apply me-no-underline me-text-black;
  }
}
</style>
