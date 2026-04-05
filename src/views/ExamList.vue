<template>
  <div class="container">
    <div class="header-action">
      <h1>Provas Disponíveis</h1>
    </div>

    <div v-if="isLoading" class="empty-state card">
      <h3>Carregando provas...</h3>
    </div>

    <div v-else-if="store.exams.length === 0" class="empty-state card">
      <ClipboardListIcon class="icon-large" />
      <h3>Nenhuma prova disponível</h3>
      <p class="text-muted">As provas criadas no Editor aparecerão aqui.</p>
    </div>

    <div v-else class="exam-grid">
      <div v-for="exam in store.exams" :key="exam.id" class="card exam-card">
        <div class="exam-info">
          <h3>{{ exam.title }}</h3>
          <p class="text-muted">
            <ClockIcon class="icon-small" /> {{ (exam.timePerQuestion * exam.questions.length) }} min totais
            &bull;
            {{ exam.questions.length }} questões
          </p>
        </div>
        <router-link :to="`/take/${exam.id}`" class="btn btn-primary">
          Realizar Prova
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useExamStore } from '../stores/examStore'
import { ClipboardListIcon, ClockIcon } from 'lucide-vue-next'

const store = useExamStore()
const isLoading = ref(true)

onMounted(async () => {
  await store.fetchExams()
  isLoading.value = false
})
</script>

<style scoped>
.header-action {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon-large {
  width: 48px;
  height: 48px;
  color: var(--border-color);
}

.icon-small {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
}

.exam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.exam-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

.exam-info h3 {
  margin-bottom: 0.5rem;
}

.exam-info p {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}
</style>
