import { getCurrentInstance } from 'vue'
// Link que respeita o modo do roteador (history ou hash). Sem router, devolve o caminho puro.
export function useLinks() {
  const r = getCurrentInstance()?.appContext.config.globalProperties.$router
  return (caminho) => (r ? r.resolve(caminho).href : caminho)
}
