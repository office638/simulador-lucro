// Definindo o tipo de usuário
interface User {
  username: string;
  password: string;
}

// Simulando um banco de dados de usuários
const users: User[] = [
  { username: 'admin', password: 'admin123' }
];

// Função de autenticação que será exportada
export function authenticate(username: string, password: string): boolean {
  return users.some(user => 
    user.username === username && 
    user.password === password
  );
}
