<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const ano = new Date().getFullYear()
const el = ref(null)
const estilo = ref({})
const dev = ref('#a85a00')

// ---- cores tom sobre tom a partir do fundo da página (e contraste AA no texto) ----
const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const css = c => `rgb(${c[0]},${c[1]},${c[2]})`
function fundoDaPagina(n) {
  while (n) {
    const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g)
    if (m && (m.length < 4 || parseFloat(m[3]) > 0.5)) return m.slice(0, 3).map(Number)
    n = n.parentElement
  }
  return [255, 255, 255]
}
// altura de barras fixas no rodapé da tela (menu inferior de app), para a faixa não ficar escondida atrás delas
function alturaBarraFixa() {
  let h = 0
  for (const e of document.body.querySelectorAll('*')) {
    if (e === el.value || e.closest('.cookies')) continue
    const cs = getComputedStyle(e)
    if (cs.position !== 'fixed') continue
    const r = e.getBoundingClientRect()
    if (r.height > 0 && r.height < 160 && r.width > window.innerWidth * 0.6 && r.bottom >= window.innerHeight - 2) h = Math.max(h, r.height)
  }
  return h
}
function ajustar() {
  const base = fundoDaPagina(el.value.parentElement)
  const escuro = lum(base) < 0.35
  const fundo = escuro ? mix(base, [255, 255, 255], 0.07) : mix(base, [0, 0, 0], 0.06)     // tirinha: 6-7% de diferença
  let texto = mix(base, escuro ? [255, 255, 255] : [0, 0, 0], 0.55), t = 0.55
  while (contraste(texto, fundo) < 4.5 && t < 1) { t += 0.05; texto = mix(base, escuro ? [255, 255, 255] : [0, 0, 0], t) }
  dev.value = escuro ? '#ffbd59' : '#a85a00'
  if (contraste(escuro ? [255, 189, 89] : [168, 90, 0], fundo) < 4.5) dev.value = css(texto)
  estilo.value = { background: css(fundo), color: css(texto), paddingBottom: `calc(8px + ${alturaBarraFixa()}px + env(safe-area-inset-bottom, 0px))` }
}
// o menu fixo de baixo pode aparecer depois da montagem: mede de novo e quando a tela muda
let tempos = []
onMounted(() => { ajustar(); tempos = [300, 1200, 3000].map(ms => setTimeout(ajustar, ms)); window.addEventListener('resize', ajustar) })
onBeforeUnmount(() => { tempos.forEach(clearTimeout); window.removeEventListener('resize', ajustar) })
</script>

<template>
  <div ref="el" class="assinatura" :style="estilo">
    <span class="linha">
      <span>Feito por</span>
      <a href="https://instagram.com/igor.rosa" target="_blank" rel="noopener">@igor.rosa</a>
      <span aria-hidden="true">-</span>
      <a class="logo-sa" href="https://superapps.dev" target="_blank" rel="noopener" aria-label="superapps.dev"><span class="sa">SUPERAPPS</span><span class="dev" :style="{ color: dev }">.dev</span></a>
      <span class="foguete" aria-hidden="true">🚀</span>
      <span>{{ ano }}</span>
    </span>
  </div>
</template>

<style>
/* Fontes da logo (Open Sans ExtraBold + Playlist Script), hospedadas em /fonts: sem chamada a servidor externo. */
@font-face { font-family: 'SA Open Sans'; font-weight: 800; font-display: swap; src: url('/fonts/opensans-800.woff2') format('woff2'); }
@font-face { font-family: 'SA Playlist'; font-weight: 400; font-display: swap; src: url('/fonts/playlist-script.woff') format('woff'); }
</style>

<style scoped>
/* Tirinha no fim de tudo: largura total, tudo centralizado (texto e logo na mesma linha), tom sobre tom com o fundo. */
.assinatura { box-sizing: border-box; width: 100%; margin: 0; padding: 8px 12px; text-align: center; font-size: 10.5px; line-height: 1.3; clear: both }
.linha { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0 .4em }
.assinatura a { color: inherit; text-decoration: underline; text-underline-offset: 2px }
.assinatura a:focus-visible { outline: 2px solid currentColor; outline-offset: 2px }
.logo-sa { display: inline-flex; align-items: center; text-decoration: none !important }
.sa { font-family: 'SA Open Sans', 'Open Sans', sans-serif; font-weight: 800; letter-spacing: .5px }
.dev { font-family: 'SA Playlist', cursive; font-size: 1.45em; line-height: 1; margin-left: 1px }
.foguete { font-size: 1.1em; line-height: 1; margin-left: -.15em }
</style>
