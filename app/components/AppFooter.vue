<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <p class="footer-brand"><AppIcon name="fish" /> Pangisda</p>
        <p class="small">
          Find fishing spots, log your catches, and fish responsibly. Follow the
          Philippine Fisheries Code (RA 8550, as amended by RA 10654) and local ordinances.
        </p>
      </div>
      <div class="small footer-notes">
        <p><strong>Academic project.</strong> ITE 18 Midterm, Frontend track. Spot and catch data are sample data.</p>
        <p>Font: Plus Jakarta Sans (SIL Open Font License). Icons and illustrations were made for this project.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer { background: var(--c-primary); color: #d9e7ee; padding: var(--space-6) 0; margin-top: auto; }
.footer-inner { display: grid; gap: var(--space-5); }
@media (min-width: 768px) { .footer-inner { grid-template-columns: 1fr 1fr; } }
.footer-brand { display: flex; align-items: center; gap: var(--space-2); color: #fff; font-weight: 800; font-size: var(--fs-lg); margin-bottom: var(--space-2); }
.footer-brand svg { width: 22px; height: 22px; }
.footer-notes p { margin-bottom: var(--space-2); }
.site-footer p { max-width: 60ch; }
</style>
