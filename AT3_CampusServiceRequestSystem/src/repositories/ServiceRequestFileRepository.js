const fs = require('fs/promises');
const path = require('path');

class ServiceRequestFileRepository {
  constructor(dataDir = path.join(__dirname, '../../data')) {
    this.dataDir = dataDir;
  }

  async ensureDir() {
    await fs.mkdir(this.dataDir, { recursive: true });
  }

  async loadAll() {
    const filePath = path.join(this.dataDir, 'serviceRequests.json');
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
      throw new Error(`Error reading service requests file: ${error.message}`);
    }
  }

  async saveAll(records) {
    await this.ensureDir();
    const filePath = path.join(this.dataDir, 'serviceRequests.json');
    try {
      await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Error writing service requests file: ${error.message}`);
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
    return records.find((item) => item.requestId === id) || null;
  }

  async findByRequester(userId) {
    const records = await this.loadAll();
    return records.filter((item) => item.requesterId === userId);
  }

  async findByTechnician(technicianId) {
    const records = await this.loadAll();
    return records.filter((item) => item.assignedTechnicianId === technicianId);
  }

  async update(id, changes) {
    const records = await this.loadAll();
    const index = records.findIndex((item) => item.requestId === id);
    if (index === -1) return null;
    records[index] = { ...records[index], ...changes };
    await this.saveAll(records);
    return records[index];
  }
}

module.exports = ServiceRequestFileRepository;
