<template>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  display: block;
  max-width: 100%;
  overflow: hidden;
}

p {
  color: #333;
  margin: 0;
}

.ant-table-thead > tr > th {
  background-color: transparent;
  border-bottom: none;
}

.ant-table-tbody > tr > td {
  border-bottom: none;
}
</style>
