export interface EquipmentInput {
  name: string;
  location: string;
  isActive: boolean;
}

export interface Equipment {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
