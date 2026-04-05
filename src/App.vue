<template>
  <div class="app-wrapper">
    <header class="header">
      <div class="container header-content">
        <h2 class="logo-text">Aprovador</h2>
        <nav class="nav-links">
          <router-link to="/">Lista de Provas</router-link>
          <router-link to="/editor">Editor</router-link>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container">
        Desenvolvido por <a href="https://superapps.com.br" target="_blank" rel="noopener">Superapps.dev</a> 🚀
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
}

.logo-text {
  margin: 0;
  color: var(--vale-dark);
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a.router-link-active {
  color: var(--vale-green);
}

.nav-links a:hover {
  color: var(--vale-dark);
}

.main-content {
  flex: 1;
}

.footer {
  background-color: var(--vale-green);
  color: white;
  text-align: right;
  padding: 1rem 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.footer .container {
  padding-top: 0;
  padding-bottom: 0;
}

.footer a {
  color: white;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
