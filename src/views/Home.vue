/* eslint-disable no-mixed-spaces-and-tabs */
<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png">
	</div>
	<h3>Articles</h3>
	<div v-for="article in articles" v-bind:key="article.id">
		<div class="article">
			<p class="title">Title: {{article.title}}</p><br />
			<p class="body">{{article.text}}</p><br />
			<button @click="deleteArticle(article.id)">Delete</button>
			<button @click="editArticle(article.id, article.title, article.text)" >Edit article</button>
		</div>
	</div>
	<div v-if="isEditingArticle" class="updateModal">
		<input type="text" v-model="articleToEdit.title"><br />
		<input type="text" v-model="articleToEdit.text"><br />
		<button @click="updateArticle">Submit</button>
	</div>
	
	<button @click="showModal">Post something</button>


	<div id="modal" v-if="isAddingArticle">
		<input type="text" placeholder="Title of the Article" v-model="newArticle.title"><br />
		<input type="text" placeholder="Say something" v-model="newArticle.text"><br />
		<button @click="addNewArticle">Submit</button>
	</div>
</template>

<script>
// @ is an alias to /src
const io = require('socket.io-client');


export default {
  	name: 'Home',
  	data(){
		return {
			socket: io('localhost:3000'),
			articles: [],
			newArticle: {
				title: '',
				text: '',
				timestamp: Date.now()
			},
			articleToEdit: {
				id: '',
				title: '',
				text: '',
				timestamp: Date.now()
			},
			isAddingArticle: false,
			isEditingArticle: false,

		}
	},
	methods: {
		updateArticle(){
			this.socket.emit('updateArticle', this.articleToEdit);
			this.isEditingArticle = false;
		},
		editArticle(id, title, text){
			this.isEditingArticle = true;
			this.articleToEdit.id = id;
			this.articleToEdit.title = title;
			this.articleToEdit.text = text;
		},
		deleteArticle(id){
			this.socket.emit('deleteArticle', id);
		},
		addNewArticle(){
			this.socket.emit('addNewArticle', this.newArticle)
			this.isAddingArticle = false;
			this.newArticle.title = '',
			this.newArticle.body = ''
		},
		showModal(){
			this.isAddingArticle = true;
		}
	},
 	mounted(){
		this.socket.on('connect', function() {
			console.log('Connected to webSocket');
		})

		this.socket.on('articlesUpdated', (results) => {
			this.articles = results;
		})

		this.socket.emit('loadArticles');
	}
}
</script>
<style>
	.article {
		border: 1px solid rgb(241, 189, 92);
		padding: 20px;
	}
	.title {
		font-family: 'Courier New', Courier, monospace;
		background: rgb(212, 211, 211);
		display: inline-block;
	}

	.body{ 
		background: rgba(50, 163, 238, 0.459);
		color: white;
		font-family: sans-serif;
		display: inline-block;
	}
</style>