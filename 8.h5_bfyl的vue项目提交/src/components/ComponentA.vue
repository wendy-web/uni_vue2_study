<template>
  <div>
    ComponentA
    这是第一季的
  </div>
</template>

<script>
export default {
  name: 'component-A',
  created () {
    console.log('created ComponentA')
  },
  activated () {
    console.log('activated ComponentA')
  },
  deactivated () {
    console.log('deactivated ComponentA')
  },
  beforeDestroy () {
    console.log('beforeDestroy ComponentA')
  },
  destroyed () {
    console.log('destroyed ComponentA')
  }
}
</script>
