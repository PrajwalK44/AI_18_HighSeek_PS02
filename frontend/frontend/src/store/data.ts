import { User, FAQ, Escalation } from "../types";
import { format } from "date-fns";

// Mock data store
class DataStore {
  private users: User[] = [
    {
      username: "admin",
      password: "admin123",
      department: "Admin",
      role: "admin",
    },
    {
      username: "hr_user",
      password: "password123",
      department: "HR",
      role: "user",
    },
    {
      username: "sales_user",
      password: "password123",
      department: "Sales",
      role: "user",
    },
    {
      username: "finance_user",
      password: "password123",
      department: "Finance",
      role: "user",
    },
  ];

  private faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I request vacation time?",
      answer:
        "Login to the HR portal, navigate to 'Time Off', and submit a new request with your desired dates.",
      department: "HR",
      tags: ["vacation", "time off", "leave"],
    },
    {
      id: 2,
      question: "What is the current sales target?",
      answer:
        "The Q1 sales target is $1M, with individual targets available in your Sales Dashboard.",
      department: "Sales",
      tags: ["targets", "goals", "performance"],
    },
    {
      id: 3,
      question: "How do I submit an expense report?",
      answer:
        "Use the Finance Portal to create a new expense report, attach receipts, and submit for approval.",
      department: "Finance",
      tags: ["expenses", "reimbursement", "reports"],
    },
  ];

  private escalations: Escalation[] = [];
  private nextFaqId = 4;

  // User methods
  getUsers(): User[] {
    return this.users.map(({ password, ...user }) => user);
  }

  getUserByEmail(email?: string): User | null {
    if (!email) return null;
    const user = this.users.find((u) => u.email === email);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  addUserFromAuth0(user: User): User {
    // Check if username already exists
    if (this.users.some((u) => u.username === user.username)) {
      // If username exists, create a unique one
      let counter = 1;
      let newUsername = `${user.username}${counter}`;
      while (this.users.some((u) => u.username === newUsername)) {
        counter++;
        newUsername = `${user.username}${counter}`;
      }
      user.username = newUsername;
    }

    // Add user to the store with a default password
    const newUser = { ...user, password: "auth0user" };
    this.users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  addUser(user: User): void {
    if (this.users.some((u) => u.username === user.username)) {
      throw new Error("Username already exists");
    }
    this.users.push(user);
  }

  deleteUser(username: string): void {
    const index = this.users.findIndex((u) => u.username === username);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  validateUser(username: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  // FAQ methods
  getFAQs(): FAQ[] {
    return this.faqs;
  }

  addFAQ(faq: Omit<FAQ, "id">): FAQ {
    const newFAQ = { ...faq, id: this.nextFaqId++ };
    this.faqs.push(newFAQ);
    return newFAQ;
  }

  deleteFAQ(id: number): void {
    const index = this.faqs.findIndex((f) => f.id === id);
    if (index !== -1) {
      this.faqs.splice(index, 1);
    }
  }

  // Escalation methods
  getEscalations(): Escalation[] {
    return this.escalations;
  }

  addEscalation(query: string, username: string): void {
    this.escalations.push({
      query,
      user: username,
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });
  }

  // Export/Import methods
  exportData(): string {
    const exportData = {
      users: this.users.map(({ password, ...user }) => user),
      faqs: this.faqs,
      escalations: this.escalations,
    };
    return JSON.stringify(exportData, null, 2);
  }

  importData(data: string): void {
    try {
      const importedData = JSON.parse(data);
      if (importedData.faqs) {
        this.faqs = importedData.faqs;
        this.nextFaqId = Math.max(...this.faqs.map((f) => f.id)) + 1;
      }
      if (importedData.users) {
        // Keep admin user
        const adminUsers = this.users.filter((u) => u.username === "admin");
        this.users = adminUsers;

        // Add imported users with default password
        importedData.users.forEach((user: User) => {
          if (user.username !== "admin") {
            this.users.push({
              ...user,
              password: "password123",
            });
          }
        });
      }
    } catch (error) {
      throw new Error("Invalid import data");
    }
  }
}

export const dataStore = new DataStore();
