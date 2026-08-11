import { db } from './index.ts';
import { movements } from './schema.ts';
import { MovementRecord } from '../types.ts';
import { desc } from 'drizzle-orm';

export async function getAllMovementsFromDb(): Promise<MovementRecord[]> {
  try {
    const rows = await db.select().from(movements).orderBy(desc(movements.createdAt));
    return rows.map((r) => ({
      id: r.recordId,
      plant: r.plant as any,
      agentId: r.agentId,
      fullName: r.fullName,
      email: r.email,
      role: r.role,
      phone: r.phone || undefined,
      timeIn: r.timeIn,
      timeOut: r.timeOut,
      lat: r.lat,
      lon: r.lon,
      zone: r.zone,
      observation: r.observation,
      riskLevel: r.riskLevel as any,
      ppeStatus: {
        helmet: r.helmetOk ?? true,
        vest: r.vestOk ?? true,
        boots: r.bootsOk ?? true,
        goggles: r.gogglesOk ?? true,
      },
      createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch movements from DB:', error);
    throw new Error('Database query for movements failed.', { cause: error });
  }
}

export async function insertMovementToDb(record: MovementRecord, userId?: number): Promise<MovementRecord> {
  try {
    const result = await db.insert(movements)
      .values({
        recordId: record.id,
        userId: userId || null,
        plant: record.plant,
        agentId: record.agentId,
        fullName: record.fullName,
        email: record.email,
        role: record.role,
        phone: record.phone || null,
        timeIn: record.timeIn,
        timeOut: record.timeOut,
        lat: record.lat,
        lon: record.lon,
        zone: record.zone,
        observation: record.observation,
        riskLevel: record.riskLevel,
        helmetOk: record.ppeStatus.helmet,
        vestOk: record.ppeStatus.vest,
        bootsOk: record.ppeStatus.boots,
        gogglesOk: record.ppeStatus.goggles,
      })
      .onConflictDoUpdate({
        target: movements.recordId,
        set: {
          timeOut: record.timeOut,
          observation: record.observation,
          riskLevel: record.riskLevel,
        },
      })
      .returning();

    const r = result[0];
    return {
      id: r.recordId,
      plant: r.plant as any,
      agentId: r.agentId,
      fullName: r.fullName,
      email: r.email,
      role: r.role,
      phone: r.phone || undefined,
      timeIn: r.timeIn,
      timeOut: r.timeOut,
      lat: r.lat,
      lon: r.lon,
      zone: r.zone,
      observation: r.observation,
      riskLevel: r.riskLevel as any,
      ppeStatus: {
        helmet: r.helmetOk ?? true,
        vest: r.vestOk ?? true,
        boots: r.bootsOk ?? true,
        goggles: r.gogglesOk ?? true,
      },
      createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to insert movement record:', error);
    throw new Error('Database insert for movement failed.', { cause: error });
  }
}
