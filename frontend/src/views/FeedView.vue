<template>
  <div class="feed-container">
    <header class="navbar">
      <h1>🎓 EduVaga</h1>
      <div>
        <button @click="goToProfile">Meu Perfil</button>
        <button @click="logout">Sair</button>
      </div>
    </header>

    <div class="content">
      <div class="new-post">
        <h3>Compartilhar uma vaga</h3>
        <textarea v-model="postContent" placeholder="Descreva a vaga (curso, instituição, prazo...)"></textarea>
        <input v-model="officialUrl" type="url" placeholder="Link oficial da instituição (obrigatório)" />
        <button @click="createPost">Publicar</button>
      </div>

      <div class="posts">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-header">
            <strong>{{ post.user.name }}</strong>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <p>{{ post.content }}</p>
          <a :href="post.officialUrl" target="_blank">🔗 Link oficial</a>
          <div class="post-actions">
            <button @click="likePost(post)">❤️ {{ post.likes.length }}</button>
            <span>💬 {{ post.comments.length }} comentários</span>
          </div>
          <div class="comments">
            <div v-for="comment in post.comments" :key="comment.id" class="comment">
              <strong>{{ comment.user.name }}:</strong> {{ comment.content }}
            </div>
            <div class="add-comment">
              <input v-model="newComments[post.id]" placeholder="Comentar..." />
              <button @click="addComment(post.id)">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const posts = ref([])
const postContent = ref('')
const officialUrl = ref('')
const newComments = ref({} as Record<number, string>)
const user = JSON.parse(localStorage.getItem('user') || '{}')
const API = 'http://localhost:3000'

const loadFeed = async () => {
  const res = await axios.get(`${API}/feed`)
  posts.value = res.data
}

const createPost = async () => {
  if (!postContent.value || !officialUrl.value) return alert('Preencha todos os campos!')
  await axios.post(`${API}/posts`, { content: postContent.value, officialUrl: officialUrl.value, userId: user.id })
  postContent.value = ''
  officialUrl.value = ''
  loadFeed()
}

const likePost = async (post: any) => {
  await axios.post(`${API}/posts/like`, { postId: post.id, userId: user.id })
  loadFeed()
}

const addComment = async (postId: number) => {
  if (!newComments.value[postId]) return
  await axios.post(`${API}/posts/comment`, { content: newComments.value[postId], postId, userId: user.id })
  newComments.value[postId] = ''
  loadFeed()
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
const goToProfile = () => router.push(`/profile/${user.id}`)
const logout = () => { localStorage.clear(); router.push('/') }

onMounted(loadFeed)
</script>

<style scoped>
.feed-container { min-height: 100vh; background: #f0f4f8; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #2563eb; color: white; }
.navbar h1 { margin: 0; }
.navbar button { margin-left: 0.5rem; padding: 0.5rem 1rem; background: white; color: #2563eb; border: none; border-radius: 6px; cursor: pointer; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.new-post { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
textarea { width: 100%; height: 80px; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; margin: 0.5rem 0; box-sizing: border-box; resize: none; }
input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; margin: 0.5rem 0; box-sizing: border-box; }
button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; }
.post-card { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.post-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.post-header span { color: #999; font-size: 0.85rem; }
a { color: #2563eb; font-size: 0.9rem; }
.post-actions { display: flex; gap: 1rem; margin-top: 0.75rem; align-items: center; }
.post-actions button { background: none; color: #555; border: 1px solid #ddd; }
.comments { margin-top: 1rem; }
.comment { padding: 0.5rem; background: #f8f9fa; border-radius: 6px; margin-bottom: 0.5rem; font-size: 0.9rem; }
.add-comment { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.add-comment input { margin: 0; }
.add-comment button { white-space: nowrap; }
</style>