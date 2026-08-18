export interface User {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'organizer' | 'admin';
  avatar?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  lat?: number;
  lng?: number;
  image?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  price: number;
  currency: string;
  spotsTotal: number;
  spotsAvailable: number;
  image?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  category: Category;
  venue: Venue;
  organizer: User;
  categoryId: string;
  venueId: string;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  spotsCount: number;
  status: 'confirmed' | 'cancelled' | 'checked_in';
  event: EventItem;
  user: User;
  ticket?: Ticket;
  createdAt: string;
}

export interface Ticket {
  id: string;
  code: string;
  bookingId: string;
  eventId: string;
  spotsCount: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: User;
  event: EventItem;
  createdAt: string;
}

export interface ReviewResponse {
  reviews: Review[];
  avgRating: number;
  count: number;
}

export interface PaginatedEvents {
  events: EventItem[];
  total: number;
  page: number;
  pages: number;
}

export interface PaginatedBookings {
  bookings: Booking[];
  total: number;
  page: number;
  pages: number;
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  pages: number;
}

export interface VenuesResponse {
  venues: Venue[];
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface OrganizerStats {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  avgOccupancy: number;
  events: EventItem[];
}

export interface EventStats {
  bookings: number;
  revenue: number;
  occupancy: number;
  rating: number;
  reviews: Review[];
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  globalOccupancy: number;
  topEvents: EventItem[];
  weeklyTrend: TrendPoint[];
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface WeeklyTrendResponse {
  data: TrendPoint[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
