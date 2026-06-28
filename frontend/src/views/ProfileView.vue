<template>
  <div class="profile-container">
    <header class="navbar">
      <h1>🎓 EduVaga</h1>
      <div>
        <button @click="router.push('/feed')">Feed</button>
        <button @click="logout">Sair</button>
      </div>
    </header>

    <div class="content" v-if="profile">
      <div class="profile-card">
        <div class="avatar">{{ profile.name?.charAt(0).toUpperCase() }}</div>
        <h2>{{ profile.name }}</h2>
        <p>{{ profile.email }}</p>
        <p v-if="profile.bio">{{ profile.bio }}</p>
        <div class="stats">
          <span><strong>{{ profile.posts?.length }}</strong> posts</span>
          <span><strong>{{ profile.followers?.length }}</strong> seguidores</span>
          <span><strong>{{ profile.following?.length }}</strong> seguindo</span>
        </div>
        <button v-if="!isOwner" @click="toggleFollow">
          {{ isFollowing ? 'Deixar de seguir' : 'Seguir' }}
        </button>
      </div>

      <div class="posts">
        <h3>Publicações</h3>
        <div v-for="post in profile.posts" :key="post.id" class="post-card">
          <p>{{ post.content }}</p>
          <a :href="post.officialUrl" target="_blank">🔗 Link oficial</a>
          <span class="date">{{ formatDate(post.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const profile = ref(null as any)
const user = JSON.parse(localStorage.getItem('user') || '{}')
const API = 'http://localhost:3000'

const isOwner = computed(() => profile.value?.id === user.id)
const isFollowing = computed(() => profile.value?.followers?.some((f: any) => f.followerId === user.id))

const loadProfile = async () => {
  const res = await axios.get(`${API}/users/${route.params.id}`)
  profile.value = res.data
}

const toggleFollow = async () => {
  await axios.post(`${API}/follow`, { followerId: user.id, followingId: profile.value.id })
  loadProfile()
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
const logout = () => { localStorage.clear(); router.push('/') }

onMounted(loadProfile)
</script>

<style scoped>
.profile-container { min-height: 100vh; background: #f0f4f8; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #2563eb; color: white; }
.navbar h1 { margin: 0; }
.navbar button { margin-left: 0.5rem; padding: 0.5rem 1rem; background: white; color: #2563eb; border: none; border-radius: 6px; cursor: pointer; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.profile-card { background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 1.5rem; }
.avatar { width: 80px; height: 80px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem; }
.stats { display: flex; justify-content: center; gap: 2rem; margin: 1rem 0; }
button { padding: 0.5rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 0.5rem; }
.post-card { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
a { color: #2563eb; display: block; margin: 0.5rem 0; }
.date { color: #999; font-size: 0.85rem; }
</style>