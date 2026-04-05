<template>
  <div class="container">
    <div class="header-action">
      <div>
        <router-link to="/editor" class="btn btn-outline" style="margin-bottom: 1rem;">
          <ArrowLeftIcon class="icon-small" /> Voltar
        </router-link>
        <h1>Resultados: {{ exam?.title }}</h1>
      </div>
    </div>

    <div v-if="isLoading" class="card empty-state">
      <h3>Carregando resultados...</h3>
    </div>

    <div v-else-if="!exam" class="card empty-state">
      <h3>Prova não encontrada</h3>
    </div>
    
    <div v-else-if="results.length === 0" class="card empty-state">
      <h3>Nenhum resultado registrado</h3>
      <p class="text-muted">Os candidatos que finalizarem a prova aparecerão aqui.</p>
    </div>

    <div v-else class="card" style="overflow-x: auto;">
      <table class="results-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Matrícula</th>
            <th>Concluída em</th>
            <th>Nota</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in results" :key="res.id">
            <td>{{ res.name }}</td>
            <td>{{ res.email }}</td>
            <td>{{ res.matricula }}</td>
            <td>{{ new Date(res.completedAt).toLocaleString() }}</td>
            <td><strong>{{ res.score.toFixed(1) }}</strong> / 10</td>
            <td>
              <span class="badge" :class="res.score >= 8 ? 'badge-success' : 'badge-danger'">
                {{ res.score >= 8 ? 'Aprovado' : 'Reprovado' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useExamStore } from '../stores/examStore'
import { ArrowLeftIcon } from 'lucide-vue-next'

const route = useRoute()
const store = useExamStore()

const examId = route.params.id
const isLoading = ref(true)

const exam = computed(() => store.getExam(examId))
const results = computed(() => store.getResultsByExam(examId))

onMounted(async () => {
  if (store.exams.length === 0) {
    await store.fetchExams() // Certifica de ter a prova para o titulo
  }
  await store.fetchResults(examId)
  isLoading.value = false
})

</script>

<style scoped>
.header-action {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th, .results-table td {
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.results-table th {
  font-weight: 600;
  color: var(--text-muted);
  background-color: var(--bg-color);
}

.results-table tr:last-child td {
  border-bottom: none;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background-color: rgba(34, 197, 94, 0.1);
  color: var(--success);
}

.badge-danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.icon-small {
  width: 16px;
  height: 16px;
}
</style>
