<template>
  <div class="posts">
    <div class="categories">
      <button
        @click.prevent="changeCategory(category.name)"
        v-for="(category, key) in categoryList"
        :key="key"
        class="category"
        :class="{active: isCategorySelected(category.name)}"
      >{{ category.name }} ({{ category.count }})</button>
    </div>
    <div class="posts" v-if="posts.length">
      <Post
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        :post="post"
        :isCurrentCategory="isCategorySelected"
        @changeCategory="changeCategory"
      />
    </div>
  </div>
</template>

<script>
import { slugify } from "@vpress/utils";

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
      }
    };
  },
  computed: {
    categoryList() {
      const list = {};
      this.$site.pages.forEach(post => {
        const postCategories = post.frontmatter.category;

        postCategories &&
          postCategories.forEach(c => {
            const k = slugify(c);
            if (!list[k]) {
              list[k] = {
                name: c,
                count: 1
              };
            } else {
              list[k].count++;
            }
          });
      });
      return list;
    },
    posts() {
      let currentPage = this.page ? this.page : this.$page.path;
      let posts = this.$site.pages
        .filter(post => {
          const pageMatch = post.path.match(
            new RegExp(`(${currentPage}).+(?=.*html)?`)
          );

          const selectedCategories = this.filter.category;
          const postCategories = post.frontmatter.category;

          const categoryMatch =
            selectedCategories.length === 0 ||
            (postCategories &&
              postCategories
                .map(slugify)
                .find(c => selectedCategories.includes(c)));
          return pageMatch && categoryMatch;
        })
        .sort((a, b) => {
          return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
        });
      return posts;
    }
  },
  methods: {
    isCategorySelected(name) {
      return name && this.filter.category.includes(slugify(name));
    },
    changeCategory(category) {
      const categoryKey = slugify(category);
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
    @apply 
      me-relative
      me-font-sans
  }

  .categories {
    @apply
      me-flex
      me-flex-wrap
      me-justify-between
  }
  .category {
    transition: all 300ms ease;
    @apply
      me-sticky
      me-pin-t
      me-p-2
      me-mx-2
      me-outline-none
      me-rounded-full
      me-text-black
      me-mb-2
  }
  .category.active {
    @apply
      me-bg-blue
      me-text-white
  }
}
</style>
