export type Chapter = {
  [x: string]: boolean;
  id: number;
  documentId: string;
  title: string;
  description: string;
  duration: number;
  orden: number;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export interface StrapiCourseResponse {
  id: number;
  documentId: string;
  lessons: number;
  title: string;
  description: string;
  profesor: string;
  published: boolean;
  imageUrl: string;
  publishedAt: string;
  totalHours: number;
  numberChapters?: number | null;
  createdAt: string;
  updatedAt: string;
  category: Category[];
  chapters: Chapter[];
}

export type Course = {
  [x: string]: number;
  uuid: string;
  id: number;
  title: string;
  description: string;
  profesor: string;
  lessons: string | number;
  duration: string;
  published: boolean;
  imageUrl: string;
  publishedAt: Date;
  categories: Array<{ name: string }>;
  hours: number;
  chapters: Chapter[];
  courses: Course[];
};

export function fromJsonToCourse(json: StrapiCourseResponse): Course {
  return {
    uuid: json.documentId || "",
    id: json.id,
    title: json.title,
    description: json.description,
    profesor: json.profesor,
    lessons: json.lessons ? `${json.lessons} Lecciones` : "0 Lessons",
    duration: json.totalHours ? `${json.totalHours} horas` : "0 horas",
    published: json.published,
    imageUrl: json.imageUrl,
    publishedAt: new Date(json.publishedAt),
    categories:
      json.category?.map((cat: Category) => ({
        name: cat.name,
      })) ?? [],
    hours: json.totalHours || 0,
    chapters: json.chapters || [],
  };
}
