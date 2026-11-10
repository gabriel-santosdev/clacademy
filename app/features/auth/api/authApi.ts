export interface Credentials {
  email: string
  password: string
}

export interface SignupInput {
  name: string
  email: string
  phone?: string
  password: string
}

export const authApi = {
  login: (body: Credentials) => $fetch('/api/auth/login', { method: 'POST', body }),
  register: (body: SignupInput) => $fetch('/api/auth/register', { method: 'POST', body }),
  logout: () => $fetch('/api/auth/logout', { method: 'POST' }),
}
