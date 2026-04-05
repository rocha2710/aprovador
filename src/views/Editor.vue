<template>
  <div class="container">
    <div class="header-action">
      <h1>Editor de Provas</h1>
      <button @click="showForm = !showForm" class="btn btn-primary">
        <PlusIcon class="icon-small" /> Nova Prova
      </button>
    </div>

    <!-- Form de Nova Prova -->
    <div v-if="showForm" class="card exam-form">
      <h3>Criar Nova Prova</h3>
      
      <div class="input-group">
        <label>Título da Prova</label>
        <input v-model="newExam.title" type="text" class="input-control" placeholder="Ex: Prova de Conhecimentos Gerais">
      </div>
      
      <div class="input-group">
        <label>Tempo por questão (minutos)</label>
        <input v-model.number="newExam.timePerQuestion" type="number" min="1" class="input-control" placeholder="Tempo de tela antes de fechar">
      </div>

      <hr class="divider" />
      
      <h4>Questões</h4>
      
      <div v-for="(q, qIndex) in newExam.questions" :key="qIndex" class="question-block">
        <div class="question-header">
          <strong>Questão {{ qIndex + 1 }}</strong>
          <button @click="removeQuestion(qIndex)" class="btn btn-danger btn-sm">
            <TrashIcon class="icon-small" /> Remover
          </button>
        </div>
        
        <textarea v-model="q.text" class="input-control" placeholder="Digite a pergunta aqui..." rows="3"></textarea>
        
        <div class="opts-grid">
          <div v-for="(opt, oIndex) in q.options" :key="oIndex" class="opt-row">
            <input type="radio" :name="`correct-${qIndex}`" :value="oIndex" v-model="q.correctIndex" title="Marcar como correta">
            <span class="opt-letter">{{ String.fromCharCode(65 + oIndex) }})</span>
            <input v-model="q.options[oIndex]" type="text" class="input-control" placeholder="Texto da alternativa">
          </div>
        </div>
      </div>

      <button @click="addQuestion" class="btn btn-outline full-width">
        <PlusIcon class="icon-small" /> Adicionar Questão
      </button>

      <div class="form-actions">
        <button @click="saveExam" class="btn btn-primary" :disabled="!isValid || isSaving">
          {{ isSaving ? 'Salvando...' : 'Salvar Prova' }}
        </button>
        <button @click="showForm = false" class="btn btn-outline" :disabled="isSaving">Cancelar</button>
      </div>
    </div>

    <!-- Lista de provas do editor -->
    <div class="created-exams-section">
      <h3 style="margin-bottom: 1rem;">Provas Criadas</h3>
      
      <div v-if="isLoading" class="card text-muted" style="text-align: center;">
        Carregando provas do banco de dados...
      </div>
      
      <div v-else-if="store.exams.length === 0" class="card text-muted" style="text-align: center;">
        Nenhuma prova criada ainda.
      </div>
      
      <div v-else class="exam-list">
        <div v-for="exam in store.exams" :key="exam.id" class="card list-item">
          <div>
            <strong>{{ exam.title }}</strong>
            <p class="text-muted" style="font-size: 0.85rem;">
              {{ exam.questions.length }} questões &bull; {{ exam.timePerQuestion }} min/questão
            </p>
          </div>
          <div class="list-actions">
            <router-link :to="`/results/${exam.id}`" class="btn btn-outline">
              <BarChartIcon class="icon-small" /> Resultados
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useExamStore } from '../stores/examStore'
import { PlusIcon, TrashIcon, BarChartIcon } from 'lucide-vue-next'

const store = useExamStore()

const showForm = ref(false)
const isSaving = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  if (store.exams.length === 0) {
    await store.fetchExams()
  }
  isLoading.value = false
})

// ... resto do ref ...
const defaultExam = () => ({
  title: '',
  timePerQuestion: 1, // em minutos
  questions: []
})

const newExam = ref(defaultExam())

const addQuestion = () => {
  newExam.value.questions.push({
    text: '',
    options: ['', '', '', '', ''],
    correctIndex: 0
  })
}

const removeQuestion = (idx) => {
  newExam.value.questions.splice(idx, 1)
}

const isValid = computed(() => {
  if (!newExam.value.title || newExam.value.questions.length === 0) return false
  return newExam.value.questions.every(q => q.text.trim() !== '' && q.options.every(o => o.trim() !== ''))
})

const saveExam = async () => {
  if (!isValid.value) return
  isSaving.value = true
  try {
    await store.addExam(newExam.value)
    newExam.value = defaultExam()
    showForm.value = false
  } catch (e) {
    alert('Erro ao salvar no banco de dados.')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.exam-form {
  margin-bottom: 3rem;
}

.divider {
  border: 0;
  border-top: 1px solid var(--border-color);
  margin: 1.5rem 0;
}

.question-block {
  background-color: var(--bg-color);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.opts-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.opt-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.opt-letter {
  font-weight: bold;
  min-width: 24px;
}

.full-width {
  width: 100%;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.created-exams-section {
  margin-top: 2rem;
}

.exam-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}

.list-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-small {
  width: 16px;
  height: 16px;
}
</style>
