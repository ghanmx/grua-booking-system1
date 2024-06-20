export class AuthenticationDomainFacade {
  private users: Map<string, string> = new Map();

  constructor() {
    // Initialize with some default users
    this.users.set('user1', 'password1');
    this.users.set('user2', 'password2');
  }

  public authenticate(username: string, password: string): boolean {
    const storedPassword = this.users.get(username);
    return storedPassword === password;
  }

  public addUser(username: string, password: string): void {
    this.users.set(username, password);
  }

  public removeUser(username: string): void {
    this.users.delete(username);
  }
}