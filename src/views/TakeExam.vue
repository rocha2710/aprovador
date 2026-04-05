<template>
  <div class="container take-exam">
    <div v-if="isLoading" class="card empty-state">
      <h3>Carregando prova...</h3>
    </div>

    <div v-else-if="!exam" class="card empty-state">
      <h3>Prova não encontrada</h3>
      <router-link to="/" class="btn btn-outline" style="margin-top: 1rem;">Voltar ao Início</router-link>
    </div>

    <div v-else-if="examFinished" class="card empty-state">
      <CheckCircleIcon class="icon-large" style="color: var(--vale-green);" />
      <h2>Prova Concluída!</h2>
      <p class="text-muted">A sua prova foi submetida com sucesso.</p>
      <router-link to="/" class="btn btn-primary" style="margin-top: 1rem;">Voltar ao Início</router-link>
    </div>

    <!-- Passo 1: Informações de Identidade -->
    <div v-else-if="!isStarted" class="card ident-card">
      <h2 style="text-align: center; margin-bottom: 2rem;">Inscrição para a Prova</h2>
      <p class="text-muted" style="text-align: center; margin-bottom: 2rem;">
        <strong>{{ exam.title }}</strong><br>
        Duração total: {{ totalTimeMinutes }} minutos
      </p>

      <form @submit.prevent="startExam" class="ident-form">
        <div class="input-group">
          <label>Nome Completo</label>
          <input v-model="identity.name" type="text" required class="input-control" placeholder="Seu nome">
        </div>
        
        <div class="input-group">
          <label>Email</label>
          <!-- Utilizado a biblioteca maska pois o v-mask clássico é abandonado no Vue 3.
               Máscara genérica para forçar que não haja espaços e mantenha formato de texto -->
          <input 
            v-model="identity.email" 
            type="email" 
            required 
            class="input-control" 
            placeholder="email@exemplo.com"
            v-maska
          >
        </div>

        <div class="input-group">
          <label>Matrícula</label>
          <input v-model="identity.matricula" type="text" required class="input-control" placeholder="123456" v-maska data-maska="######">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
          Iniciar Prova
        </button>
      </form>
    </div>

    <!-- Passo 2: Execução da Prova -->
    <div v-else class="exam-execution">
      <div class="timer-bar card">
        <div>
          <h3>{{ exam.title }}</h3>
          <p class="text-muted">Desempenho da prova</p>
        </div>
        <div class="timer-display" :class="{ 'warning': timeRemaining < 60 }">
          <TimerIcon class="icon-small" /> {{ formattedTime }}
        </div>
      </div>

      <div class="questions-list">
        <div v-for="(q, qIndex) in exam.questions" :key="qIndex" class="card question-card">
          <h4 style="margin-bottom: 1rem;">{{ qIndex + 1 }}. {{ q.text }}</h4>
          
          <div class="opts-grid">
            <label v-for="(opt, oIndex) in q.options" :key="oIndex" class="opt-label">
              <input type="radio" :name="`answer-${qIndex}`" :value="oIndex" v-model="answers[qIndex]">
              <span class="opt-letter">{{ String.fromCharCode(65 + oIndex) }})</span>
              <span>{{ opt }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="action-footer">
        <button @click="finishExam" class="btn btn-primary" style="padding: 1rem 3rem;" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Finalizar Prova' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '../stores/examStore'
import { TimerIcon, CheckCircleIcon } from 'lucide-vue-next'
import { vMaska } from 'maska/vue'

const route = useRoute()
const router = useRouter()
const store = useExamStore()

const examId = route.params.id
const isLoading = ref(true)
const isSubmitting = ref(false)

const exam = computed(() => store.getExam(examId))

const identity = ref({ name: '', email: '', matricula: '' })

const isStarted = ref(false)
const examFinished = ref(false)

const answers = ref({})
let timerInterval = null
const timeRemaining = ref(0) // em segundos

const totalTimeMinutes = computed(() => {
  if (!exam.value) return 0
  return exam.value.timePerQuestion * exam.value.questions.length
})

const formattedTime = computed(() => {
  const m = Math.floor(timeRemaining.value / 60)
  const s = timeRemaining.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

onMounted(async () => {
  if (store.exams.length === 0) {
    await store.fetchExams()
  }
  isLoading.value = false
})

const startExam = () => {
  if (!exam.value) return
  isStarted.value = true
  
  // inicializa as respostas
  exam.value.questions.forEach((_, idx) => {
    answers.value[idx] = null
  })

  // Inicia o timer
  timeRemaining.value = totalTimeMinutes.value * 60
  
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      finishExam()
    }
  }, 1000)
}

const finishExam = async () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  isSubmitting.value = true

  // Avalia as notas
  let correctCount = 0
  const totalQuestions = exam.value.questions.length

  exam.value.questions.forEach((q, idx) => {
    if (answers.value[idx] === q.correctIndex) {
      correctCount++
    }
  })

  // Regra fixada: dividir por 10 para gerar nota na escala 0 a 10.
  // Equação real: multiplicador = 10 / qtd_questões
  const score = (correctCount / totalQuestions) * 10

  // Salvar o resultado
  try {
    await store.addResult({
      examId: examId,
      name: identity.value.name,
      email: identity.value.email,
      matricula: identity.value.matricula,
      score: score,
      answers: answers.value
    })
    examFinished.value = true
  } catch (err) {
    alert('Houve um erro ao enviar sua prova. Verifique sua conexão.')
  } finally {
    isSubmitting.value = false
  }
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.take-exam {
  max-width: 800px;
}

.empty-state {
  text-align: center;
  padding: 4rem;
}

.icon-large {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}

.ident-card {
  max-width: 500px;
  margin: 0 auto;
}

.timer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: sticky;
  top: 1rem;
  z-index: 10;
}

.timer-display {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vale-dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timer-display.warning {
  color: var(--error);
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from { opacity: 1; }
  to { opacity: 0.7; }
}

.question-card {
  margin-bottom: 1.5rem;
}

.opts-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.opt-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.opt-label:hover {
  background-color: var(--bg-color);
}

.opt-letter {
  font-weight: bold;
}

.action-footer {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  margin-bottom: 4rem;
}

.icon-small {
  width: 24px;
  height: 24px;
}
</style>
