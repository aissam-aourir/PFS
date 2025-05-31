export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  blocked?: boolean;
  // //ajoutee le numero de telephone , mais je l'ai supprime puis je vais le rajuter apres
  // phone?: string;
}

