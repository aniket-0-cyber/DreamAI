interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    createdAt: new Date("2024-01-01")
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    isActive: false,
    createdAt: new Date("2024-01-02")
  }
];

export function getUserById(id: number): User | undefined {
  return users.find(user => user.id === id);
} 