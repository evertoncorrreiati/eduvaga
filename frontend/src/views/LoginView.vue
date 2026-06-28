<template>
  <div class="login-container">
    <div class="card">
      <h1>EduVaga</h1>
      <p>Sua proxima oportunidade esta aqui</p>
      <div v-if="isLogin">
        <h2>Entrar</h2>
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Senha" />
        <button @click="handleLogin">Entrar</button>
        <p>Nao tem conta? <span @click="isLogin = false">Cadastre-se</span></p>
      </div>
      <div v-else>
        <h2>Cadastro</h2>
        <input v-model="name" type="text" placeholder="Nome" />
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Senha" />
        <button @click="handleRegister">Cadastrar</button>
        <p>Ja tem conta? <span @click="isLogin = true">Entrar</span></p>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLogin = ref(true)
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const API = 'http://localhost:3000'

const handleLogin = async () => {
  try {
    const res = await axios.post(`${API}/auth/login`, { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/feed')
  } catch {
    error.value = 'Email ou senha incorretos'
  }
}

const handleRegister = async () => {
  try {
    await axios.post(`${API}/auth/register`, { name: name.value, email: email.value, password: password.value })
    isLogin.value = true
    error.value = ''
  } catch {
    error.value = 'Email ja cadastrado'
  }
}
</script>

<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f4f8; }
.card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
h1 { color: #2563eb; margin-bottom: 0.5rem; }
input { display: block; width: 100%; padding: 0.75rem; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
button { width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 0.5rem; font-size: 1rem; }
span { color: #2563eb; cursor: pointer; }
.error { color: red; margin-top: 0.5rem; }
</style>