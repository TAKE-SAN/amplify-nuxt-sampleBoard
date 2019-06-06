<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        簡易掲示板
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-layout column wrap>
            <v-flex>
              <v-text-field v-model="title" type="text" label="タイトル"/>
            </v-flex>
            <v-flex>
              <v-textarea
                name="input-7-1"
                label="投稿内容"
                v-model="content"
                hint="投稿する内容を書いてくれよな！"
              ></v-textarea>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          flat
          nuxt
          @click="createPost"
        >
          投稿
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-for="(post, index) in posts" :key="index">
      <v-card-title primary-title class="headline">
        {{ post.title }}
      </v-card-title>
      <v-card-text>
        {{ post.content }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { listPosts } from '../graphql/queries';
import { createPost } from '../graphql/mutations';
import { onCreatePost } from '../graphql/subscriptions';

export default {
  data () {
    return {
      posts: [],
      title: '',
      content: ''
    }
  },

  async mounted () {
    try {
      const posts = await API.graphql(graphqlOperation(listPosts));
      this.posts = posts.data.listPosts.items;
    } catch (e) {
      console.log(e);
    }

    API.graphql(graphqlOperation(onCreatePost)).subscribe({
      next: (eventData) => {
        console.log('eventData: ', eventData)
        const post = eventData.value.data.onCreatePost
        this.posts = [...this.posts.filter(content => {
          return (content.title !== post.title)
        }), post]
      }
    });
  },

  methods: {
    async createPost () {

      // バリデーションチェック
      if (this.title === '' || this.content === '') return;

      try {
        const postInput = {title: this.title, content: this.content};
        this.posts.push(postInput);
        this.title = '';
        this.content = '';
        await API.graphql(graphqlOperation(createPost, { input: postInput}));
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>













