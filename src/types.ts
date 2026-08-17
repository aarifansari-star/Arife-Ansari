export type Category = 'Games' | 'Websites';

export interface Project {
  id: string | number;
  name: string;
  description: string;
  category: Category;
  image: string;
  url: string;
  isNew: boolean;
  visible: boolean;
}
