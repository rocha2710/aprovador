import { defineStore } from 'pinia'
import { ref } from 'vue'
import PocketBase from 'pocketbase'

export const useExamStore = defineStore('examStore', () => {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)
  
  const exams = ref([])
  const results = ref([])

  const fetchExams = async () => {
    try {
      const records = await pb.collection('aprovador_exams').getFullList({
        sort: '-created'
      })
      exams.value = records
    } catch (e) {
      console.error('Error fetching exams from PB', e)
    }
  }

  const fetchResults = async (examId) => {
    try {
      const records = await pb.collection('aprovador_results').getFullList({
        filter: `examId = "${examId}"`,
        sort: '-created'
      })
      results.value = records
    } catch (e) {
      console.error('Error fetching results from PB', e)
    }
  }

  const addExam = async (examObj) => {
    try {
      const record = await pb.collection('aprovador_exams').create(examObj)
      exams.value.unshift(record)
      return record
    } catch (e) {
      console.error('Error creating exam', e)
      throw e
    }
  }

  const addResult = async (resultObj) => {
    try {
      const record = await pb.collection('aprovador_results').create(resultObj)
      // Opcional: Adicionar ao cache local da tela que estivermos
      results.value.unshift(record)
      return record
    } catch (e) {
      console.error('Error creating result', e)
      throw e
    }
  }

  const getExam = (id) => {
    return exams.value.find(e => e.id === id)
  }

  const getResultsByExam = (examId) => {
    // Usamos o cache do ultimo fetchResults
    return results.value.filter(r => r.examId === examId)
  }

  return { pb, exams, results, fetchExams, fetchResults, addExam, addResult, getExam, getResultsByExam }
})
