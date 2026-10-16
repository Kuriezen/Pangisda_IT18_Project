<script setup>
const ui = useUiStore()
const icons = { success: 'check', error: 'alert', info: 'info' }
</script>

<template>
  <div class="toast-host" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="toast">
      <div v-for="t in ui.toasts" :key="t.id" class="toast" :class="`toast-${t.type}`" role="status">
        <AppIcon :name="icons[t.type] || 'info'" />
        <span class="toast-msg">{{ t.message }}</span>
        <button type="button" class="toast-close" aria-label="Dismiss notification" @click="ui.dismiss(t.id)">
          <AppIcon name="close" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-host { position: fixed; z-index: 90; bottom: var(--space-4); left: var(--space-4); right: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); align-items: center; pointer-events: none; }
@media (min-width: 640px) { .toast-host { left: auto; align-items: flex-end; } }
.toast { pointer-events: auto; display: flex; align-items: center; gap: var(--space-3); width: 100%; max-width: 380px; padding: var(--space-3) var(--space-3) var(--space-3) var(--space-4); border-radius: var(--radius); background: var(--c-text); color: #fff; box-shadow: var(--shadow-lg); font-size: var(--fs-sm); font-weight: 550; }
.toast svg { width: 20px; height: 20px; flex: none; }
.toast-success svg:first-child { color: #6ee7b7; }
.toast-error { background: #7a1a12; }
.toast-info svg:first-child { color: #93c5fd; }
.toast-msg { flex: 1; }
.toast-close { display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 8px; background: transparent; color: #fff; cursor: pointer; }
.toast-close:hover { background: rgb(255 255 255 / .12); }
.toast-close svg { width: 16px; height: 16px; }
.toast-enter-active, .toast-leave-active { transition: all .25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
