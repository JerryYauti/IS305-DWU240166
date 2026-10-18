const fs = require('fs/promises');
const path = require('path');

class UserFileRepository {
  constructor(dataDir = path.join(__dirname, '../../data')) {
    this.dataDir = dataDir;
  }

  async ensureDir() {
    await fs.mkdir(this.dataDir, { recursive: true });
  }

  async loadAll() {
    const filePath = path.join(this.dataDir, 'users.json');
    try {
      await fs.access(filePath);
    } catch {
      await this.ensureDir();
      await fs.writeFile(filePath, '[]', 'utf8');
      return [];
    }

    try {
      const raw = await fs.readFile(filePath, 'utf8');
      if (!raw.trim()) return [];
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`Error reading users file: ${error.message}`);
    }
  }

  async saveAll(records) {
    await this.ensureDir();
    const filePath = path.join(this.dataDir, 'users.json');
    try {
      await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Error writing users file: ${error.message}`);
    }
  }

  async create(record) {
    const records = await this.loadAll();
    records.push(record);
    await this.saveAll(records);
    return record;
  }

  async findById(id) {
    const records = await this.loadAll();
    return records.find((item) => item.userId === id) || null;
  }
}

module.exports = UserFileRepository;
