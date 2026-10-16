<script setup>
/**
 * Inline SVG icon set drawn for this project (no third-party icon license needed).
 * Icons are decorative by default (aria-hidden); pass `label` to make one meaningful.
 */
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
})

const ICONS = {
  fish: ['M3 12c3.5-4.5 7.5-6.5 12-6.5 3 0 5.5 2.5 7 6.5-1.5 4-4 6.5-7 6.5-4.5 0-8.5-2-12-6.5Z', 'M3 12 1 8m2 4-2 4', 'M16.5 10.5v.01'],
  pin: ['M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z', 'M12 9.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0'],
  hook: ['M15 3v10a4.5 4.5 0 0 1-9 0v-2l-2 2', 'M15 3h-2'],
  heart: ['M12 20s-7.5-4.6-9.3-9.4A5 5 0 0 1 12 6.4a5 5 0 0 1 9.3 4.2C19.5 15.4 12 20 12 20Z'],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  close: ['M6 6l12 12M18 6 6 18'],
  plus: ['M12 5v14M5 12h14'],
  trash: ['M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6'],
  edit: ['M4 20h4L19 9l-4-4L4 16v4Z', 'M13.5 6.5l4 4'],
  search: ['M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0', 'm20 20-4-4'],
  calendar: ['M4 6h16v14H4z', 'M4 10h16M8 3v4M16 3v4'],
  user: ['M12 8m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0', 'M4 21a8 8 0 0 1 16 0'],
  logout: ['M15 4h4v16h-4', 'M10 8l-4 4 4 4', 'M6 12h10'],
  wave: ['M2 9c2.5-2 5-2 7.5 0s5 2 7.5 0 4.5-2 5-2', 'M2 15c2.5-2 5-2 7.5 0s5 2 7.5 0 4.5-2 5-2'],
  check: ['m5 12.5 4.5 4.5L19 7.5'],
  alert: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'M12 7.5v5.5M12 16.5v.01'],
  info: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'M12 11v5.5M12 7.5v.01'],
  'arrow-left': ['M19 12H5m6-6-6 6 6 6'],
  'arrow-right': ['M5 12h14m-6-6 6 6-6 6'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z'],
  leaf: ['M5 19C5 11 11 5 19 5c0 8-6 14-14 14Z', 'M5 19l8-8'],
  scale: ['M6 7h12l2 13H4L6 7Z', 'M9 7a3 3 0 0 1 6 0'],
  ruler: ['M3 15 15 3l6 6L9 21l-6-6Z', 'M7 11l2 2M10 8l2 2M13 5l2 2'],
  compass: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'm15.5 8.5-2 5-5 2 2-5 5-2Z'],
  external: ['M14 4h6v6M20 4l-9 9', 'M18 14v6H4V6h6'],
  clock: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'M12 7v5l3 2'],
}

const paths = computed(() => ICONS[props.name] || ICONS.fish)
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
  >
    <path v-for="(d, i) in paths" :key="i" :d="d" />
  </svg>
</template>
