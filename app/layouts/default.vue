<template>
  <div class="app-shell">
    <a href="#main" class="skip-link">Skip to main content</a>
    <AppHeader />
    <main id="main" class="app-main" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
    <ToastHost />
  </div>
</template>
