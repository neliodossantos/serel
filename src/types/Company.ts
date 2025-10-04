type Address = {
  city: string | null;
  country: string | null;
};

type Size = {
  min: number;
  max: number;
};

type Rating = {
  stars: number;
  numberOfReviews: number;
  average: number | null;
  salary: {
    averageAmount: number;
    reviewCount: number;
    satisfiedCount: number;
  };
};

export interface Company {
  id?: string;
  name?: string;
  address?: Address;
  nif?: string;
  sector?: string;
  foundedIn?: Date;
  phone?: string;
  email?: string;
  logo?: string;
  size?: Size;
  website?: string;
  description?: string;
  rating?: Rating;
  createdAt?: Date;
  updatedAt?: Date;
}
