export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = () => {
    try {
      return localStorage.getItem('isAuthenticated') === 'true'
    } catch (error) {
      return false
    }
  }

  if (to.path !== '/login' && !isAuthenticated()) {
    return navigateTo('/login')
  }
  if (to.path === '/login' && isAuthenticated()) {
    return navigateTo('/')
  }
})