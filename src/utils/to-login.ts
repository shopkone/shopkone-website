export const toLogin = () => {
  if (!window.location.href.includes('accounts')) {
    window.location.href = '/accounts/login'
  }
}
