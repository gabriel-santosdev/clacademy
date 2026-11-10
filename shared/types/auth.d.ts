declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    email: string
    role: 'admin' | 'professor' | 'aluno'
  }
}

export {}
