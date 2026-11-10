export interface Credentials {
  email: string
  password: string
}

export interface SignupInput {
  name: string
  email: string
  phone?: string
  password: string
  planId?: number
}

export const authApi = {
  login: (body: Credentials) => $fetch('/api/auth/login', { method: 'POST', body }),
  register: (body: SignupInput) => $fetch('/api/auth/register', { method: 'POST', body }),
  logout: () => $fetch('/api/auth/logout', { method: 'POST' }),
  verifyEmail: (token: string) => $fetch('/api/auth/verify-email', { method: 'POST', body: { token } }),
  resendVerification: (email: string) => $fetch('/api/auth/resend-verification', { method: 'POST', body: { email } }),
  forgotPassword: (email: string) => $fetch('/api/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token: string, password: string) =>
    $fetch('/api/auth/reset-password', { method: 'POST', body: { token, password } }),
}
