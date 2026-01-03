export interface Subject {
  _id: string;
  userId: string;
  name: string;
  code: string;
  unit: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectPayload {
  name: string;
  code: string;
  unit: number;
}

export interface SubjectsSummaryProps {
  totalCourses: number;
  totalUnits: number;
  loading?: boolean;
  onSuccess?: () => void; 
}
