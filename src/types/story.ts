export type Story = {
  id: string;
  slug: string;
  title: string;
  image?: string;
  excerpt?: string;
  content?: string;      // long text/markdown for reading
  author?: string;
  createdAt?: any;
  updatedAt?: any;
  published?: boolean;
};
