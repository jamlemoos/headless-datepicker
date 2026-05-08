<script setup lang="ts">
import CalendarGridPreview from './dev/CalendarGridPreview.vue'
</script>

<template>
  <main>
    <h1>Headless Date Picker</h1>
    <CalendarGridPreview />
  </main>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 16px;
  color: #1f2937;
  background: #f9fafb;
}

main {
  max-width: 800px;
  margin: 48px auto;
  padding: 0 24px;
}

h1 {
  font-size: 24px;
  margin-bottom: 24px;
}
</style>
